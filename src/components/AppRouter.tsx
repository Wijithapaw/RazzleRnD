import React from "react";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import { isServer } from "../utils/common.utils";

interface Props {
  children: any;
  basename?: string;
}

const AppRouter = ({ children, basename }: Props) => {
  return isServer ? (
    <StaticRouter basename={basename}>{children}</StaticRouter>
  ) : (
    <BrowserRouter basename={basename}>{children}</BrowserRouter>
  );
};

export default AppRouter;
