const express = require("express");
const html = require("html-string");

const app = express();

const TodoItem = ({ title, completed }) => html`
  <li>${title}:safe ${completed ? "✅" : "❌"}</li>
`;

const TodoList = ({ todos, completedCount, extraAttrs = {} }) => html`
  <ul ${extraAttrs}:attrs>
    ${todos.map(todo => TodoItem(todo))}
  </ul>
  ${completedCount &&
    html`
      <p>${completedCount} tasks completed</p>
    `}
`;

const todos = [
  { title: "Read this", completed: true },
  { title: "Use this", completed: false },
  // Title will be shown in bold (thus, unescaped) because the TodoItem template has the :safe modifier for the ${title} value.
  { title: "<b>important task</b>", completed: false }
];

const completedCount = todos.filter(todo => todo.completed).length;

const template = TodoList({
  todos,
  completedCount,
  extraAttrs: { id: "tasks", dataCustom: "value", dataSomeBool: true }
});

app.get("/", (req, res) => res.send(template.render()));

// eslint-disable-next-line no-console
app.listen(8080, () => console.log("App ready at http://localhost:8080"));
