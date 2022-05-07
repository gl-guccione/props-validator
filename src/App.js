import React, { useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";
import propValidator from "./propValidator";

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
      propValidator.valueWithOptions(
        { cName: "App", pName: "vSelect" },
        vSelect,
        ["ciao", "uno", 3]
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
