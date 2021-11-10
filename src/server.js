import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { matchPath, StaticRouter } from "react-router-dom";
import App from "./App";
import routes from "./routes";
import { getInitialDataKey, setInitialData } from "./utils/ssr-helper.utils";
const path = require("path");

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const public_bucket_domain = process.env.PUBLIC_BUCKET_DOMAIN || "";
const public_bucket_url = public_bucket_domain
  ? `https://${public_bucket_domain}`
  : "";

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map(
            (asset) =>
              `<link rel="stylesheet" href="${public_bucket_url}${asset}">`
          )
          .join("")
      : ""
    : "";
};
const jsScriptTagsFromAssets = (assets, entrypoint, extra = "") => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map(
            (asset) =>
              `<script src="${public_bucket_url}${asset}"${extra}></script>`
          )
          .join("")
      : ""
    : "";
};

export const renderApp = (req, res, data, path) => {
  setInitialData(data);
  const initialDataKey = getInitialDataKey(path);

  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );

  const html = `<!doctype html>
  <html lang="">
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${
        assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ""
      }
      ${
        process.env.NODE_ENV === "production"
          ? `<script src="${assets.client.js}" defer></script>`
          : `<script src="${assets.client.js}" defer crossorigin></script>`
      }
    </head>
    <body>
      <div id="root">${markup}</div>
    </body>
  </html>`;
  return { context, html };
};

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", (req, res) => {
    console.log("In Server");

    const matches = routes.map((route, index) => {
      const match = matchPath(req.url, route);

      if (match) {
        const obj = {
          route,
          match,
          promise: route.initialData
            ? route.initialData()
            : Promise.resolve(null),
        };
        return obj;
      }
      return null;
    });

    const promises = matches
      .filter((m) => !!m)
      .map((match) => (match ? match.promise : null));

    const match = matches.filter((m) => !!m)[0];

    Promise.all(promises)
      .then((data) => {
        const { context, html } = renderApp(
          req,
          res,
          data[0],
          match.route.path
        );
        if (context.url) {
          res.redirect(context.url);
        } else {
          res.status(200).send(html);
        }
      })
      .catch((error) => {
        console.log("Error in server rendering", error);
        res.status(500).json({ error: error.message, stack: error.stack });
      });
  });

export default server;
