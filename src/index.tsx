import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import StartingPage from "./components/startingPage";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <StartingPage />
  </React.StrictMode>
);

reportWebVitals();
