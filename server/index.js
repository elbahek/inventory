'use strict';

// Get config values
var serverConfig = require('../config')('server');

// Setup logging
var winston = require('winston');
switch (serverConfig.environment) {
  case ENV_DEVELOPMENT:
    winston.default.transports.console.colorize = true;
    break;
  case ENV_STAGE:
  case ENV_PRODUCTION:
    winston.add(winston.transports.File, {
      maxsize: serverConfig.log.size,
      filename: serverConfig.log.path,
      maxFiles: serverConfig.log.maxFiles,
      tailable: true,
      handleExceptions: true
    });
    winston.remove(winston.transports.Console);
    break;
}

// Setup express
var fs = require('fs'),
  https = require('https'),
  express = require('express'),
  app = express();

try {
  var credentials = {
    key: fs.readFileSync(serverConfig.sslKeyFile),
    cert: fs.readFileSync(serverConfig.sslCertFile)
  };
}
catch (e) {
  if (e.code === 'ENOENT') {
    winston.error('SSL cert or key not found');
  }
}

// Routing
//var router = require('./router').init(app, config);
app.get('/', function(req, res) {
  res.send('hello');
});

// Start server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(serverConfig.port);
winston.info('Started server at localhost:%d', serverConfig.port);
