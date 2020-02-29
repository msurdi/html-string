# html-string

A templating library based on JavaScript tagged template literals. Works on the browser and on the server.

Quick Example:

```JavaScript
const html = require("html-string");
// Or alternatively:
// import html from "html-string"

const TodoItem = ({ title, completed }) => html`
  <li>${title} ${completed ? "✅" : "❌"}</li>
`;

const TodoList = ({ todos, completedCount, extraAttrs={} }) => html`
  <ul ${extraAttrs}:attrs>
    ${todos.map(todo => TodoItem(todo))}
  </ul>
  ${completedCount && html`<p>${completedCount} tasks completed</p>`}
`;

const todos = [
  { title: "Read this", completed: true },
  { title: "Use this", completed: false }
];

const completedCount = todos.filter(todo => todo.completed).length;

const htmlOutputForTheBrowser = TodoList({ todos, completedCount, extraAttrs: {id: "tasks", dataCustom: "value", dataSomeBool: true}});
console.log(htmlOutputForTheBrowser);

/*
Output would be:
  <ul id="tasks" data-custom="value" data-some-bool>

  <li>Read this ✅</li>

  <li>Use this ❌</li>

  </ul>
  <p>1 tasks completed</p>
*/
```

There are examples more examples [here](https://github.com/msurdi/html-string/tree/master/examples)

**Note**
By default, all interpolated values are [XSS](https://es.wikipedia.org/wiki/Cross-site_scripting) escaped using the [xss](https://www.npmjs.com/package/xss) library. This is for security reasons so that if a malicious value
is passed in, let's say: `<script>alert('hello')</script>` then the tags will be automatically escaped.

When you are 100% sure that the provided value is safe, you can append the `:safe` modifier. If the value you are
passing is already the output of another template, then there is no need to append the `:safe` modifier as the
template itself will have already applied these same rules to it. For example if in the previous example the value of a `TodoItem`'s title could be some html entered by the user and you trust the entered value, then you could rewrite it as:

```JavaScript
const TodoItem = ({ title, completed }) => html`
  <li>${title}:safe ${completed ? "✅" : "❌"}</li>
`;
```

The `:safe` modifier in the previous template would skip the XSS protection.

## Editor support

If you are using [Visual Studio Code](https://code.visualstudio.com/), you can use the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension for syntax highlighting, autocompletion, etc.

Inspired by [lit-html](https://lit-html.polymer-project.org), key differences are: Does XSS by default, focused on server side templates.
