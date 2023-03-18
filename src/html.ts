/* eslint-disable max-classes-per-file */
import xss from "xss";

type BaseAttributeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | unknown
  | object
  // eslint-disable-next-line no-use-before-define
  | UnsafeValue
  // eslint-disable-next-line no-use-before-define
  | HtmlString;

type AttributeValue = BaseAttributeValue | BaseAttributeValue[];

const toKebabCase = (value: string) =>
  value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

class UnsafeValue {
  value: AttributeValue;

  constructor(value: AttributeValue) {
    this.value = value;
  }
}

class HtmlString {
  value: AttributeValue;

  constructor(value: AttributeValue) {
    this.value = value;
  }
}

const toHtmlValue = (value: AttributeValue): string => {
  if (Array.isArray(value)) {
    return value.map(toHtmlValue).join(" ");
  }
  if (value === false || value === null || value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (value instanceof UnsafeValue) {
    return value.value?.toString() ?? "";
  }
  if (value instanceof HtmlString) {
    return value.value?.toString() ?? "";
  }
  if (typeof value === "object") {
    return value.toString();
  }
  return xss(value.toString());
};

const toAttributeString = (key: string, value: AttributeValue): string => {
  if (value === true) {
    return toKebabCase(key);
  }

  if (value === false || value === null || value === undefined) {
    return "";
  }

  return `${toKebabCase(key)}="${toHtmlValue(value)}"`;
};

const html = (strings: TemplateStringsArray, ...values: AttributeValue[]) => {
  const htmlValues = values.map(toHtmlValue);
  return new HtmlString(String.raw({ raw: strings }, ...htmlValues));
};

html.attrs = (attrs: object) => {
  const attrStrings = Object.entries(attrs).map(([key, value]) =>
    toAttributeString(key, value)
  );

  return attrStrings.join(" ").trim();
};

html.render = (value: HtmlString) => value.value?.toString().trim() ?? "";

html.unsafe = (value: AttributeValue) => new UnsafeValue(value);

export default html;
