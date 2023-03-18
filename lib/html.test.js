const html = require("./html");

describe("Html templates", () => {
  it("Renders a basic template", () => {
    const template = () => html` <p>A simple template</p> `;

    expect(html.render(template())).toEqual("<p>A simple template</p>");
  });

  it("Interpolates simple values", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(html.render(template("funky"))).toEqual(
      "<p>A simple template with a value of funky</p>"
    );

    expect(html.render(template(1))).toEqual(
      "<p>A simple template with a value of 1</p>"
    );
  });

  it("Renders a falsy value as an empty string except if it is a number", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(html.render(template(false))).toEqual(
      "<p>A simple template with a value of </p>"
    );
    expect(html.render(template(""))).toEqual(
      "<p>A simple template with a value of </p>"
    );
    expect(html.render(template(null))).toEqual(
      "<p>A simple template with a value of </p>"
    );
    expect(html.render(template(0))).toEqual(
      "<p>A simple template with a value of 0</p>"
    );
  });

  it("Interpolates an array as a string", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(html.render(template(["funky", "funny"]))).toEqual(
      "<p>A simple template with a value of funky funny</p>"
    );
  });

  it("Handles an undefined value in a list", () => {
    const template = (values) =>
      // prettier-ignore
      html`
      <ul>${values.map(v => html`<li>${v}</li>`)}</ul>
    `;

    expect(html.render(template(["ok", undefined]))).toEqual(
      "<ul><li>ok</li> <li></li></ul>"
    );
  });

  it("Interpolates an undefined value as an empty string", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}.</p> `;

    expect(html.render(template(undefined))).toEqual(
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

    expect(html.render(template(testValue))).toEqual(
      "<p>A simple template with a value of Serialized.</p>"
    );
  });

  it("Escapes dangerous values (xss)", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${value}</p> `;

    expect(html.render(template("<script>alert('boom!')</script>"))).toEqual(
      "<p>A simple template with a value of &lt;script&gt;alert('boom!')&lt;/script&gt;</p>"
    );
  });

  it("Does not escape nested templates", () => {
    const template = () =>
      // prettier-ignore
      html`<h1>A ${html`<script>nested</script>`} value</h1>`;

    expect(html.render(template())).toEqual(
      `<h1>A <script>nested</script> value</h1>`
    );
  });

  it("Does not escape templates passed as values", () => {
    const templateValue = () =>
      // prettier-ignore
      html`<h1>A value with tags</h1>`;
    // prettier-ignore
    const template = value =>html`<div>${value}</div>`;

    expect(html.render(template(templateValue()))).toEqual(
      `<div><h1>A value with tags</h1></div>`
    );
  });

  it("Does not escape arrays of templates passed as values", () => {
    // prettier-ignore
    const templateValue = v =>
      html`<li>A value ${v} with tags</li>`;
    // prettier-ignore
    const template = values =>html`<ul>${values.map(v => templateValue(v))}</ul>`;

    expect(html.render(template(["a", "b", "c"]))).toEqual(
      "<ul><li>A value a with tags</li> <li>A value b with tags</li> <li>A value c with tags</li></ul>"
    );
  });

  it("Does not escape unsafe attributes marked as such", () => {
    const template = (value) =>
      html` <p>A simple template with a value of ${html.unsafe(value)}</p> `;

    expect(html.render(template("<script>alert('boom!')</script>"))).toEqual(
      "<p>A simple template with a value of <script>alert('boom!')</script></p>"
    );
  });

  it("Transforms any object value to html attributes", () => {
    const template = (value) => html` <p ${html.attrs(value)}></p> `;

    expect(
      html.render(
        template({
          id: 1,
          name: "value",
          dataCustom: "customData",
          dataMultipleWords: "multipleWords",
        })
      )
    ).toEqual(
      '<p id="1" name="value" data-custom="customData" data-multiple-words="multipleWords"></p>'
    );
  });

  it("Preserves booleans (true) in object to attributes transformation", () => {
    const template = (value) => html` <p ${html.attrs(value)}></p> `;

    expect(
      html.render(
        template({
          id: 1,
          disabled: true,
        })
      )
    ).toEqual('<p id="1" disabled></p>');
  });

  it("Removes booleans (false) in object to attributes transformation", () => {
    const template = (value) => html` <p ${html.attrs(value)}></p> `;

    expect(
      html.render(
        template({
          id: 1,
          disabled: false,
        })
      )
    ).toEqual('<p id="1"></p>');
  });

  it("Removes undefined values in object to attributes transformation", () => {
    const template = (value) => html` <p ${html.attrs(value)}></p> `;

    expect(
      html.render(
        template({
          id: 1,
          value: undefined,
        })
      )
    ).toEqual('<p id="1"></p>');
  });

  it("Removes undefined values in object to attributes transformation", () => {
    const template = (value) => html` <p ${html.attrs(value)}></p> `;

    expect(
      html.render(
        template({
          id: 1,
          value: null,
        })
      )
    ).toEqual('<p id="1"></p>');
  });
});
