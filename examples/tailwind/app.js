import express from "express";
import html from "html-string";

const app = express();

const Layout = ({ title, children }) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <main class="flex flex-col justify-center">${children}</main>
    </body>
  </html>
`;

const HomeView = () =>
  Layout({
    title: "Tailwind App",
    children: html`
      <div class="bg-gray-100 rounded border border-gray-200 text-center m-4">
        Hello World
      </div>
    `,
  });

app.get("/", (req, res) => {
  return res.send(html.render(HomeView()));
});

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("App ready at http://localhost:3000"));
