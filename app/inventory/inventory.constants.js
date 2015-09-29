/* global angular */
"use strict";

var InventoryModule = angular.module('InventoryModule');

InventoryModule.constant('Constants', {
  ENV_DEVELOPMENT: 'development',
  ENV_STAGE: 'stage',
  ENV_PRODUCTION: 'production'
});
