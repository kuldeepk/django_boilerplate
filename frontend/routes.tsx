import React from "react";
import loadable, { LoadableComponent } from '@loadable/component'
import { navigate } from "hookrouter";
import { isEmpty } from "lodash";
import { Home } from "./Home";
import { Login } from "./Auth/Login";
import { Signup } from "./Auth/Signup";

export const routes = {
	"/": () => <Home />,
	"/login": () => <Login />,
	"/signup": () => <Signup />,
};