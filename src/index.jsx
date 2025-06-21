import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LangProvider } from "./context/LangContext";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <Router>
          <UserProvider>
            <App />
          </UserProvider>
        </Router>
      </LangProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
