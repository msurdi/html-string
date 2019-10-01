const html = require("./html");

describe("Html templates", () => {
  it("Renders a basic template", () => {
    const template = () =>
      html `
        <p>A simple template</p>
      `;

    expect(template().trim()).toEqual("<p>A simple template</p>");
  });

  it("Interpolates simple values", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}</p>
      `;

    expect(template("funky").trim()).toEqual(
      "<p>A simple template with a value of funky</p>"
    );
  });

  it("Renders a falsy value as an empty string except if it is a number", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}</p>
      `;

    expect(template(false).trim()).toEqual(
      "<p>A simple template with a value of </p>"
    );

    expect(template("").trim()).toEqual(
      "<p>A simple template with a value of </p>"
    );

    expect(template(null).trim()).toEqual(
      "<p>A simple template with a value of </p>"
    );

    expect(template(0).trim()).toEqual(
      "<p>A simple template with a value of 0</p>"
    );

  });

  it("Interpolates an array as a string", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}</p>
      `;

    expect(template(["funky", "funny"]).trim()).toEqual(
      "<p>A simple template with a value of funky funny</p>"
    );
  });

  it("Interpolates an undefined value as an empty string", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}.</p>
      `;

    expect(template(undefined).trim()).toEqual(
      "<p>A simple template with a value of .</p>"
    );
  });

  it("Interpolates an object value as its toString() value", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}.</p>
      `;
    const testValue = {
      toString() {
        return "Serialized";
      }
    };
    expect(template(testValue).trim()).toEqual(
      "<p>A simple template with a value of Serialized.</p>"
    );
  });

  it("Escapes dangerous values (xss)", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}</p>
      `;

    expect(template("<script>alert('boom!')</script>").trim()).toEqual(
      "<p>A simple template with a value of &lt;script&gt;alert('boom!')&lt;/script&gt;</p>"
    );
  });

  it("Does not escape dangerous values with the :html modifier", () => {
    const template = value =>
      html `
        <p>A simple template with a value of ${value}:html</p>
      `;

    expect(template("<script>alert('boom!')</script>").trim()).toEqual(
      "<p>A simple template with a value of <script>alert('boom!')</script></p>"
    );
  });
});
