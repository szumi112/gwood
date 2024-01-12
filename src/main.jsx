import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";

import { UserProvider } from "./user-context.jsx";

import theme from "../chakra-theme.js";
import { LoadContextProvider } from "./load-context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <LoadContextProvider>
        <BrowserRouter>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </LoadContextProvider>
    </UserProvider>
  </React.StrictMode>
);
