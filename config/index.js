/* global ENV_DEVELOPMENT, ENV_STAGE, ENV_PRODUCTION */
'use strict';

var path = require('path'),
  _ = require('lodash');

require('./globals');

module.exports = function(section) {
  var environment = process.env.NODE_ENV;
  if ([ENV_DEVELOPMENT, ENV_STAGE, ENV_PRODUCTION].indexOf(environment) === -1) {
    console.log('Invalid or null NODE_ENV supplied');
    environment = ENV_PRODUCTION;
  }

  var sections = ['server', 'app'];
  if (sections.indexOf(section) === -1) {
    console.log('Invalid section supplied, to config');
    return {};
  }

  var config = {};
  var siteDir = path.normalize(__dirname + '/..');
  var appDir = siteDir + '/app';
  var assets = require('./assets')(siteDir);

  config.server = {
    environment: environment,
    ip: null,
    port: 443,
    sslKeyFile: null,
    sslCertFile: null,
    siteDir: siteDir,
    distDir: siteDir + '/dist',
    serverDir: siteDir + '/server',
    configDir: siteDir + '/config',
    publicDir: siteDir + '/public',
    buildDir: siteDir + '/build',
    appDir: appDir,
    inventoryModuleDir: appDir + '/inventory',
    log: {
      path: siteDir + '/logs/server.log',
      size: 200000,
      maxFiles: 8
    },
    assets: assets
  };

  config.app = {
    ENVIRONMENT: environment
  };

  var localConfig = {};
  try {
    localConfig = require('./local')(config);
  }
  catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.log('You should add local config (local.js). See local.example.js');
    }
    else {
      console.log(e);
    }
    return {};
  }
  config = _.merge(config, localConfig);

  return config[section];
};
