import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./pages/MainLayout";

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
