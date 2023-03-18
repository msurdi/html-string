import express from "express";
import html from "html-string";

const app = express();

const Layout = ({ title, children }) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <script src="//unpkg.com/@hotwired/stimulus" defer></script>
      <script type="module">
        import {
          Application,
          Controller,
        } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";
        window.Stimulus = Application.start();

        Stimulus.register(
          "counter",
          class extends Controller {
            static targets = ["count"];
            static values = { count: Number };

            connect() {
              this.countValue = 0;
            }

            increment() {
              this.countValue++;
            }

            decrement() {
              this.countValue--;
            }

            countValueChanged() {
              this.countTarget.textContent = this.countValue;
            }
          }
        );
      </script>
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
      <div data-controller="counter">
        <button data-action="counter#increment">+</button>
        <span data-counter-target="count"></span>
        <button data-action="counter#decrement">-</button>
      </div>
    `,
  });

app.get("/", (req, res) => {
  return res.send(html.render(HomeView()));
});

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("App ready at http://localhost:3000"));
