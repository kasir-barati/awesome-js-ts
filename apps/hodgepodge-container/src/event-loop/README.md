# Event loop

- [Runtime](#runtime) model of JS.
- Coordinates:
  - Events.
  - Scripts.
  - Rendering.
  - Networking.
  - User interaction.
  - And many other things.
- "Run-to-completion": cannot pause a function execution. Can potentially block user interaction with the app (e.g. your ReactJS app).
- Event in JS can happen asynchronously/synchronously.
  - Async: when we've defined a listener for an event.
  - Sync: When calling `.click()` method for example.

> [!NOTE]
>
> See [one practical use of event loop](https://github.com/kasir-barati/graphql-js-ts/blob/main/docs/best-practices/batching.md#event-loop--dataloader--promise).

> [!TIP]
>
> Never blocking nature of JS: Even when we query something from database, it registers callback and then starts executing the other tasks in the stack.

## Stack

![Stack](./stack.png)

# Heap

- A large (mostly unstructured) region of memory.

# Task queues

- A list of messages to be processed.
- A JavaScript runtime uses a message queue.
- Has an associated function that gets called to handle the message AKA _callback_.
- The runtime starts handling the messages on the queue, starting with the first one in the queue.
  - Task queues are sets, not queues, because the event loop processing model grabs the first runnable task from the chosen queue, instead of dequeuing the first task.
- Does things like:
  - Callbacks.
  - Parsing (parsing html).
  - `setTimeout()` or `setInterval()` is reached.
  - Dispatching an events (user clicked on something, etc).
  - Reacting to DOM manipulation (when an element is inserted into the document).

```ts
function foo() {
  console.log('First');
}
function bar() {
  setTimeout(() => {
    console.log('Second');
  });
}
function baz() {
  console.log('Third');
}
bar();
foo();
baz();
```

![Queue](./queue.gif)

## Macrotask

- Things that allow the <a href="#agentGlossary">agent</a> to go through the task queue before attending to them.
- E.g. `setTimeout`.
- Try to test [this example](./nonblocking-even-loop-with-settimeout.html) in your own browser.

## Microtask

- Do not allow <a href="#agentGlossary">agent</a> to go through the tasks queued up in the task queue.
- JS should complete all of these before giving the control back to event loop.
- E.g. JS promises.
- Just because they are called async does not mean that promises will yield to other parts of event loop which ain't sync.
- Try to test [this example](./blocking-even-loop-with-promises.html) in your own browser.

## Microtask VS Macrotask

### First example

```ts
setTimeout(() => console.log('Task1'));
const task2 = new Promise((resolve, reject) => resolve());
task2.then(() => console.log('Task2'));
console.log('Main code task');
```

This will log:

```cmd
Main code task
Task2
Task1
```

### Second example

```ts
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('Microtask 1'));
  console.log('Listener 1');
});
button.addEventListener('click', () => {
  Promise.resolve().then(() => console.log('Microtask 2'));
  console.log('Listener 2');
});
// button.click();
```

#### YouTube Video

[![microtasks vs tasks vs animation callbacks in JS](https://img.youtube.com/vi/RnFtZciOAxg/0.jpg)](https://www.youtube.com/watch?v=RnFtZciOAxg)

Here it's showing how much it is important this things since when we are testing our app using Cypress. Since we get totally different results. Especially in cases that we are doing things such as `event.preventDefault`.

## Tasks VS Microtasks VS Animation callbacks

### YouTube Video

[![How microtasks behavior change when user interact with the browser whereas programmatic](https://img.youtube.com/vi/yqzTbm-vJ78/0.jpg)](https://www.youtube.com/watch?v=yqzTbm-vJ78)

Here in each event loop iteration:

<ol>
  <li>
    Executes one task from "tasks queue".
  </li>
  <li>
    Execute all of the "Animation callbacks", except the one that was added after it started to execute them.
  </li>
  <li>
    But as for the microtasks, it will execute all of them and also the ones that was added after it started to execute them. That's exactly why our browser crashes if we have infinite promises.
    <br/>
    So event loop only starts next iteration when the microtasks queue is emptied.
  </li>
</ol>

# Glossary

<dl>
  <dt id="runtime">
    Runtime:
  </dt>
  <dd>
    A piece of code that implements portions of a programming language's execution model. It allows the program to interact with the computing resources it needs to work. 
  </dd>
  <dt>
    <a href="https://tc39.es/ecma262/#sec-code-realms">
      Realm
    </a>:
  </dt>
  <dd>
    <ul>
      <li>
        Before ECMAScript code is evaluated, it must be associated with a realm.
      </li>
      <li>
        Conceptually, a realm consists of:
        <ul>
          <li>
            A set of 
            <a href="https://tc39.es/ecma262/#table-well-known-intrinsic-objects">
              intrinsic objects
            </a>.
          </li>
          <li>
            An ECMAScript global environment.
          </li>
          <li>
            All of the ECMAScript code that is loaded within the scope of that global environment.
          </li>
          <li>
            Other associated state and resources.
          </li>
        </ul>
      </li>
    </ul>
  </dd>
  <dt id="agentGlossary">
    Agent:
  </dt>
  <dd>
    An architecture-independent, idealized "thread"
    <small id="returnToAbstractThread">
      (<a href="#abstractThreadFootnote">abstract</a> thread)
    </small>
    in which JS code runs. Such code can involve multiple globals/realms that can synchronously access each other, and thus needs to run in a single execution thread.
  </dd>
  <dt>
    Set:
  </dt>
  <dd>
    <ul>
      <li>
        A list.
      </li>
      <li>
        With the additional semantic that it must not contain the same item twice.
      </li>
    </ul>
  </dd>
  <dt>
    Queue:
  </dt>
  <dd>
    <ul>
      <li>
        A list.
      </li>
      <li>
        Conventionally, the following operations are used to operate on it, instead of using append, prepend, or remove.
        <ul>
          <li>
            To <i>enqueue</i> in a queue is to append to it.
          </li>
          <li>
            To <i>dequeue</i> from a queue is to remove its first item and return it, if the queue is not empty, or to return nothing if it is.
          </li>
        </ul>
      </li>
    </ul>
    <p>
      <b>Do not</b> use <code>forEach</code> instead, a combination of <code>while</code> and <i>dequeue</i> is more appropriate.
    </p>
  </dd>
</dl>

# Ref

- [The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Event loops in HTML spec](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
- [Using microtasks in JavaScript with `queueMicrotask()`](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [Jake Archibald on the web browser event loop, setTimeout, micro tasks, requestAnimationFrame, ...](https://youtu.be/cCOL7MC4Pl0?si=VcY_-oikUNP9ugMt)

# Footnotes

<p id="abstractThreadFootnote">
  Abstract thread: a simplified model that captures the essential features without concern for the complexities or variations that might exist in real-world implementations.
  <a href="#returnToAbstractThread">&hookleftarrow;</a>
</p>
