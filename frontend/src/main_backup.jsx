import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import "./index.css";
// import "./i18n";

// Removed StrictMode to prevent double-rendering during state transition audit
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
