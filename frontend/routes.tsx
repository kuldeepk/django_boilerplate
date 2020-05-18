import React from "react";
import loadable, { LoadableComponent } from '@loadable/component'
import { navigate } from "hookrouter";
import { isEmpty } from "lodash";
import { Home } from "./Home";

export const routes = {
	"/": () => <Home />,
};