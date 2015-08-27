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

  config.server = {
    environment: environment,
    port: 443,
    sslKeyFile: null,
    sslCertFile: null,
    siteDir: siteDir,
    log: {
      path: siteDir + '/logs/server.log',
      size: 200000,
      maxFiles: 8
    }
  };

  config.app = {
    environment: environment
  };

  try {
    var localConfig = require('./local')(config);
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
