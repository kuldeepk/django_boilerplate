import {useState} from "react";
import { createContainer } from "unstated-next"
import { NewUserSchema } from "./schema/NewUser";
//import { NewUserProfileSchema } from './schema/NewUserProfile';
import { isEmpty } from "lodash";

// export interface UserProfile extends NewUserProfileSchema {
// }

export interface User extends Omit<NewUserSchema, "password1" | "password2"> {
    username: string;
    profile?: any;
}

export interface AppContext {
    user?: User;
}

declare global {
    interface Window {
        __CONTEXT__?: AppContext;
    }
}

export const preRenderedContext: AppContext = window.__CONTEXT__ || {};

// Get rid of globals as soon as possible
//window.__CONTEXT__ = undefined;

export const useAppState = (initialState = preRenderedContext) => {
    const [state, setState] = useState(initialState);
    return {
        ...state,
        setUser: (user: User) => setState((s) => ({...s, user})),
        // setProfile: (userProfile: UserProfile) => setState((s) => {
        //     s.user.profile = userProfile;
        //     return s
        // }),
    }
}

export const AppStateContainer = createContainer(useAppState);
