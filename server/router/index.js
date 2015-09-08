'use strict';

var express = require('express'),
  path = require('path');

module.exports.init = function(app, serverConfig) {
  app.engine('html', require('ejs').renderFile);

  app.use('/', express.static(path.join(serverConfig.distDir)));
};
