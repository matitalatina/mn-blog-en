---
layout: post
title: JWT authentication with Angular
description: Let's learn how to integrate our JWT authentication system in Angular
image: img/angular-jwt-auth/angular-jwt-rxjs.jpg
author: Mattia Natali
date: 2019-12-15T16:40:20.172Z
tags: 
  - Dev
  - Auth
  - How-to
draft: false
---

At work, I had to create a new web portal that should communicate with our backend.
**Our frontend framework choice is Angular and our backend uses the JWT (JSON Web Token) as the authentication system.**

So my goal was to integrate that authentication system in Angular to communicate with the backend.
Since this was an Angular project started from scratch, I had the chance to think about how to implement it.


## Objectives

My acceptance criteria were the following ones:

- To get the token, the frontend should call the endpoint `POST auth/login` with `email` and `password`. The backend will reply with `accessToken` and `refreshToken`.
- The frontend should persist both tokens, so the user will be still authenticated even if he closes the browser.
- It should send the accessToken for every authenticated API calls. It sends the token inside the header `X-AUTH-TOKEN`.
- If the backend replies `401 - Unauthorized`, it means that the token is expired. So the frontend should call the endpoint `POST auth/refresh` passing `refreshToken`. If the `refreshToken` is valid, the backend replies with new `accessToken` and `refreshToken` in the response body.
  - After retrieving the new `accessToken`, it should retry the failed call with the refreshed token.
  - If the backend reply again with `401 - Unauthorized` during refresh, it means that the `refreshToken` is not valid anymore. We need to logout the user.
- We should handle all this stuff transparently, the developer should not worry too much about that when he implements some class to communicate with the backend.

This flow should be pretty standard for a JWT Auth system. Now let's think about how to architecture it!

## Prerequisites

I'm expecting from you some knowledge about these topics:

- [Angular](https://angular.io/) and [Angular interceptors](https://angular.io/guide/http#intercepting-requests-and-responses).
- [RxJS](https://rxjs-dev.firebaseapp.com/) that is built-in in Angular [HTTP Client](https://angular.io/guide/http).

## Architecture

I built this JWT integration using [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development). So I ended up with easily testable classes that have one single responsibility. This is the beauty of TDD: to simplify testing you **have to** write good code!

I built the following classes:

- `AuthClient`: it makes the API calls to the backend. In our example, we will implement `auth/login` and `auth/refresh`.
- `AuthStore`: it persists the tokens and keeps the state of the users. We can know whether the users are authenticated or not.
- `AuthService`: it manages the business logic of our authentication system, it exploits both `AuthClient` and `AuthStore`.
- `AuthInterceptor`: it injects the token in every authenticated API calls, also it handles the retry logic when the `accessToken` is expired.

We can achieve our acceptance criteria with these classes, now let's implement them!

## Implementation

### Interfaces

Building a single page application is complex. It handles a lot of different objects and it's very difficult to keep track of them without a type system. TypeScript adds types to JavaScript and I exploit this as much as I can.
So I always create a folder `/model` that keeps track of all the objects that I create or receive from the backend.
In this tutorial, we will face with these interfaces:

```typescript
export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshRequest {
  refreshToken: string;
}

```

### AuthClient

`AuthClient` is very simple to implement. It just makes the API calls to our backend

```typescript
import { Injectable } from '@angular/core';
import { ILogin } from './model/Login';
import { ILoginResponse } from './model/LoginResponse';
import { IRefreshRequest } from './model/RefreshRequest';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { INTERCEPTOR_NO_AUTH_HEADER } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthClient {

  constructor(
    private http: HttpClient,
  ) { }

  login(request: ILogin): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${environment.portalBaseUrl}/auth/login`,
        request,
        {
          headers: { [INTERCEPTOR_NO_AUTH_HEADER]: 'true' }
        }
      );
  }

  refreshToken(request: IRefreshRequest) {
    return this.http
      .post<ILoginResponse>(`${environment.portalBaseUrl}/refresh`,
        request,
        {
          headers: { [INTERCEPTOR_NO_AUTH_HEADER]: 'true' }
        }
      );
  }
}

```

You can see `AuthClient` is quite simple. The only weird thing is the header `INTERCEPTOR_NO_AUTH_HEADER` that has a special meaning. It's my way to communicate with `AuthInterceptor`, I'm saying: "Hey! This is a public API call, you don't need to inject the token". I talk about it in more detail later.

### AuthStore

It stores and persists the user credentials. **My implementation is heavily inspired by the Business Logic Component (BLoC) pattern + RxJS**. This is a new pattern that raises in [Dart + Flutter world](https://medium.com/flutter-community/why-use-rxdart-and-how-we-can-use-with-bloc-pattern-in-flutter-a64ca2c7c52d). I like it and I ported the concept in Angular.
I don't want to talk too much about BLoC pattern since there are [many articles about it](https://www.google.com/search?q=BLoC+Pattern&oq=BLoC+Pattern).

In a nutshell: I exploit RxJS to create a reactive credential store, anyone is interested in some auth data should subscribe to it. If someone wants to change auth data, he can call the auth methods. Very simple.

#### Generic Store

The first thing to do is creating the generic store that handles the state of type `T`. This is agnostic about the state, so this is an abstract class. This store is simply called `Store`.

```typescript
import { Observable, BehaviorSubject } from 'rxjs';

export class Store<T> {
    state$: Observable<T>;
    private stateSubject$: BehaviorSubject<T>;

    protected constructor(initialState: T) {
        this.stateSubject$ = new BehaviorSubject(initialState);
        this.state$ = this.stateSubject$.asObservable();
    }

    get state(): T {
        return this.stateSubject$.getValue();
    }

    setState(nextState: T): void {
        this.stateSubject$.next(nextState);
    }
}
```

As you can see:

- It accepts the initial state in the constructor.
- You can change the state calling `setState` method.
- You can subscribe to state changes by subscribing to `state$` observable.
- You can get the current state one-shot by `state` getter.

**The engine of my store is the private `stateSubject$` BehaviorSubject**. If this is the [first time that you see a BehaviorSubject](https://www.learnrxjs.io/subjects/behaviorsubject.html), think about a stream that has also a "sink", where you can add a new element in the stream by calling `next` method. BehaviorSubject has also the initial state that you should provide in the constructor.

Another cool thing about it, you can keep the "sink" private and only expose its observable. I'm exposing only the `state$` variable that is the `Observable` created from `stateSubject$`.
In this way, no one can add an element in this observable except calling `setState` method. In other words, you can only see the changes subscribing `state$` observable, and you can change the store data by `setState` method. The implementation of the store is managed by `stateSubject$` that is not exposed externally.

#### Concrete implementation

Now we can create our `AuthStore`, the first concrete implementation of the `Store`.

```typescript
import { IAuthState } from './auth-store.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '../shared/store';
import { Observable } from 'rxjs';
import { ILoginResponse } from './model/LoginResponse';

export interface IAuthState {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService extends Store<IAuthState> {
  constructor() {
    const initialState: IAuthState = {
      accessToken: null,
      refreshToken: null,
    };
    super(initialState);
  }

  get isLoggedIn(): boolean {
    return !!this.state.accessToken;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.state$.pipe(map((state) => !!state.accessToken));
  }

  get accessToken(): string {
    return this.state.accessToken;
  }

  setAccessToken(accessToken: string) {
    this.setState({ ...this.state, accessToken });
  }

  get refreshToken(): string {
    return this.state.refreshToken;
  }

  login(loginResponse: ILoginResponse): void {
    this.setState({ ...this.state, ...loginResponse});
  }

  refresh(newTokens: ILoginResponse): void {
    this.setState({ ...this.state, ...newTokens });
  }

  logout(): void {
    this.setState({
      ...this.state,
      accessToken: null,
      refreshToken: null,
    });
  }
}
```

There are a lot of helper methods to simplify the class usage. These are the key points of this class:

- It's a `Store` subclass, it has `IAuthState` interface as state. `IAuthState` is very simple, it contains only `accessToken` and `refreshToken`.
- In the constructor, it provides the initial state for the superclass `State`.
- A lot of getters method: both reactive (ends with `$`), and standard (classic variables).
- Some helper methods to change the state of the store (`setAccessToken`, `login`, `refresh`).

Now our AuthStore is ready to go! Let's go to the class that wires everything together: the `AuthService`!

### AuthService

`AuthService` is the class that contains the business logic to make authentication works. Let's see the code:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthClient, IRefreshRequest } from './auth-client.service';
import { AuthStoreService } from './auth-store.service';
import { ILogin } from './model/Login';
import { ILoginResponse } from './model/LoginResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authClient: AuthClient,
    private authStore: AuthStoreService,
    private router: Router,
  ) { }

  login(request: ILogin): Observable<ILoginResponse> {
    return this.authClient.login(request)
      .pipe(
        tap(loginResponse => this.authStore.login(loginResponse)),
      );
  }

  refresh(refreshTokenRequest: IRefreshRequest): Observable<ILoginResponse> {
    return this.authClient.refreshToken(refreshTokenRequest)
      .pipe(
        tap(refreshResponse => this.authStore.refresh(refreshResponse))
      );
  }

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
```

This class uses both the `AuthClient`, to make API calls, and `AuthStore`, to persist credentials.
There are three methods that we can call:

- `login`: we call it when we want the user to login. It calls login API and then persists the credential in AuthStore.
- `refresh`: used to refresh the token. It makes API calls and then persists them.
- `logout`: it clears the `AuthStore` and then navigates users to login page.

This is a simplified version of my implementation. During login, I made also an API calls to an endpoint to get user data (also called `auth/me`). I didn't add it because its implementation depends on your architecture and it's out of the blog post's scope. The key point is this: **you should add all your authentication business logic here**, delegating the persistence to `AuthStore` and the API calls to `AuthClient`.

### AuthInterceptor

We are in the last part of this blog post: we can authenticate the user and persist credentials in the `AuthStore`. We can refresh the token when it expires. We can logout the user.

Now we focus on these goals:

1. Not passing the token when we call a public API. 
2. Passing the JWT token during authenticated API calls.
3. Refreshing the token when the `accessToken` expires. We know the token expires only when we make some API calls: so when an API call fails, because the token is expired, we need to call refresh API call to get the new token, then we need to make again the first call with the refreshed token.

All this stuff is managed by the `AuthInterceptor`. It is a subclass of [Angular HTTP Interceptor](https://angular.io/guide/http#http-interceptors). Briefly speaking, **an HTTP Interceptor is a layer that we can add between the API call we make and the real HTTP Request made by the browser**. In this way, we can transparently inject all these auth behavior without changing our Client classes.

#### Understanding HTTP Interceptor

First of all, we need to understand how to implement an HTTP Interceptor: `AuthInterceptor` should implement `HttpInterceptor` interface. So we have to implement the method

```typescript
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
```

The first parameter is the HTTP request that Angular is going to do. At the end of our logic, we need to call `next.handle(request)` to continue the HTTP request through the normal flow.
In other words, let's assume we create an HTTP interceptor that does absolutely nothing. The minimum code we have to write is this

```typescript
@Injectable()
export class NoOpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request);
    }
}
```

#### AuthInterceptor implementation

Now we do the same thing for our `AuthInterceptor`, but this time we have to add all the authentication logic that we said before.

Let's have a look at its implementation:

```typescript
import { AuthStoreService } from './auth-store.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { INTERCEPTOR_NO_AUTH_HEADER } from './constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authStore: AuthStoreService,
        private authService: AuthService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* If the incoming request has the special INTERCEPTOR_NO_AUTH_HEADER,
           it means that we don't have to add the JWT token
        */
        if (request.headers.get(INTERCEPTOR_NO_AUTH_HEADER)) {
            /* So just send to the next handler the same request
               removing the special header INTERCEPTOR_NO_AUTH_HEADER
            */
            return next.handle(request.clone({
                headers: request.headers.delete(INTERCEPTOR_NO_AUTH_HEADER)
            }));
        }
        // If the user is logged in
        if (this.authStore.isLoggedIn) {
            return next
                // Then add the token and continue the API call.
                .handle(this.addTokenToRequest(request))
                .pipe(
                    // But if the call has failed, try to recover it using retryWhenExpiredToken method
                    catchError(this.retryWhenExpiredToken(request, next)),
                    tap({
                        error: (err: HttpErrorResponse) => {
                            /*
                              If the call, after our refresh method, is still failing with
                              401 UNAUTHORIZED status code
                            */
                            if (err.status === 401) {
                                // Then logout the user, nothing else we can do.
                                this.authService.logout();
                            }
                        }
                    }),
                );
        }
        /*
          If the user is not logged in, just do nothing.
          We don't have any JWT token to attach to the request
        */
        return next.handle(request);
    }

    // This method is called only during an error response
    private retryWhenExpiredToken(req: HttpRequest<any>, next: HttpHandler): (response: any) => Observable<any> {
        return response => {
            const refreshToken = this.authStore.refreshToken;
            /* If the status code is 401 UNAUTHORIZED and we don't have the refresh token,
               or the status code is different from 401 UNAUTHORIZED
            */
            if (response.status === 401 && !refreshToken || response.status !== 401) {
                // We can do nothing, just re-raise the error and continue.
                throw response;
            }

            // Otherwise, call the backend to refresh our token
            return this.authService
                .refresh({ refreshToken })
                .pipe(
                    // Then re-call the failed request with the brand new token
                    mergeMap(() => {
                        return next.handle(this.addTokenToRequest(req));
                    }),
                );
        };
    }

    // It just clones the request, adding the JWT token to the request
    private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
        return request
            .clone({
                setHeaders: {
                    'X-JWT-TOKEN': this.authStore.accessToken,
                }
            });
    }
}
```

Take your time to read it... We see that the `intercept` method is more complex. **I added tons of comments inside the code**, so it's easier to understand what's happening.

Let's see whether we reached all our prefixed goals:

1. *Not passing the token when we call a public API:* done by `INTERCEPTOR_NO_AUTH_HEADER` special header.
2. *Passing the JWT token during API calls:* done thanks to `addTokenToRequest` method.
3. *Refreshing the token when the `accessToken` expires:* achieved by `retryWhenExpiredToken` method.

The code is not so long, it has more or less 50 lines. But I think is pretty full of tricky concepts from RxJS like [mergeMap](https://www.learnrxjs.io/operators/transformation/mergemap.html), [tap](https://www.learnrxjs.io/operators/utility/do.html), [catchError](https://www.learnrxjs.io/operators/error_handling/catch.html).

[I used closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) to make `retryWhenExpiredToken` works. I created a function that returns a function. The first call gets the original request and the `next` handler and returns the function that we feed the method `catchError`.

**Writing this code without bugs in one-shot is very difficult**, even if it's not long. Two things helped me reaching it:

- **Heavy usage of TypeScript typing system**: TypeScript add types to JS, thank god! Adding types to everything is the best way to avoid nasty bugs. The transpiler can warn you as soon as possible if you're returning something wrong. If you put `any` everywhere, or you don't add types for your expected parameters, you're alone! The transpiler can't help you, soon or later you make a mistake. The only `any` you see in this code is because the `intercept` signature is coming from Angular and I can't do anything about it.
- **Use Test Driven Development (TDD)** for the crucial part of your system, or use TDD as much as you can. Testing manually this authentication system takes much longer than writing some unit tests. And there's nothing worse than someone calls you saying users can't sign in. I made this using TDD and the result is these tiny classes that are easy to test thanks to the [Angular testing suite](https://angular.io/guide/testing).

The perfect developer, that makes no bugs, doesn't exist. **Some developers are better than others not because are perfect, but because they take more countermeasures to avoid bugs**, so they write less buggy code. TypeScript and TDD are the most effective countermeasure that I know for front-end development. So use them.

If you are interested in TDD, I wrote two articles about that. Unfortunately, they are written in Italian. If you are interested in the translation just let me know: [ping me on LinkedIn](https://www.linkedin.com/in/mattian/) and [subscribe to my newsletter](https://gmail.us4.list-manage.com/subscribe/post?u=a8dbd77c4662328d660883c64&amp;id=31345af945) to be notified about these topics.
Here are the links:

- [[Italian] How to code in TDD, starting from scratch](https://www.mattianatali.it/come-sviluppare-in-test-driven-development-tdd-partendo-da-zero/).
- [[Italian] How to develop RESTful API using Spring Boot and TDD](https://www.mattianatali.it/come-sviluppare-rest-api-in-tdd-con-spring-boot/).

#### Adding AuthInterceptor to Angular app

We must remember to add the AuthInterceptor to our application.
This is very easy: we need to declare it inside the root Angular module of the app

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [...],
  imports: [
    AuthModule,
    ...
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ...
  ]
})
export class AppModule { }
```

And that's it! Now our app handles the JWT authentication of our back-end!

### Conclusion

I hope you enjoyed this journey about JWT authentication + Angular. This is my implementation, and it satisfied all my goals. I hope this work inspires you to reach yours too!

See you!