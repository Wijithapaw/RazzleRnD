import React from "react";
import "./App.scss";
import MainLayout from "./pages/MainLayout";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { commonRoutes } from "./routes";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Switch>
      {commonRoutes.map((r) => (
        <Route key={r.name} path={r.path} exact={r.exact}>
          {r.component}
        </Route>
      ))}
      <Route path="/:tenantId?" component={() => <MainLayout />} />
    </Switch>
  );
}

export default App;
