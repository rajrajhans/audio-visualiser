import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GlobalStateProvider } from "./state/GlobalStateProvider";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
