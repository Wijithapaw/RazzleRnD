import App, { sampleData } from "./App";
import React from "react";
import { StaticRouter, matchPath } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import routes, { commonRoutes } from "./routes";
import { setInitialData, getInitialDataKey } from "./utils/ssr-helper.utils";
import { cities } from "./components/CityPicker";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const routes2 = routes.map((r) => {
  const x = { ...r, originalPath: r.path };
  x.path = `/:tenantCode${x.path}`;
  return x;
});

//console.log('routes', routes2);

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

export const renderApp = (req, res, data, match) => {
  // if (!match) {
  //   console.log("no match found - server redirection");
  //   return { context: { url: "/lon" } };
  // } else {
  //   console.log("match found", match);
  //   const tenantCode = match.match.params.tenantCode;
  //   const isValidTenant = cities.some(
  //     (c) => c.code.toLowerCase() === tenantCode.toLowerCase()
  //   );

  //   if (!isValidTenant) {
  //     var path = match.match.url;
  //     const defaultTenantId = cities[0].code.toLowerCase();
  //     return { context: { url: `/${defaultTenantId}${path}` } };
  //   }
  // }

  setInitialData(data);
  const initialDataKey = getInitialDataKey(match?.route.originalPath || "");

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
      ${cssLinksFromAssets(assets, "client")}
  </head>
  <body>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(assets, "client", "defer", "crossorigin")}  
      <script>window.${initialDataKey}=${JSON.stringify(data)}</script>    
  </body>
</html>`;
  console.log("context", context);
  return { context, html };
};

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", (req, res) => {

    const isCommonRoute = commonRoutes.map(route => matchPath(req.url, route)).some(m => !!m);

    if(isCommonRoute){
      const { context, html } = renderApp(req, res);
        if (context.url) {
          res.redirect(context.url);
        } else {
          //console.log('html', html);
          res.status(200).send(html);
          return;
        }
    }

    const matches = routes2.map((route, index) => {
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

    console.log("#########################################################");
    console.log("match", match);

    if (!match) {
      console.log("no match found - server redirection");
      res.redirect("/lon");
    } else {
      console.log("match found", match);
      const tenantCode = match.match.params.tenantCode;
      const isValidTenant = cities.some(
        (c) => c.code.toLowerCase() === tenantCode.toLowerCase()
      );
  
      if (!isValidTenant) {
        var path = match.match.url;
        const defaultTenantId = cities[0].code.toLowerCase();
        res.redirect(`/${defaultTenantId}${path}`);
      }
    }

    // if (!match) {
    //   console.log("no match found - server redirection");
    //   res.redirect("/lon/pricing");
    // } else {
    Promise.all(promises)
      .then((data) => {
        //console.log("server promise: ", data, match);
        console.log(new Date());

        const { context, html } = renderApp(req, res, data[0], match);
        if (context.url) {
          console.log("redirect", context.url);
          res.redirect(context.url);
        } else {
          //console.log('html', html);
          res.status(200).send(html);
        }
      })
      .catch((error) => {
        console.log("Error in server rendering", error);
        res.status(500).json({ error: error.message, stack: error.stack });
      });
    //}
  });

export default server;
