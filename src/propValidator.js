const errorStyle =
  "background-color: #ffe500; background-image: linear-gradient(80deg, #ffe500 0%, #ffb44e 100%); color: #0062FF; padding: 6px; border-radius: 1px; font-weight: 700; font-size: 1.15em; line-height: 2.15em; border-left: 8px solid #FF2525;";
const warningStyle =
  "background-color: #ffffff; background-image: linear-gradient(60deg, #ffffff 0%, #beecff 100%); color: #0062FF; padding: 6px; border-radius: 1px; font-weight: 700; font-size: 1.15em; line-height: 2.15em; border-left: 8px solid #FFBE25";

/**
 * Generate the correct style for the console.log()
 *
 * @param {string} style style from props, possible values are:
 *                       "error" will take the style for the error log
 *                       "warning" will take the style for the warning log
 *                       "cssKey: cssValue; ... " will set the custom style properties
 * @return {string} string containing the css properties based on the style parameter
 */
const getStyle = (style) => {
  return style === "error"
    ? errorStyle
    : style === "warning"
    ? warningStyle
    : style
    ? style
    : "background-color: #fff; color: #0062FF";
};

/**
 * return the correct typeof value (done beacuse typeof [] will usually return object)
 *
 * @param {any} value return the type of this parameter
 *
 * @return {string} string containing type of the parameter value (
 *                    true will return 'boolean',
 *                    "" will return 'string',
 *                    5 will return 'number',
 *                    [] will return 'array',
 *                    {} will return 'object'
 *                  )
 */
const getCorrectTypeOf = (value) => {
  return typeof value === "object"
    ? Array.isArray(value)
      ? "array"
      : "object"
    : typeof value;
};

/**
 * log the error
 *
 * @param {string} name name of the prop
 * @param {any} value value of the prop
 * @param {string} style style for the console.log
 * @param {string} message string to log
 * @param {string} overrideErrorMessage string to log instead of the message
 */
const throwError = (
  name,
  value,
  style,
  message = "error",
  overrideErrorMessage = ""
) => {
  const typeOfValue = getCorrectTypeOf(value);

  console.log(
    overrideErrorMessage
      ? `%c 🤬 ${overrideErrorMessage} `
      : `%c 🤬 ${message} `,
    getStyle(style)
  );
  console.log(`%c 🪃 ${name} => (${value}:${typeOfValue})`, getStyle(style));
  if (typeOfValue === "object" || typeOfValue === "array") {
    if (Object.keys([value]).length) {
      console.log(value);
    } else {
      console.table(value);
    }
  }
};

/**
 * check if the value is not defined
 *
 * @param {object} conf configuration object
 *                      cName = name of the parent component
 *                      pName = name of the prop
 *                      ?section = name of upper component (give more info to find where the prop is located)
 *                      style = style ("error" | "warning" | custom css)
 *                      ?overrideErrorMessage = override message to log
 * @param {any} pValue value of the prop
 *
 * @return {boolean | null} if the error is generated ? return true : null
 */
const checkForEmpty = (conf = {}, pValue) => {
  const {
    cName = "",
    pName = "",
    section = "",
    style = "error",
    overrideErrorMessage = "",
  } = conf;

  if (pValue === "") {
    throwError(
      pName,
      pValue,
      style,
      `propValidator => error on ${cName} component${
        section ? `(under ${section})` : ""
      }, "${pName}" must be defined.`,
      overrideErrorMessage
    );
    return true;
  }
};

/**
 * check the type of the value
 *
 * @param {object} conf configuration object
 *                      cName = name of the parent component
 *                      pName = name of the prop
 *                      ?expectedTypes = array of the expected types
 *                      ?section = name of upper component (give more info to find where the prop is located)
 *                      style = style ("error" | "warning" | custom css)
 *                      ?overrideErrorMessage = override message to log
 * @param {any} pValue value of the prop
 *
 * @return {boolean | null} if the error is generated ? return true : null
 */
const checkType = (conf = {}, pValue) => {
  const {
    cName = "",
    pName = "",
    expectedTypes = ["string"],
    section = "",
    style = "error",
    overrideErrorMessage = "",
  } = conf;
  const typeOfValue = getCorrectTypeOf(pValue);

  let result = checkForEmpty(conf, pValue);
  if (result) return true;

  if (!expectedTypes.includes(typeOfValue)) {
    throwError(
      pName,
      pValue,
      style,
      `propValidator => error on ${cName} component${
        section ? `(under ${section})` : ""
      }, "${pName}" expected to be ${expectedTypes.join(
        " or "
      )}, instead got ${typeOfValue}`,
      overrideErrorMessage
    );
    return true;
  }
};

/**
 * check if the value is equal to one of the qualified values
 *
 * @param {object} conf configuration object
 *                      cName = name of the parent component
 *                      pName = name of the prop
 *                      ?expectedTypes = array of the expected types
 *                      ?section = name of upper component (give more info to find where the prop is located)
 *                      style = style ("error" | "warning" | custom css)
 *                      ?overrideErrorMessage = override message to log
 * @param {any} pValue value of the prop
 * @param {array} qualifiedValues array of the possible values of the value
 *
 * @return {boolean | null} if the error is generated ? return true : null
 */
const valueWithOptions = (conf = {}, pValue, qualifiedValues) => {
  const {
    cName = "",
    pName = "",
    section = "",
    style = "error",
    overrideErrorMessage = "",
  } = conf;
  const typeOfValue = getCorrectTypeOf(pValue);

  let result = checkType(conf, pValue);
  if (result) return true;

  if (
    Array.isArray(qualifiedValues) &&
    qualifiedValues.length &&
    !qualifiedValues.includes(pValue)
  ) {
    throwError(
      pName,
      pValue,
      style,
      `propValidator => error on ${cName} component${
        section ? `(under ${section})` : ""
      }, "${pName}" can not have value "${pValue}":${typeOfValue}, possible values are ${qualifiedValues
        .map((qVal) => `"${qVal}":${getCorrectTypeOf(qVal)}`)
        .join(", ")}.`,
      overrideErrorMessage
    );
    return true;
  }
};

/**
 * check if the string is a richtext
 *
 * @param {object} conf configuration object
 *                      cName = name of the parent component
 *                      pName = name of the prop
 *                      ?section = name of upper component (give more info to find where the prop is located)
 *                      style = style ("error" | "warning" | custom css)
 *                      ?overrideErrorMessage = override message to log
 * @param {string} pValue value of the string
 *
 * @return {boolean | null} if the error is generated ? return true : null
 */
const stringIsRichText = (conf = {}, pValue) => {
  const {
    cName = "",
    pName = "",
    section = "",
    style = "error",
    overrideErrorMessage = "",
  } = conf;
  const typeOfValue = getCorrectTypeOf(pValue);

  let result = checkForEmpty(conf, pValue);
  if (result) return true;
  result = checkType({ ...conf, expectedTypes: ["string"] }, pValue);
  if (result) return true;

  if (!pValue.trim().match(/^<p>.*<\/p>$/)) {
    throwError(
      pName,
      pValue,
      style,
      `propValidator => error on ${cName} component${
        section ? `(under ${section})` : ""
      }, "${pName}" can not have value "${pValue}":${typeOfValue}, it must be a richtext (string with <p> ... </p>)`,
      overrideErrorMessage
    );
    return true;
  }
};

/**
 * check if the string math a regex
 *
 * @param {object} conf configuration object
 *                      cName = name of the parent component
 *                      pName = name of the prop
 *                      ?section = name of upper component (give more info to find where the prop is located)
 *                      style = style ("error" | "warning" | custom css)
 *                      ?overrideErrorMessage = override message to log
 * @param {string} pValue value of the string
 * @param {string} regex value that will generate the regex
 *                       (it will escape the needed value)
 *                       (exclude the / /, '^C' will generate this regex pattern /^C/)
 *
 * @return {boolean | null} if the error is generated ? return true : null
 */
const stringMatchRegex = (conf = {}, pValue, regex) => {
  const {
    cName = "",
    pName = "",
    section = "",
    style = "error",
    overrideErrorMessage = "",
  } = conf;

  if (regex === undefined) return true;

  const typeOfValue = getCorrectTypeOf(pValue);

  let result = checkForEmpty(conf, pValue);
  if (result) return true;
  result = checkType({ ...conf, expectedTypes: ["string"] }, pValue);
  if (result) return true;

  const regexPattern = new RegExp(regex);
  if (!pValue.trim().match(regexPattern)) {
    throwError(
      pName,
      pValue,
      style,
      `propValidator => error on ${cName} component${
        section ? `(under ${section})` : ""
      }, "${pName}" with value "${pValue}":${typeOfValue}, does not match the regex ${regexPattern}`,
      overrideErrorMessage
    );
    return true;
  }
};

export default {
  checkForEmpty,
  checkType,
  valueWithOptions,
  stringIsRichText,
  stringMatchRegex,
};
