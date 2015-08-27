'use strict';

/**
 * Rename this file to local.js
 * Here you can override config variables specific to your environment
 */
module.exports = function(defaultConfig) {
  var localConfig = {};
  localConfig.server = {
    /**
     * Path to your ssl key and certificate
     * required
     */
    sslKeyFile: defaultConfig.server.siteDir + '/ssl/key.key',
    sslCertFile: defaultConfig.server.siteDir + '/ssl/key.crt'
  };

  return localConfig;
};
