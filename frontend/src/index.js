import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "./styles/Button";
import "@fontsource/poppins";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: process.env.REACT_APP_OIDC_AUTHORITY,
  client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_PROJECT_URL,
};

export const theme = extendTheme({
  components: {
    Button: buttonTheme,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider {...oidcConfig}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </AuthProvider>
);
