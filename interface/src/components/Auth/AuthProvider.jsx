import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "../../utils/history"
import config from "./auth_config.json";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};
const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    ...(config.audience ? { audience: config.audience } : null),
    redirectUri: window.location.origin,
    onRedirectCallback,
};

export const AuthProvider = ({children}) => {
	return (
        <Auth0Provider {...providerConfig}>
        {children}
      </Auth0Provider>
	)
}
