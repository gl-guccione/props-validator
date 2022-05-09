import React, { useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";
import pValidator from "./propValidator";

const App = (props) => {
  const {
    vString = "",
    vSelect = "",
    vRichText = "",
    vStringCustomRegex = "",
    vBool = false,
    vObject = {},
  } = props;

  useEffect(() => {
    const isValidatorEnabled = sessionStorage.getItem("propValidator");
    if (isValidatorEnabled) {
      pValidator.checkType(
        { cName: "App", pName: "vString", expectedTypes: ["string"] },
        vString
      );
      pValidator.valueWithOptions(
        { cName: "App", pName: "vSelect", expectedTypes: ["string", "number"] },
        vSelect,
        ["ciao", "uno", 3, "cinquantadue"]
      );
      pValidator.stringIsRichText(
        { cName: "App", pName: "vRichText" },
        vRichText
      );
      pValidator.stringMatchRegex(
        { cName: "App", pName: "vStringCustomRegex" },
        vStringCustomRegex,
        "^U.*(c|C)$"
      );
      pValidator.checkType(
        {
          cName: "App",
          pName: "vBool",
          expectedTypes: ["boolean"],
        },
        vBool
      );
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>propsValidator</p>
      </header>
    </div>
  );
};

export default App;
