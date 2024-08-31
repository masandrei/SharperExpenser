import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PopupProvider } from "./storage/ContextStorage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PopupProvider>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </PopupProvider>
  </React.StrictMode>
);
