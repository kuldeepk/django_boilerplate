import "bootstrap/dist/css/bootstrap.css";
import "./styles/theme.scss";
import "./styles/i-con.css";
import "./styles/style.scss";
import "./styles/main.scss";

import React from "react";
import {render} from "react-dom";
import {App} from "./App";

render(<App />, document.getElementById("root"));
