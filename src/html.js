import xss from "xss";

const toKebabCase = string => {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

class HtmlString {
  constructor(value) {
    this.value = value;
  }

  render() {
    return this.value;
  }

  toString() {
    return this.value;
  }
}

/**
 * A custom template string tag which additionally to do the standard value interpolation
 * it escapes any value which could create XSS vulnerabilities.
 *
 * To skip XSS protection on a given value, append :safe after the value interpolation. it
 * is not not necessary to append the :safe modifier if the value is already an html-string.
 *
 * Example:
 *  Given the template:
 *
 *    html`This is safe ${content}`
 *
 * when the value of content is something like
 * <script>alert("boom!")</script>, if the output of the template is sent to the browser, the script
 * tag will be escaped and thus no XSS will happen.
 *
 * If you need to use unsafe content, thus skip the XSS escaping because you already have manually
 * guaranteed that the value is safe and you know what you are doing, then you can do so by changing
 * the previous template to:
 *
 *    html`This is unsafe ${content}:safe`
 *
 * @param {String[]} strings List of strings (split of the literal string at each value)
 * @param  {...any} values List of values to interpolate into the resulting string
 */
const html = (strings, ...values) => {
  // Reduce the list of strings to a single string
  const resultString = strings.reduce((output, currentString, i) => {
    // Next string to use after the current one and the current value are used, just for looking ahead.
    const nextString = strings[i + 1];
    // Current value to interpolate in the resulting string
    let currentValue =
      values[i] !== null && values[i] !== undefined && values[i] !== false
        ? values[i]
        : "";

    const isHtmlString = currentValue instanceof HtmlString;

    if (isHtmlString) {
      currentValue = currentValue.render();
    }

    // Decide if value should be interpreted as html key=value pairs
    if (
      nextString &&
      nextString.startsWith(":attrs") &&
      typeof currentValue === "object"
    ) {
      currentValue = Object.keys(currentValue)
        .map(key => {
          if (typeof currentValue[key] === "boolean") {
            if (currentValue[key] === false) {
              return "";
            }
            return `${toKebabCase(key)}`;
          }
          return `${toKebabCase(key)}="${currentValue[key]}"`;
        })
        .filter(Boolean)
        .join(" ");
    }

    // Decide if XSS protection is necessary, by looking if the next line starts by :safe
    if (!nextString || !nextString.startsWith(":safe")) {
      if (Array.isArray(currentValue)) {
        currentValue.map(v =>
          v instanceof HtmlString ? v : xss(v.toString())
        );
      } else {
        currentValue = xss(currentValue.toString());
      }
    }

    // If current value is an array, then transform it to a string by joining its values with an empty space.
    if (Array.isArray(currentValue)) {
      currentValue = currentValue.join(" ");
    }

    // Clean any existing ":<modifier>" string from output
    const cleanCurrentString = currentString.replace(/:(safe|attrs)/g, "");

    // Return resulting string up to this point
    return `${output}${cleanCurrentString}${currentValue}`;
  }, "");

  return new HtmlString(resultString);
};

export default html;
module.exports = html;
