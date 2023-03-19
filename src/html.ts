/* eslint-disable max-classes-per-file */
import xss from "xss";

/**
 * Types of values that can be used as attributes
 */
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

/**
 * Accepted attribute types can be either a single value or an array of values
 */
type AttributeValue = BaseAttributeValue | BaseAttributeValue[];

/**
 * Convert a string from camelCase to kebab-case
 */
const toKebabCase = (value: string) =>
  value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Wrapper class for values that should not be escaped
 */
class UnsafeValue {
  value: AttributeValue;

  constructor(value: AttributeValue) {
    this.value = value;
  }
}

/**
 * Wrapper class for values that should be rendered as HTML
 */
class HtmlString {
  value: AttributeValue;

  constructor(value: AttributeValue) {
    this.value = value;
  }
}

/**
 * Convert an attribute value to a string.
 * For example, a false, null or undefined value will be rendered as an empty string.
 * Other values such as strings, numbers, etc will just be XSS escaped and returned.
 */
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

/**
 * Convert a key and value to an HTML attribute string.
 * For example, a key of "fooBar" and a value of true will be rendered
 * as 'foo-bar' while a key of "fooBar" and a value of "baz" will be rendered as 'foo-bar="baz"'
 */
const toAttributeString = (key: string, value: AttributeValue): string => {
  if (value === true) {
    return toKebabCase(key);
  }

  if (value === false || value === null || value === undefined) {
    return "";
  }

  return `${toKebabCase(key)}="${toHtmlValue(value)}"`;
};

/**
 * Create HTML strings using Template Tag Literals syntax.
 */
const html = (strings: TemplateStringsArray, ...values: AttributeValue[]) => {
  const htmlValues = values.map(toHtmlValue);
  return new HtmlString(String.raw({ raw: strings }, ...htmlValues));
};

/**
 * Convert the object to valid HTML attributes.
 */
html.attrs = (attrs: object) => {
  const attrStrings = Object.entries(attrs).map(([key, value]) =>
    toAttributeString(key, value)
  );

  return attrStrings.join(" ").trim();
};

/**
 * Render the result of an HTML string Template Tag Literal to a plain JavaScript string.
 */
html.render = (value: HtmlString) => value.value?.toString().trim() ?? "";

/**
 * Mark a value as unsafe and prevent it from being escaped.
 */
html.unsafe = (value: AttributeValue) => new UnsafeValue(value);

export default html;
