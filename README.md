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
    ${todos.map(todo => TodoItem(todo))}:html
  </ul>
  ${completedCount && html`<p>${completedCount} tasks completed</p>`}:html
`;

const todos = [
  { title: "Read this", completed: true },
  { title: "Use this", completed: false }
];

const completedCount = todos.filter(todo => todo.completed).length;

const htmlOutputForTheBrowser = TodoList({ todos, completedCount, extraAttrs={id: "tasks", dataCustom: "value", dataSomeBool: true}});
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

**Note**
By default, all interpolated values are [XSS](https://es.wikipedia.org/wiki/Cross-site_scripting) escaped using the [xss](https://www.npmjs.com/package/xss) library. This is for security reasons so that if a malicious value
is passed in, let's say: `<script>alert('hello')</script>` then the tags will be automatically escaped.

When you are 100% sure that the provided value is safe, for example as we are doing in the previous example where the result of `TodoItem` is another templatee we have control over, then you can add the `:html` suffix as shown above just after the call to `TodoItem()` to skip the XSS escaping.

If you are using [Visual Studio Code](https://code.visualstudio.com/), you can use the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension for syntax highlighting, autocompletion, etc.

Inspired by [lit-html](https://lit-html.polymer-project.org), key differences are: Does XSS by default, focused on server side templates.
