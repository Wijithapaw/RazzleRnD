import React from "react";
import "./App.css";
import MainLayout from "./pages/MainLayout";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Switch>
      <Route path="/login" exact component={LoginPage} />
      <Route
        path="/:tenantId?"
        component={() => <MainLayout />}
      />
    </Switch>
  );
}

export default App;
