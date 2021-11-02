import React from "react";
import { BrowserRouter, StaticRouter, useLocation } from "react-router-dom";
import { isServer } from "../utils/common.utils";

interface Props {
  children: any;
  basename?: string;
}

const AppRouter = ({ children, basename }: Props) => {
  const location = useLocation();
  
  return isServer ? (
    <StaticRouter
      basename={basename}
      location={`${location.pathname}${location.search}`}
    >
      {children}
    </StaticRouter>
  ) : (
    <BrowserRouter basename={basename}>{children}</BrowserRouter>
  );
};

export default AppRouter;
