const html = require("./html");

describe("Html templates", () => {
  it("Renders a basic template", () => {
    const template = () => html` <p>A simple template</p> `;

    expect(template().render().trim()).toEqual("<p>A simple template</p>");
  });

  it("Interpolates simple values", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(template("funky").render().trim()).toEqual(
      "<p>A simple template with a value of funky</p>"
    );
  });

  it("Renders a falsy value as an empty string except if it is a number", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(template(false).render().trim()).toEqual(
      "<p>A simple template with a value of </p>"
    );

    expect(template("").render().trim()).toEqual(
      "<p>A simple template with a value of </p>"
    );

    expect(template(null).render().trim()).toEqual(
      "<p>A simple template with a value of </p>"
    );

    expect(template(0).render().trim()).toEqual(
      "<p>A simple template with a value of 0</p>"
    );
  });

  it("Interpolates an array as a string", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(template(["funky", "funny"]).render().trim()).toEqual(
      "<p>A simple template with a value of funky funny</p>"
    );
  });

  it("Handles an undefined value in a list", () => {
    const template = (values) =>
      // prettier-ignore
      html`
      <ul>${values.map(v => html`<li>${v}</li>`)}</ul>
    `;

    expect(template(["ok", undefined]).render().trim()).toEqual(
      "<ul><li>ok</li> <li></li></ul>"
    );
  });

  it("Interpolates an undefined value as an empty string", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}.</p> `;

    expect(template(undefined).render().trim()).toEqual(
      "<p>A simple template with a value of .</p>"
    );
  });

  it("Interpolates an object value as its toString() value", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}.</p> `;
    const testValue = {
      toString() {
        return "Serialized";
      },
    };
    expect(template(testValue).render().trim()).toEqual(
      "<p>A simple template with a value of Serialized.</p>"
    );
  });

  it("Escapes dangerous values (xss)", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(template("<script>alert('boom!')</script>").render().trim()).toEqual(
      "<p>A simple template with a value of &lt;script&gt;alert('boom!')&lt;/script&gt;</p>"
    );
  });

  it("Does not escape nested templates", () => {
    const template = () =>
      // prettier-ignore
      html`<h1>A ${html`<script>nested</script>`} value</h1>`;

    expect(template().render().trim()).toEqual(
      `<h1>A <script>nested</script> value</h1>`
    );
  });

  it("Does not escape templates passed as values", () => {
    const templateValue = () =>
      // prettier-ignore
      html`<h1>A value with tags</h1>`;

    // prettier-ignore
    const template = value =>html`<div>${value}</div>`;

    expect(template(templateValue()).render().trim()).toEqual(
      `<div><h1>A value with tags</h1></div>`
    );
  });

  it("Does not escape arrays of templates passed as values", () => {
    // prettier-ignore
    const templateValue = v =>
      html`<li>A value ${v} with tags</li>`;

    // prettier-ignore
    const template = values =>html`<ul>${values.map(v => templateValue(v))}</ul>`;

    expect(template(["a", "b", "c"]).render().trim()).toEqual(
      "<ul><li>A value a with tags</li> <li>A value b with tags</li> <li>A value c with tags</li></ul>"
    );
  });

  it("Does not escape dangerous values with the :safe modifier", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}:safe</p> `;

    expect(template("<script>alert('boom!')</script>").render().trim()).toEqual(
      "<p>A simple template with a value of <script>alert('boom!')</script></p>"
    );
  });

  it("Transforms any object value with a :attrs suffix to html attributes", () => {
    const template = (value) => html` <p ${value}:attrs></p> `;

    expect(
      template({
        id: 1,
        name: "value",
        dataCustom: "customData",
      })
        .render()
        .trim()
    ).toEqual('<p id="1" name="value" data-custom="customData"></p>');
  });

  it(":attrs modifier preserves boolean attribute without a value", () => {
    const template = (value) => html` <p ${value}:attrs></p> `;

    expect(
      template({
        id: 1,
        disabled: true,
      })
        .render()
        .trim()
    ).toEqual('<p id="1" disabled></p>');
  });

  it(":attrs modifier removes boolean attribute", () => {
    const template = (value) => html` <p ${value}:attrs></p> `;

    expect(
      template({
        id: 1,
        disabled: false,
      })
        .render()
        .trim()
    ).toEqual('<p id="1"></p>');
  });
});
