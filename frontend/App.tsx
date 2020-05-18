import React from "react";
//import { AppStateContainer } from "./AppState";
import { NotificationsContainer, Notifications } from "./helpers/Notifications";
import { routes } from "./routes";
import { useRoutes } from "hookrouter";
import { GlobalLayout } from "./GlobalLayout";
//import { Mixpanel } from "./utils/mixpanel";

// Entry point of dashboard
export const App = () => {
  const currentRoute = useRoutes(routes);
  // var path = location.pathname;
  // if(path == '/'){
  //   path = 'Home'
  // }
  //Mixpanel.track(path);
  return (
    <>
      <NotificationsContainer.Provider>
        <GlobalLayout>
          {currentRoute || (
            <>
              {/* TODO: Replace with a better 404 page */}
              <div>You seem to be lost</div>
            </>
          )}
        </GlobalLayout>
      </NotificationsContainer.Provider>
    </>
  );
};
