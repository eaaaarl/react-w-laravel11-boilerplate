import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";
import { store } from "./stores/store.ts";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer position="top-right" />
      <App />
    </Provider>
  </React.StrictMode>
);
