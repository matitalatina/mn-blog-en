---
layout: post
title: JWT Token Auth integration with Angular
excerpt: Let's learn how to integrate our JWT Token Auth system in Angular
image: img/vpn-ansible/ansible-cog-head.jpg
author: [Mattia Natali]
date: 2019-08-25T07:03:47.149Z
tags: 
  - Dev
  - Auth
  - How-to
draft: true
---

This week I had to create a new web portal that should communicate with our backend.
Our frontend framework choice is Angular and our backend uses the JWT as an authentication system.

So my goal was to integrate that authentication system in Angular to communicate properly with the backend.
Since this was an Angular project started from scratch, I had the chance to think about how to implement in the best way possible.


## Objectives

My acceptance criteria were the following ones:

- To get the token, the frontend should call the endpoint `POST auth/login` with `email` and `password`. The backend will reply with `accessToken` and `refreshToken`.
- The frontend should persist both tokens, so the user will be still authenticated even if he closes the browser.
- It should send the accessToken for every API calls that should be authenticated. It sends the token inside the header `X-AUTH-TOKEN`.
- If the backend replies `401 - Unauthorized`, it means that the token is expired. So the frontend should call the endpoint `POST auth/refresh` passing `refreshToken`. If the `refreshToken` is valid, the backend replies with new `accessToken` and `refreshToken` in the response body.
  - After retrieving the new `accessToken`, it should retry the failed call with the refreshed token.
  - If the backend reply again with `401 - Unauthorized` during refresh, it means that the `refreshToken` is not valid anymore. We need to logout the user.
- All these stuff should be handled transparently, the developer should not worry too much about that when he implements some class to communicate with the backend.

This flow should be pretty standard for a JWT Auth system. Now let's think about how to architecture it!

## Architecture

I built this JWT integration using [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development). So I ended up with easily testable classes that have one single responsibility. This is the beauty of TDD: to simplify testing you **have to** write good code!

I built the following classes:

- `AuthClient`: it makes the API calls to the backend. In our example, we will implement `auth/login` and `auth/refresh`.
- `AuthStore`: it persists the tokens and keeps the state of the users. We are able to know whether the users is authenticated or not thanks to it.
- `AuthService`: it manages the business logic of our authentication system, it exploits both `AuthClient` and `AuthStore`.
- `AuthInterceptor`: it injects the token in every authenticated API calls, it handles also the retry logic when the `accessToken` is expired.

We are able to achieve our acceptance criteria with these classes, now let's implement them!

## Implementation

### Interfaces

Building a single page application is very complex, it handles lot of different objects and it's very difficult to keep track them without a type system. TypeScript adds types to JavaScript and I exploit this as much as I can.
So I always create a folder `/model` that keeps track of all the object that I create or receive from backend.
In this tutorial we will face with these interfaces:

```typescript
```

### AuthClient

`AuthClient` is very simple to implement. It just makes the API calls to our backend