'use strict';

/**
 * Rename this file to local.js
 * Here you can override config variables specific to your environment
 */
module.exports = function(defaultConfig) {
  var localConfig = {};
  localConfig.server = {
    /**
     * Ip is different for every server
     */
    ip: '192.168.1.101',
    /**
     * Path to your ssl key and certificate
     * required
     */
    sslKeyFile: defaultConfig.server.siteDir + '/ssl/key.key',
    sslCertFile: defaultConfig.server.siteDir + '/ssl/key.crt'
  };

  return localConfig;
};
