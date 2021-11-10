import App from "./App";
import React from "react";
import { StaticRouter, matchPath } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import routes, { commonRoutes } from "./routes";
import { setInitialData, getInitialDataKey } from "./utils/ssr-helper.utils";
import { cookieStorageService } from "./services/cookie-storage.service";
import cookiesMiddleware from "universal-cookie-express";
import { accountService } from "./services/account.service";
import { ChunkExtractor } from '@loadable/server'
import path from 'path'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const public_bucket_domain = process.env.PUBLIC_BUCKET_DOMAIN || "";
const public_bucket_url = public_bucket_domain
  ? `https://${public_bucket_domain}`
  : "";

let statsFile
let extractor

if (process.env.NODE_ENV === 'production') {
  console.log('reading statsfile for PROD');
  statsFile = path.resolve('./build/public/loadable-stats.json');
  console.log('statsFile', statsFile);
  extractor = new ChunkExtractor({ statsFile, entrypoints: ['client'] });
}

const routes2 = routes.map((r) => {
  const x = { ...r, originalPath: r.path };
  x.path = `/:tenantCode${x.path}`;
  return x;
});

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

export const renderApp = (req, res, data, pathname) => {
  setInitialData(data);
  const initialDataKey = getInitialDataKey(pathname || "");

  const context = {};
  const app = (
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );

  if (process.env.NODE_ENV === 'development') {
    console.log('reading statsfile for DEV');
    statsFile = path.resolve('./build/public/loadable-stats.json')
    console.log('statsFile', statsFile);
    extractor = new ChunkExtractor({ statsFile, entrypoints: ['client'] })
  }

  const jsx = extractor.collectChunks(app)
  const markup = renderToString(jsx)
  const scriptTags = extractor.getScriptTags()
  console.log('scriptTags', scriptTags);

  const html = `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${cssLinksFromAssets(assets, "client")}
      ${
        process.env.NODE_ENV === 'production'
          ? `<script src="${public_bucket_url}${assets.client.js}" defer></script>`
          : `<script src="${public_bucket_url}${assets.client.js}" defer crossorigin></script>`
        }
      ${scriptTags}
  </head>
  <body>
      <div id="root">${markup}</div>
      <script>window.${initialDataKey}=${JSON.stringify(data)}</script>    
  </body>
</html>`;

  return { context, html };
};

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(cookiesMiddleware())
  .get("/*", async (req, res) => {
    cookieStorageService.setServerCookies(req.universalCookies);

    const isCommonRoute = commonRoutes
      .map((route) => matchPath(req.path, route))
      .some((m) => !!m);

    if (isCommonRoute) {
      const { context, html } = renderApp(req, res);
      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(html);
        return;
      }
    }

    const userId = cookieStorageService.getItem("USER_ID") || undefined;

    var tenants = await accountService.getRelatedTenants(userId);
    cookieStorageService.setItem("ALL_TENANTS", JSON.stringify(tenants));

    const tenantRouteMatch = matchPath(req.path, { path: "/:tenantCode" });

    if (
      !tenantRouteMatch ||
      !tenants.some(
        (t) =>
          t.code.toLowerCase() ===
          tenantRouteMatch.params.tenantCode.toLowerCase()
      )
    ) {
      let defaultTenant =
        cookieStorageService.getItem("TENANT") || tenants[0].code.toLowerCase(); //TODO: get default tenant based on location

      const path = tenantRouteMatch?.url || "";
      res.redirect(`/${defaultTenant.toLowerCase()}${path}`);
      return;
    }

    const tenantCode = tenantRouteMatch.params.tenantCode;
    cookieStorageService.setItem("TENANT", tenantCode.toUpperCase());

    const matcheObjs = routes2.map((route, index) => {
      const match = matchPath(req.path, route);
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

    const promises = matcheObjs
      .filter((m) => !!m)
      .map((mo) => (mo ? mo.promise : null));

    const matchObj = matcheObjs.filter((m) => !!m)[0];

    Promise.all(promises)
      .then((data) => {
        console.log(new Date()); //TODO: Remove this after testing

        const { context, html } = renderApp(
          req,
          res,
          data[0],
          matchObj?.route.originalPath
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
