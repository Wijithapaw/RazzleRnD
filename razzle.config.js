// razzle.config.js
'use strict';
const LoadablePlugin = require('@loadable/webpack-plugin')
const path = require('path');

module.exports = {
  plugins: ['scss'],
  options: {
    buildType: 'serverless'
  },
  modifyPaths({
    paths,
  }) {
    paths.prodAppServerIndexJs = path.join(paths.appSrc, 'index.prod');
    return paths;
  },
  modifyWebpackConfig({
    env: {
      target,
      dev,
    },
    webpackConfig,
    paths,
  }) {

    if (target === 'web') {
      webpackConfig.plugins.push(
        new LoadablePlugin({ filename: 'loadable-stats.json', writeToDisk: true })
      )
    }

    if (target === 'node') {
      if (!dev) {
        webpackConfig.entry.server = [paths.prodAppServerIndexJs];
      }
    }
    return webpackConfig;
  },
};