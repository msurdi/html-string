/* eslint-disable max-classes-per-file */
const xss = require("xss");

const toKebabCase = (string) =>
  string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

class UnsafeString {
  constructor(value) {
    this.value = value;
  }
}

class HtmlString {
  constructor(value) {
    this.value = value;
  }
}

const toHtmlValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(toHtmlValue).join(" ");
  }
  if (value === false || value === null || value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (value instanceof UnsafeString) {
    return value.value;
  }
  if (value instanceof HtmlString) {
    return value.value;
  }
  if (typeof value === "object") {
    return value.toString();
  }
  return xss(value);
};

const toAttributeString = (key, value) => {
  if (value === true) {
    return toKebabCase(key);
  }

  if (value === false || value === null || value === undefined) {
    return "";
  }

  return `${toKebabCase(key)}="${toHtmlValue(value)}"`;
};

const html = (strings, ...values) => {
  const htmlValues = values.map(toHtmlValue);
  return new HtmlString(String.raw({ raw: strings }, ...htmlValues));
};

html.attrs = (attrs) => {
  const attrStrings = Object.entries(attrs).map(([key, value]) =>
    toAttributeString(key, value)
  );

  return attrStrings.join(" ").trim();
};

html.render = (value) => value.value.trim();
html.unsafe = (value) => new UnsafeString(value);

module.exports = html;
