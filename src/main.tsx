import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChakraProvider, Box, extendTheme, GlobalStyle } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Work from "./components/Work";

import LinesContainer from './components/LinesContainer';
import { drop } from './globalStyles';

const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "work", Component: Work },
]);

const theme = extendTheme({
  styles: {
    global: () => ({
      "@keyframes drop": drop
    })
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
