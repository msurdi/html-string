# html-string

A templating library based on JavaScript tagged template literals.

- Works on Node and in the browser.
- Written in Typescript.
- It does not require special editor plugins, formatters, compilers, etc as it's used as just standard JavaScript syntax. Optionally installing [the VSCode lit-html extension](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) will improve the experience with full intellisense support inside the HTML. Click to go to definition of interpolated values and nested components, autocompletion, eslint and prettier support, syntax coloring, renaming symbols, auto closing tags, emmet, etc
- Client side interactivity can be implemented with [Stimulus](https://stimulus.hotwired.dev/), [Alpine](https://alpinejs.dev/) or similar libraries. See the [examples](examples) directory.

Quick Example:

```JavaScript
const html = require("html-string");
// Or alternatively:
// import html from "html-string"

const TodoItem = ({ title, completed }) => html`
  <li>${title} ${completed ? "✅" : "❌"}</li>
`;

const TodoList = ({ todos, completedCount, ...attrs }) => html`
  <ul ${html.attrs(attrs)}> // html.attrs() will convert any extra arguments to html attributes.
    ${todos.map(todo => TodoItem(todo))}
  </ul>
  ${completedCount && html`<p>${completedCount} tasks completed</p>`}
`;

const todos = [
  { title: "Task one", completed: true },
  { title: "Task two", completed: false }
];

const completedCount = todos.filter(todo => todo.completed).length;

const todoList = TodoList({ todos, completedCount, id: "tasks", dataCustom: "value", dataSomeBool: true});
const htmlOutputForTheBrowser = html.render(todoList);
console.log(htmlOutputForTheBrowser);

/*
Output would be:
  <ul id="tasks" data-custom="value" data-some-bool>
    <li>Task one ✅</li>
    <li>Task two ❌</li>
  </ul>
  <p>1 tasks completed</p>
*/
```

There are examples more examples [here](https://github.com/msurdi/html-string/tree/master/examples)

**Note**
By default, all interpolated values are [XSS](https://es.wikipedia.org/wiki/Cross-site_scripting) escaped using the [xss](https://www.npmjs.com/package/xss) library.
This is for security reasons so that if a malicious value is passed in, let's say: `<script>alert('hello')</script>` then the tags will be automatically escaped.

When you are 100% sure that the provided value is safe, you can use  `html.unsafe()` helper to make it to not be escaped. For example if in the previous example
the value of a `TodoItem`'s title could be some html entered by the user and you trust the entered value or you have already escaped it, then you could rewrite it as:

```JavaScript
const TodoItem = ({ title, completed }) => html`
  <li>${html.unsafe(title)} ${completed ? "✅" : "❌"}</li>
`;
```

The `html.unsafe()` helper in the previous template would skip the XSS protection.

## Available helpers

`html.unsafe(value)`

Mark the value as safe for raw output (no XSS escaping).

`html.attrs(value)`

Convert each property of the passed value object to html attributes. Camelcase names
are converted to kebab-case. For example `{dataCustom: "value"}` will be rendered as `data-custom="value"`.

## Available modifiers

`safe`

  Mark the preceding interpolated value as safe for raw output (no XSS escaping).

`attrs`

  Convert each property of the preceding interpolated value to html attributes. Camelcase names
are converted to kebab-case. For example `{dataCustom: "value"}` will be rendered as `data-custom="value"`.

## Editor support

If you are using [Visual Studio Code](https://code.visualstudio.com/), you can use the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension for syntax highlighting, autocompletion, etc.

Inspired by [lit-html](https://lit-html.polymer-project.org) and JSX.
