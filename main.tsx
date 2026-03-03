import React from "react";
import { createRoot } from "react-dom/client";
import App from "./workflow_v1";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root container #root not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
