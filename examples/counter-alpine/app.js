import express from "express";
import html from "html-string";

const app = express();

const Layout = ({ title, children }) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <script src="//unpkg.com/alpinejs" defer></script>
    </head>
    <body>
      <main>${children}</main>
    </body>
  </html>
`;

const HomeView = () =>
  Layout({
    title: "Counter App",
    children: html`
      <h1>Counter</h1>
      <div x-data="{ count: 0 }">
        <button @click="count++">+</button>
        <span x-text="count"></span>
        <button @click="count--">-</button>
      </div>
    `,
  });

app.get("/", (req, res) => {
  return res.send(html.render(HomeView()));
});

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("App ready at http://localhost:3000"));
