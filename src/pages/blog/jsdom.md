---
layout: "../../layouts/BlogLayout.astro"
title: "Why JSDOM?"
header: "Javascript"
---

# The JSDOM Rabbit Hole

> You haven't truly learned something until you have re-implemented it in Javascript.

The Document Object Model or DOM is the way a browser interacts with the HTML document. Each browser has its separate implementation based on the DOM specs. But as is the case with most projects in the JS ecosystem these vary a lot and rarely have an API to interact with outside the browser.

I dove into the JSDOM rabbit hole while debugging the following error message in one of my tests:

```javascript
FAIL  __tests__/App.js
  ● renders without crashing

    ReferenceError: document is not defined

      at Object.<anonymous>.it (__tests__/App.js:6:15)

  ✕ renders without crashing (1ms)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.128s, estimated 1s
Ran all test suites related to changed files.
```

Well, obviously, `document` can't be defined in Node.js. How did my other tests work? What can I do to get `document` to be defined?

### The Begining

Just like in 2023, SSR was all the hype in 2010 when the JSDOM project started. GitHub User 'tmpvar' created a DOM implementation that can run on NodeJS. It would allow parsing and manipulating HTML docs. It can be used for web scraping and server-side rendering but that wasn't where this project gained widespread use. Facebook's Jest adopted this as its testing environment and it is mainly as a testing environment that we find it being used even today.

> JSDOM is a pure-JavaScript implementation of many web standards, notably the WHATWG DOM and HTML standards, for use with Node.js.

The key phrase here is 'many'. The DOM standard alone is not enough to emulate anything meaningful. Additionally, the DOM standards are ever-evolving due to the many browsers and their varied implementations. Apart from the [Living DOM standard](https://dom.spec.whatwg.org/), other specifications covered by JSDOM include:

1. HTML
2. DOM Parsing and serialization
3. XHR
4. URL
5. CSS Selectors
6. CSSOM
7. Others

### JSDOM as a web scraper

Here is a sample server that uses JSDOM to take an input URL and add a style element to that document -

```javascript
const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const app = express();
const url = "https://www.example.com/";
let articles;

const resourceLoader = new jsdom.ResourceLoader({
  strictSSL: false,
});

JSDOM.fromURL(url, { resources: resourceLoader }).then((dom) => {
  let document = dom.window.document;
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = "div {transform: rotate(180deg)}";
  document.querySelector("body").appendChild(style);
  articles = dom.serialize();
});

app.get("/", (req, res) => {
  res.send(articles);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### The Competition

There are alternative DOM implementations in JS (an [article comparing alternatives](https://webreflection.medium.com/linkedom-a-jsdom-alternative-53dd8f699311))that try and improve on certain pitfalls of JSDOM like the data structures used and other speed optimizations. But none of them has gained in popularity or wide adoption like jsdom. Jsdom gives a significant speed boost over using the browser for testing, and the speed can be even improved by opting out of jsdom where the tests don't assert on the dom.

Those who use JSDOM as their testing environment will be aware that many features are not implemented. For example, the CSS layout engine is not implemented and hence `node.innerText` will always return undefined as it depends on the layout engine. Other features such as navigation are also not implemented.

JSDOM is heavily debated as a good environment for rendering, as it differs from the usual user environments. Teams have begun to transition to Cypress component testing, Playwright component tests, or NightWatch.js. These frameworks render in a real browser, providing an accurate representation of how real users would see it. Debugging these tests is also easier, as a visual identification of errors is possible, unlike with JSDOM. They also claim to be less prone to flakiness in the realm of integration tests, but I couldn't find data proving the same.

### TL;DR Bug Fix

If you were just here to find out how to fix the error mentioned in the screenshot, I apologize for making you read through all of this. Just add this code snippet to the top of your test, and you're good to go:

```javascript
/** @jest-environment jsdom */
```
