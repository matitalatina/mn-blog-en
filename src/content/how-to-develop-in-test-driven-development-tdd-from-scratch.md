---
layout: post
title: How to program in Test-Driven Development (TDD) starting from scratch
excerpt: In this guide we'll discover together how to develop in TDD and what benefits it brings to our code.
image: img/tdd/coding-man.jpg
author: [Mattia Natali]
date: 2018-12-28T07:03:47.149Z
tags: 
  - Dev
  - How-to
  - Getting Started
  - Testing
  - TDD
  - TypeScript
draft: false
---

TDD here, TDD there, everyone talks about it. Many praise its merits, others say it's a waste of time... But in the end, how do you actually develop in TDD?

In this guide you'll see a real example developed in [Test-Driven Development](https://en.wikipedia.org/wiki/Test-driven_development). I've been adopting this programming technique for over a year for the backends I develop in Java, Python and TypeScript. The benefits in the code I've written are visible and many. I hope I can convince you that this technique:

- Improves code quality.
- Decreases the time spent debugging and searching for possible software regressions.
- Decreases the number of bugs that manage to reach production.
- Simplifies the development of complex applications.
- Is simpler than it seems.

How can I convince you of all these things? I hope to succeed through a **practical example starting completely from scratch**.

## Goal

In this guide we'll develop a class that takes as input a URL and a word to search for in the page we've entered.
This search will answer us by telling us how many times it found the word.

We'll build this simple application in [Node.Js](https://nodejs.org/en/) + [TypeScript](https://www.typescriptlang.org/), entirely in TDD.
During this development I'll explain all the steps and make explicit all the advantages that TDD is introducing.

## Prerequisites

To follow the guide you should have:

- Node.js installed.
- A minimum of experience with Node.js. TypeScript, if you've never used it, is JavaScript with types; for now that's all you need to know.
- For the second part you need to know the concept of asynchronous programming in JavaScript: we'll use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and the [async and await](https://javascript.info/async-await) keywords.
- A UNIX system (Linux or Mac). Or having enabled [WSL on Windows](http://wsl-guide.org/en/latest/).

If you happen to get lost, [in this GitHub repo](https://github.com/matitalatina/word-counter) you can find the finished product. But I advise you not to "peek" at the solution because we'll introduce many concepts throughout the article. Seeing the finished project without knowing *how* we got there brings no benefit to learning.

## Creating the project

The first step is obviously to create the project. To do this we open the *terminal* in a folder we'll work in. My folder will be called `word-counter`.

```bash
mkdir word-counter
cd word-counter
```

Let's create the `package.json` file where we'll insert the various Node.js dependencies and scripts.

```bash
npm init
```

Let's enter the various data it asks for. For now we can just press `Enter` and keep the default values.

## Adding dependencies

Now we can insert the bare minimum needed to start developing in TDD. The dependencies we need are:

- [TypeScript](https://www.typescriptlang.org/): to develop with this language.
- [TSLint](https://palantir.github.io/tslint/): the TypeScript [linter](https://en.wikipedia.org/wiki/Lint_(software)) that will help us during development to write clean code. This is optional, but I usually always add it to have great help during development. It's also integrated very well with [Visual Studio Code](https://code.visualstudio.com/), which is my favorite text editor for the Node.js world.
- [Jest](https://jestjs.io/): our testing platform.

To install all this we write

```bash
npm install --save-dev typescript tslint jest ts-jest @types/jest
```

We can verify that these five dependencies have been added in `package.json` under `devDependencies`, that is, they're dependencies needed for development and not for the program itself. We can also notice that these dependencies have been downloaded into the `node_modules` folder.

The command should be clear; the only part that maybe needs explanation is the Jest libraries. In fact we installed three dependencies to make it all work.

- `jest` is our testing platform.
- `ts-jest` is the transpiler that transforms TypeScript into JavaScript before running the tests. Without it we'd have to [transpile](https://en.wikipedia.org/wiki/Source-to-source_compiler) the code manually every time, something we absolutely want to avoid so as not to waste time.
- `@types/jest` is needed by TypeScript to know the types inside the Jest library. Imagine that many times libraries are written in JavaScript, so TypeScript would have no idea what the functions accept as input or return as output. Fortunately there are developers who create libraries that map JavaScript functions to TypeScript. Usually to install these mappings you install the `@types/<LIBRARY_TO_MAP>` dependency. If you want to know more about these type declarations in TypeScript you can read directly from the [DefinitelyTyped](http://definitelytyped.org/) site, but for this guide there's no need to go deeper.

### Initialization

Now that we've downloaded the libraries, we need to configure them to make them work at their best.
Let's start with **TypeScript**

```bash
npx typescript --init
```

The command means:

- `npx`: starts a program that you can find in the `node_modules` folder.
- `typescript --init`: the TypeScript initialization command.

It should have created the `tsconfig.json` file with the various configuration parameters. Let's open this file and we should see the `// "lib": [],` part commented out; let's uncomment it and write:

```json
"lib": [
  "es2015"
]
```

This way we can use [the async and await keywords](https://javascript.info/async-await) when we deal with [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Now let's move on to **TSLint**

```bash
npx tslint --init
```

We can actually see that a file named `tslint.json` has been created in the root. For now it's fine as it is, let's not touch it.

Now let's initialize **Jest**, our test platform, more or less as we did with TSLint

```bash
npx jest --init
```

It should automatically recognize that TypeScript is present, create the `jest.config.js` file containing Jest's default configuration, and finally it added the `test` script to `package.json`. This way when we write `npm test` in the console, Jest starts and runs all the tests.

Here we need to make a small change to the `jest.config.js` file: we need to rename the field from `globals.ts-jest.tsConfigFile` to `globals.ts-jest.tsConfig` to avoid a warning message during tests.
So we'll need to rename that configuration part like this:

```javascript
globals: {
  "ts-jest": {
    "tsConfig": "tsconfig.json"
  }
}
```

To be sure we've done everything, let's finally try writing a test: we'll insert it in the `src/__tests__` folder and call it `hello-test.ts`.

So let's write in the `src/__tests__/hello-test.ts` file:

```typescript
test("should work", () => {
  expect(true).toBe(true);
});
```

The test we just wrote does nothing but verify that `true` is actually `true`. What's the point? In real life, none, but in our specific case it helps us understand that Jest is configured correctly.

Let's start the tests with `npm test` and you should get a result similar to mine.

```bash
$ npm test

> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 PASS  src/__tests__/hello-test.ts
  ✓ should work (5ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.553s
Ran all test suites.
```

Perfect! Our first test in TypeScript worked.

## Project analysis

Now we get down to business: let's go back to our goal and start thinking about how to create the architecture.

To achieve the goal we need three parts:

1. Collecting the input values (URL and word to search for).
2. Downloading the web page.
3. Counting the word in the web page we just downloaded.

## Test-Driven Development: here we go!

Where do we start? Obviously with a test! After all, that's why we're here, right? To learn Test-Driven Development.
How do you start with a test? **You need to think about how to create an architecture that can be easily testable, where each test checks only a single aspect of the project**.

We'll use a [bottom-up approach](https://en.wikipedia.org/wiki/Top-down_and_bottom-up_design) to create the project, that is, we'll start from the simplest, self-contained part that doesn't need any dependency to work. In this case it's part 3.

## WordCounter class

WordCounter is our class that handles "Counting the word in the web page we just downloaded". We can also translate it this way: "Given an input string *text* and a word to search for *wordToFind*, it returns the number of times *wordToFind* is contained in *text*".

So let's start from the test: without having this WordCounter class in hand, which doesn't exist yet, I imagine using it like this:

```typescript
const text = "downloaded text";
const wordToFind = "text";

const wordCounter = new WordCounter();

wordCounter.count(text, wordToFind); // Output 1
```

Let's try to translate this hypothetical usage into a test.
In the new file `src/__tests__/word-counter.ts` we write:

```typescript
import WordCounter from "../word-counter";

describe("WordCounter", () => {
  const wordCounter = new WordCounter();

  it("should count the word inside text", () => {
    expect(
      wordCounter.count("downloaded text", "text"),
    ).toBe(1);
  });
});
```

Here we need to know a minimum of how Jest works. In short, we'll use the convention of grouping tests that refer to a class using the [describe](https://jestjs.io/docs/en/api#describename-fn) function, and then each test of the class will use the [it](https://jestjs.io/docs/en/api#testname-fn-timeout) function which is our actual test. The `it` function consists of a string that briefly explains what we're testing and a function that contains the test logic. For more details I recommend their [official documentation](https://jestjs.io/docs/en/getting-started).

Now that we've written our first test, we can notice an advantage of writing in TDD: **we only care about the interface and not the implementation**. In the end, the final user of our classes only cares about *how* to invoke a certain function, and not *how it was made*. It often happens in programming that you dive headfirst into the implementation only to end up with a convoluted, unclear interface, precisely because in traditional programming the cognitive effort all goes into the implementation and the interface is secondary. Here instead everything is flipped.

A very important rule in TDD is to **proceed in small steps**. We shouldn't write a thousand tests and then move on to implementation. You write a single test, it fails, and then our goal is to make the test pass by implementing the necessary code. Why all this? Essentially for two reasons:

1. **We know perfectly well what our goal is: making the only failing test pass**. This way the project can be as complex as we like, but by setting only a small goal everything becomes simple; *divide et impera* always works!
2. **We write the bare minimum to make the test pass**. How many of us have started writing mountains of code because "You never know", or because our mind thought of a thousand cases that nobody ever asked for? In TDD this doesn't happen; every single line of code was written to make a test pass. If we write anything else we're doing it wrong.

Now that we've told ourselves we must proceed in small steps, let's actually write the code that will make our test green. First of all let's verify that it fails.

In the console we write `npm test`.

As output we have something like this.

```bash

> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 PASS  src/__tests__/hello-test.ts
 FAIL  src/__tests__/word-counter.ts
  ● Test suite failed to run

    TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
    src/__tests__/word-counter.ts:1:25 - error TS2307: Cannot find module '../word-counter'.

    1 import WordCounter from "../word-counter";
                              ~~~~~~~~~~~~~~~~~

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.557s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

The TypeScript transpiler rightly complains that the word-counter class doesn't exist.

Now let's write the bare minimum to make the test pass. Let's create the class and the method in `src/word-counter.ts`.

```typescript
export default class WordCounter {
  public count(text: string, wordToFind: string): number {
    return 1;
  }
}
```

Let's run the test with `npm test`. And this is the result:

```bash

> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 PASS  src/__tests__/hello-test.ts
 PASS  src/__tests__/word-counter.ts

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.669s
Ran all test suites.
```

We did it! But I imagine you noticed that I cheated. The method I wrote always returns 1, regardless of the text passed. But this isn't wrong in TDD because **our goal is to make the tests pass as soon as possible with the bare minimum**. If I managed to cheat, it means the test isn't thorough enough to verify the correct functioning of the program.
Now let's fix it by writing a test that forces us to consider the *text* input. In the `src/__tests__/word-counter.ts` file let's add

```typescript
it("should count the word inside text (multiple)", () => {
  expect(wordCounter.count("pippo pippo ciao pippo", "pippo")).toBe(3);
  expect(wordCounter.count("ciao ciao", "ciao")).toBe(2);
  expect(wordCounter.count("ciao", "nonesistequestaparola")).toBe(0);
});
```

Running the tests, this test indeed fails

```bash
> word-counter@1.0.0 test /Users/mattia/Repositories/word-counter
> jest

 FAIL  src/__tests__/word-counter.ts
  ● WordCounter › should count the word inside text (multiple)

    expect(received).toBe(expected) // Object.is equality

    Expected: 3
    Received: 1

      11 |
      12 |   it("should count the word inside text (multiple)", () => {
    > 13 |     expect(wordCounter.count("pippo pippo ciao pippo", "pippo")).toBe(3);
         |                                                                  ^
      14 |     expect(wordCounter.count("ciao ciao", "ciao")).toBe(2);
      15 |     expect(wordCounter.count("ciao", "nonesistequestaparola")).toBe(0);
      16 |   });

      at Object.<anonymous> (src/__tests__/word-counter.ts:13:66)

 PASS  src/__tests__/hello-test.ts

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        1.612s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

Now let's change the implementation of `WordCounter.count` in `src/word-counter.ts` so as to make the test pass

```typescript
public count(text: string, wordToFind: string): number {
  return text
    .split(" ")
    .filter((word) => word === wordToFind)
    .length;
}
```

Both tests are OK! ...But there's one thing we haven't tested: what happens if the word to search for is all lowercase but the text is uppercase? **We don't know and we don't even bother finding out, we just write a test to be sure**!

Let's add the test

```typescript
it("should count the word case insensitive", () => {
  expect(wordCounter.count("Ciao ciao CIAO", "ciao")).toBe(3);
});
```

Running the tests it fails... So let's fix it!

```typescript
public count(text: string, wordToFind: string): number {
  const wordToFindLower = wordToFind.toLowerCase();
  return text.toLowerCase()
    .split(" ")
    .filter((word) => word === wordToFindLower)
    .length;
}
```

All good, again. But we haven't considered text where the word ends with a comma or any punctuation mark. New test

```typescript
it("should count word that have signs nearby", () => {
  expect(wordCounter.count("ciao, ciao! ", "ciao")).toBe(2);
});
```

New implementation to handle this failing test

```typescript
public count(text: string, wordToFind: string): number {
    const wordToFindLower = wordToFind.toLowerCase();
    return text.toLowerCase()
      .split(/[^a-zA-Z\d]/)
      .filter((word) => word === wordToFindLower)
      .length;
  }
```

All green! In short, now it's quite clear how to create a class in TDD. We've seen that **it's a continuous ping pong of failing tests and implementation that fixes the failure**.

But this ping pong, in addition to the benefits we wrote about earlier, also brings others:

- **It iterates the development of complex apps through simple steps, incrementally**: it's obvious that we started with a very simple implementation, and then, through small steps, we arrived at having a method that handles numerous cases we might not even have thought of initially.
- **Previously written tests remain, the implementation changes continuously**: maybe through this example it's not very noticeable, but every time we added a new test and changed the implementation, we were certain that **even the previously written tests continue to work**. This certainty is fundamental when we have to do heavy refactors of methods; without TDD this certainty, most of the time, doesn't exist. So people tend not to modify existing code; they add code "around" it to avoid touching something "that already works" and therefore avoid [software regressions](https://en.wikipedia.org/wiki/Software_regression). This behavior works but only for a short period; the code easily loses readability, becomes confusing and obscure, and here's the famous [technical debt](https://en.wikipedia.org/wiki/Technical_debt)! I'm sure you've already had code like that in your hands and it's not fun.
- **All the features we need are tested**: this is free with TDD. We write the test first and then the implementation, so by necessity it's true.

By now we feel satisfied with our `WordCounter` class. Actually there would be another case to test. For example

- What happens if we pass `null` to the two parameters? 

Should we add a test for this case too? The answer is *it depends*. If we know that our code doesn't need to handle `null`, we can also skip it. Many might counter that this way the code isn't robust, but actually our goal isn't to handle every case in the world; we need to create a class that's OK for our project. So **we should try to stay focused on the initial goal**; this way we don't complicate the code with cases that never happen and we don't waste time writing useless code and tests.

Now that we're satisfied with our `WordCounter`, let's move on to the next class.

## TextFetcher class

This class solves part 2 of our goal. That is, it downloads a web page and retrieves the text from it.
By now we know how it works and, loaded like a spring, we use the same procedure we used with `WordCounter`:

- Let's think about the TextFetcher interface: I imagine using it like this `new TextFetcher().getContent(url)` and it returns a `Promise<string>`, in short it returns a string asynchronously (we can't have it synchronous because the HTTP call to retrieve the content from a URL is slow). Here a prerequisite I wrote earlier comes into play: asynchronous programming in JavaScript/TypeScript. If you want to fully understand the examples I'm going to write, I recommend the readings I included in the prerequisites section.
- Let's write the test to test the future implementation.

```typescript
import TextFetcher from "../text-fetcher"

describe("TextFetcher", () => {
  const textFetcher = new TextFetcher();

  it("should get the content as text", async () => {
    expect(
      await textFetcher.getContent("https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md")
    ).toContain("WordCounter");
  });
});
```

If we open the URL I put in the test we can see it's the `README.md` of the repository I'm using to create this app.

Inside it there's the word WordCounter. Our test verifies that the `WordCounter` instance actually downloads the README and returns its content. In the test I only look for the word `WordCounter` and not exactly the content because the README could change, but at least the project name I hope will always remain!

Now let's try to make the test pass (without cheating so as not to weigh down the discussion too much). To make the HTTP call that downloads the file, I use a very famous library in Node.js which is [Axios](https://github.com/axios/axios). For this reason we install it among our dependencies

```bash
npm install --save axios
```

Let's write a possible implementation in `src/text-fetcher.ts`

```typescript
import axios from "axios";

export default class TextFetcher {
  public async getContent(url: string): Promise<string> {
    return (await axios.get(url)).data;
  }
}
```

We've essentially created and exported the `TextFetcher` class, created the asynchronous method `async getContent`, in the implementation we use `axios` to download the content of the `url`, we asynchronously wait for it to download the content using the `await` keyword, and finally we take the content of the response using the `data` property.

Let's run the tests with `npm test` and everything works!

But I don't know if you smell a little "burning" too... If you noticed, I put a URL in the test that fetches a resource external to our program, which could change, could be inaccessible because our PC is offline. All this would influence our test, making it fail even though the code is actually correct.

Remember that **unit tests must be fast and must not depend on external factors**. The HTTP call can be slow due to the connection or even fail due to possible changes or disconnections.

How can we solve this problem? We'll [mock](https://en.wikipedia.org/wiki/Mock_object) the HTTP call.

To do this we need another external library: [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).

```bash
npm install --save-dev axios-mock-adapter
```

Let's modify the test in `src/__tests__/text-fetcher.ts`

```typescript
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import TextFetcher from "../text-fetcher";

describe("TextFetcher", () => {
  const textFetcher = new TextFetcher();

  const mock = new MockAdapter(axios);

  it("should get the content as text", async () => {
    const content = "This is the content of the web page";

    mock.onGet("/fake-url").reply(200, content);

    expect(
      await textFetcher.getContent("/fake-url"),
    ).toBe(content);
  });
});
```

Through `MockAdapter` we hook into the `axios` library, so as to create fake HTTP calls. With `mock.onGet("/fake-url").reply(200, content);` we create a fake HTTP response through the `/fake-url` address with the value of the `content` variable as content. Finally we test that the response is actually `content`.

Running the tests everything works and this time we can test offline too.

**Mocking HTTP calls external to the various URLs or to external microservices is fundamental to having a good unit test suite**. We can't call real resources during unit tests, also because these resources probably only exist in the production environment and we don't want to pollute the production content with tests.

## CounterApp class

This is the last class we're going to build. Its goal is to:

- Invoke `TextFetcher` to retrieve the text from the URL.
- Invoke `WordCounter` to count how many times the word to search for is contained in the downloaded text.
- Return the number returned by `WordCounter`.

**In the unit tests of a class we don't want to test the implementation of its dependencies too**. In our case we don't want to test `TextFetcher` and `WordCounter` again. We've already tested these classes well. For this reason we'll mock these dependencies a bit like we did for HTTP calls.

Mocking the external dependencies of a class brings the following advantages:
- **We avoid a failure in the dependency also failing the tests of the class we're testing**. Ideally an error in the code should make only one test fail, and not all the parts that depend on it too.
We therefore need a library called [ts-mockito](https://github.com/NagRock/ts-mockito) which is inspired by the famous Mock library for Java called [Mockito](https://site.mockito.org/).
- **It makes it easy to create special cases**: imagine we need to correctly test the handling of an exception, and generating this exception requires a very particular situation. If we mock, we can inject a mock that generates this exception without having to recreate this special situation.

Let's put what we've said into practice. The first step is to install `ts-mockito`.

```bash
npm install --save-dev ts-mockito
```

Let's write the test in the new file `src/__tests__/counter-app.ts`

```typescript
import { instance, mock, when } from "ts-mockito";
import CounterApp from "../counter-app";
import TextFetcher from "../text-fetcher";
import WordCounter from "../word-counter";

describe("CounterApp", () => {
  // Initialization
  const mockWordCounter: WordCounter = mock(WordCounter);
  const mockTextFetcher: TextFetcher = mock(TextFetcher);
  const counterApp = new CounterApp(instance(mockTextFetcher), instance(mockWordCounter));

  it("should get parameters and return the count", async () => {
    const providedUrl = "url";
    const providedWordToFind = "word";
    const fakeContent = "Retrieved text";
    const expectedCount = 1;

    when(mockTextFetcher.getContent(providedUrl))
      .thenReturn(Promise.resolve(fakeContent));
    when(mockWordCounter.count(fakeContent, providedWordToFind))
      .thenReturn(expectedCount);

    expect(await counterApp.countWordFromUrl(providedUrl, providedWordToFind))
      .toBe(expectedCount);
  });
});
```

In the initialization we create the mocks of our two classes `WordCounter` and `TextFetcher`; with the line `new CounterApp(instance(mockTextFetcher), instance(mockWordCounter))` we insert the instances of our mocks into the constructor of the `CounterApp` class. This technique of "injecting" the dependencies used directly into its constructor pairs well with frameworks that use [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection). If this last sentence I wrote is pure gibberish, don't worry. The message that must get across is this: **it's good practice to require in the [constructor](https://en.wikipedia.org/wiki/Constructor_(object-oriented_programming)) the external dependencies the class needs to work correctly**. This is true for two reasons:

- It clearly indicates to the programmer using your class which dependencies it needs to perform its function.
- It makes testing the class in question easy, because in the constructor we can inject mocked instances, as in our case.

The part inside the test `it("should get parameters and return the count", ...)` should be fairly self-explanatory: I create the variables I expect to use and then I use [ts-mockito](https://github.com/NagRock/ts-mockito) to make the appropriate assertions. For example with `when(mockTextFetcher.getContent(providedUrl)).thenReturn(Promise.resolve(fakeContent));` it means: "when the class calls `textFetcher` using the `getContent` method with the `providedUrl` parameter, return a `Promise` resolved with the value `fakeContent`". The `when(...).thenReturn(...)` functionality helps us bypass the real implementation of the mocked classes and return a value we decide.

This way we're testing:
- That the `CounterApp` class calls the methods of the `WordCounter` and `TextFetcher` classes with the correct parameters, through the various `when(...).thenReturn(...)`.
- That the `CounterApp` class returns the correct number through `expect(...).toBe(...)`.

Let's run the tests with `npm test`. Of course it fails; now let's implement the class in the new file `src/counter-app.ts`;

```typescript
import TextFetcher from "./text-fetcher";
import WordCounter from "./word-counter";

export default class CounterApp {
  constructor(private textFetcher: TextFetcher, private wordCounter: WordCounter) {

  }

  public async countWordFromUrl(url: string, wordToFind: string): Promise<number> {
    const text = await this.textFetcher.getContent(url);
    return this.wordCounter.count(text, wordToFind);
  }
}
```

We've created a constructor that inserts the instances of `TextFetcher` and `WordCounter` into the private variables `textFetcher` and `wordCounter` (the constructor is empty; it seems to do nothing, but the dirty work is being done by the [private keyword](https://www.stevefenton.co.uk/2013/04/stop-manually-assigning-typescript-constructor-parameters/)). Then we implemented the asynchronous method `countWordFromUrl` which does nothing but download the content from the URL and then count the number of times the word we're looking for appears and return it.

Let's try with `npm test` and everything is indeed OK!

## Real test

Now that we've finally reached our goal, programming entirely in TDD, let's try a real test.

Let's create the `src/index.ts` file where I'll insert a small script to try it all out.

```typescript
import CounterApp from "./counter-app";
import TextFetcher from "./text-fetcher";
import WordCounter from "./word-counter";

async function testApp() {
  const url = "https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md";
  const wordToFind = "WordCounter";

  const count = await new CounterApp(new TextFetcher(), new WordCounter())
    .countWordFromUrl(url, wordToFind);

  console.log(`The word "${wordToFind}", in ${url}, appears ${count} times`);
}

testApp();
```

I created a small `testApp` function that creates my `CounterApp` class with the necessary dependencies, and I try to count how many times the word `WordCounter` appears in the [README.md](https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md) page of my repository for this project.
To start the program I need to transpile TypeScript into JavaScript, because as we know Node.js can't read TypeScript directly. To solve this I'll use the [ts-node](https://github.com/TypeStrong/ts-node) library.

`npm install --save-dev ts-node`

Now that it's installed, let's start our script like this

```bash
npx ts-node src/index.ts
```

The result is this:

```bash
The word "WordCounter", in https://raw.githubusercontent.com/matitalatina/word-counter/master/README.md, appears 1 times
```

It works!!!

## Project maintenance

We've finished our small TDD project. But a real project worth its salt is never "finished"; it must be maintained and improved every day. Another advantage I appreciated after a few months of TDD development is the drastically reduced time in terms of debugging or production bugs. So **the time spent writing tests is far outweighed by the time saved from debugging the product**. Try it to believe it!
But don't think that bugs no longer exist using TDD. There are far fewer of them but they do happen from time to time. When they happen we must always remember to **write the test that manifests the bug before fixing the bug**. This way we keep using TDD, but above all we have the guarantee that the bug won't manifest again even if we heavily modify the code in the future.

## When to use TDD

Now that we've seen what TDD is, a question may naturally arise: **when should you use TDD?** Here it's better to make a distinction: **if I have to choose between TDD and classic unit tests, from personal experience I'd always choose TDD**. The classic approach has never brought me any benefit over TDD. The only "advantage" I've seen is that the classic approach lets you not test everything, but honestly I don't consider that an advantage precisely because it creates dangerous holes that nullify much of the benefits we found in this guide.

If instead the choice is between TDD and only the implementation without unit tests, the discussion changes.
These are certainly the cases where TDD (or at least unit tests) should be used.

- Backend systems: when you have clients (mobile apps, microservices etc.) that rely on our system, it's fundamental that the backend works perfectly.
- "Mission critical" parts: if we have components that must work and are crucial to delivering our service, we can't afford to have bugs or go on trust.
- Components that are difficult to test "live": if it takes me 5 minutes just to test a special case once, better to spend them creating a test that at least I'll always have and a `npm test` is enough to recheck.

**When instead is TDD not needed and you can go with implementation only?** It sounds like heresy but I've found some cases where implementation alone is enough and more:

- When our implementation is easily testable "live": ever heard of live-reloading? With web apps or even in hybrid app development with [Flutter](https://flutter.io/), [Ionic](https://ionicframework.com/) or [React Native](https://facebook.github.io/react-native/), you can implement and immediately view the output. This is a very powerful tool that enormously speeds up development, but above all the time between implementation and the final result is zero. What's the point of writing tests if I just save the code and immediately see the final result and can try it?
- When we can afford some freedom, the specifications are still fuzzy and our client is in close contact with development: it has happened to me to develop literally with the client who could give me feedback almost in real time. If the environment is very informal/conversational, it's possible to create an entire project without writing a single line of test and the client is happy anyway, even if maybe from time to time they call you to report a bug. The important thing is that you can fix it quickly so that the client can appreciate your speed in fixing it.
- When the project is an experiment: sometimes it happens to create a project just to understand whether a certain thing can work. Or you implement a small variation for A/B testing, or you develop something temporary to work around an equally temporary problem. In these cases we'll never appreciate the benefits of TDD, because the time spent on tests won't be compensated by the time saved from debugging or fixing bugs.

The message that must get across is this: evaluate your case and act accordingly. **TDD is the solution to many problems, but not to all of them**.

## Conclusions 

First of all I apologize if while reading this guide maybe the concept of "it's simpler than you'd think" didn't come across much. 
But don't forget that here you've seen numerous concepts which, if it's the first time you've seen them, take a little time to digest. If maybe you missed the concepts you learned in this article, here's a small summary for you:

- Initialization of a project in Node.js, use of the `npm` package manager.
- Adding TypeScript with an integrated linter.
- Using Jest for testing.
- Asynchronous programming with the `async` and `await` keywords introduced in ECMAScript 2017.
- Using mocking libraries, when and why to use them.
- Test Driven Development.

At first TDD seems like a brake, like all new things, but once you get comfortable, everything becomes faster and even more fun! It's always nice to reach the end of the day and see your project growing together with the tests that increase and are all green... *except one*! Yes indeed: **at the end of the day, if the project isn't finished, we write a failing test before leaving**. This is a piece of advice that's very effective for resuming work. This way we perfectly remember what we were doing when we return to work. The failed test will tell us exactly what we left behind.

I hope this article has made you want to try this fascinating technique which, at first glance, may seem almost absurd, but once adopted, enormously increases the quality of the code and consequently also the quality of the final product.

If you want to see TDD in action with Spring Boot you can read my article that talks about [how to develop RESTful APIs in TDD with Spring Boot](/how-to-develop-rest-apis-in-tdd-with-spring-boot).

See you next time!
