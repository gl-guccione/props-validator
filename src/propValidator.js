const errorStyle =
  "background-color: #ffe500; background-image: linear-gradient(80deg, #ffe500 0%, #ffb44e 100%); color: #0062FF; padding: 6px; border-radius: 1px; font-weight: 700; font-size: 1.15em; line-height: 2.15em; border-left: 8px solid #FF2525;";
const warningStyle =
  "background-color: #ffffff; background-image: linear-gradient(60deg, #ffffff 0%, #beecff 100%); color: #0062FF; padding: 6px; border-radius: 1px; font-weight: 700; font-size: 1.15em; line-height: 2.15em; border-left: 8px solid #FFBE25";

const getStyle = (style) => {
  return style === "error"
    ? errorStyle
    : style === "warning"
    ? warningStyle
    : style
    ? style
    : "background-color: #fff; color: #0062FF";
};

const getCorrectTypeOf = (value) => {
  return typeof value === "object"
    ? Array.isArray(value)
      ? "array"
      : "object"
    : typeof value;
};

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

const checkForEmpty = (conf = {}, pValue = "") => {
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

const checkType = (conf = {}, pValue = "") => {
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

const valueWithOptions = (conf = {}, pValue = "", qualifiedValues = []) => {
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

  if (qualifiedValues.length && !qualifiedValues.includes(pValue)) {
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

const stringIsRichText = (conf = {}, pValue = "") => {
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

export default { checkForEmpty, checkType, valueWithOptions, stringIsRichText };
