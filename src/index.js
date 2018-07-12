import React from "react";
import ReactDOM from "react-dom";

import LoginForm from "./Components/MainLoginPage/LoginFormCombine.js"
import LoginAesthetics from "./Components/MainLoginPage/LoginAesthetics.js"


ReactDOM.render(<LoginForm />, document.getElementById("LoginFormID"));
ReactDOM.render(<LoginAesthetics />, document.getElementById("LoginAesthetics"));
