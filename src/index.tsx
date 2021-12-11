import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./App";

import "./tw.css";
import "./style.css";

ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
  //Accept hot replacements (required for HMR to work)
  module.hot.accept();
}
