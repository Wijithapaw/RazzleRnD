import React from "react";
import "./App.scss";
import MainLayout from "./pages/MainLayout";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { commonRoutes } from "./routes";

const MainLayout1 = loadable(() => import('./pages/MainLayout'));

import "bootstrap/dist/css/bootstrap.min.css";
import loadable from "@loadable/component";

function App() {
  return (
    <Switch>
      {commonRoutes.map((r) => (
        <Route
          key={r.name}
          path={r.path}
          exact={r.exact}
          component={r.component}
        />
      ))}
      <Route path="/:tenantId?" component={MainLayout1} />
    </Switch>
  );
}

export default App;
