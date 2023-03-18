import express from "express";
import html from "html-string";

const app = express();

const TodoItem = ({ title, completed }) => html`
  <li>${title} ${completed ? "✅" : "❌"}</li>
`;

const TodoList = ({ todos, completedCount, ...attrs }) => html`
  <ul ${html.attrs(attrs)}>
    ${todos.map((todo) => TodoItem(todo))}
  </ul>
  ${completedCount && html` <p>${completedCount} tasks completed</p> `}
`;

const todos = [
  { title: "Task one", completed: true },
  { title: "Task two", completed: false },
  // Title will be shown in bold (thus, unescaped) because the TodoItem template has the :safe modifier for the ${title} value.
  { title: "<b>important task</b>", completed: false },
];

const completedCount = todos.filter((todo) => todo.completed).length;

const template = TodoList({
  todos,
  completedCount,
  id: "tasks",
  dataCustom: "value",
  dataSomeBool: true,
});

app.get("/", (req, res) => res.send(html.render(template)));

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("App ready at http://localhost:3000"));
