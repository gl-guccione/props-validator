const errorStyle =
  "background-color: #ffe500; background-image: linear-gradient(80deg, #ffe500 0%, #ffb44e 100%); color: #0062FF; padding: 6px; border-radius: 1px; font-weight: 700; font-size: 1.15em; line-height: 1.9em; border-left: 8px solid #FF2525;";
const warningStyle =
  "background-color: #ffffff; background-image: linear-gradient(60deg, #ffffff 0%, #beecff 100%); color: #0062FF; padding: 6px; border-radius: 1px; font-weight: 700; font-size: 1.15em; line-height: 1.9em; border-left: 8px solid #FFBE25";

const propValidator = {
  /**
   * validate values and compare with the qualified values passed with parameters
   *
   * @param {object} conf configuration object
   * @param {any} pValue value of the prop
   * @param {array} qualifiedValues accepted values
   */
  valueWithOptions: (conf = {}, pValue = "", qualifiedValues = []) => {
    const {
      cName = "",
      pName = "",
      section = "",
      style = "error",
      overrideErrorMessage,
      required = true,
    } = conf;

    const getStyle = () => {
      return style === "error"
        ? errorStyle
        : style === "warning"
        ? warningStyle
        : style
        ? style
        : "color: blue";
    };

    const throwError = (message = "error") => {
      console.log(
        overrideErrorMessage
          ? `%c 🤬 ${overrideErrorMessage} `
          : `%c 🤬 ${message}`,
        getStyle(),
        "val =>",
        pValue,
        `:${typeof pValue}`
      );
    };

    if (pValue === "") {
      throwError(
        `propValidator => error on ${cName} component${
          section ? `(under ${section})` : ""
        }, "${pName}" ${required ? "must" : "should"} be defined `
      );
      return;
    }
    if (qualifiedValues.length && !qualifiedValues.includes(pValue)) {
      throwError(
        `propValidator => error on ${cName} component${
          section ? `(under ${section})` : ""
        }, "${pName}" ${
          required ? "can" : "should"
        } not have value "${pValue}", possible values are ${qualifiedValues
          .map((qVal) => `"${qVal}":${typeof qVal}`)
          .join(", ")}`
      );
      return;
    }
  },
};

export default propValidator;
