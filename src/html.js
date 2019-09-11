import xss from "xss";

/**
 * A custom template string tag which additionally to do the standard value interpolation
 * it escapes any value which could create XSS vulnerabilities.
 *
 * To skip XSS protection on a given value, append :html after the value interpolation.
 *
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
 * guaranteed that the value is safe, you can do so by changing the previous template to:
 *
 *    html`This is unsafe ${content}:html`
 *
 * @param {String[]} strings List of strings (split of the literal string at each value)
 * @param  {...any} values List of values to interpolate into the resulting string
 */
const html = (strings, ...values) =>
  // Reduce the list of strings to a single string
  strings.reduce((output, currentString, i) => {
    // Next string to use after the current one and the current value are used, just for looking ahead.
    const nextString = strings[i + 1];
    // Current value to interpolate in the resulting string
    let currentValue = values[i] !== undefined ? values[i] : "";

    // If current value is an array, then transform it to a string by joining its values with an empty space.
    if (Array.isArray(currentValue)) {
      currentValue = currentValue.join(" ");
    }

    // Ensure the current value is a String
    currentValue = currentValue.toString();

    // Decide if XSS protection is necessary, by looking if the next line starts by :html
    if (nextString !== undefined) {
      if (!nextString.startsWith(":html")) {
        currentValue = xss(currentValue);
      }
    }
    // Clean any existing ":html" string from current string
    const cleanCurrentString = currentString.replace(/:html/g, "");

    // Return resulting string up to this point
    return `${output}${cleanCurrentString}${currentValue}`;
  }, "");

export default html;
module.exports = html;
