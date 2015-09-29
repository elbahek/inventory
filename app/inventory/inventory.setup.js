/* global angular */
"use strict";

/**
 * I'm separating config phase from module declaration phase (in ./inventory.module.js)
 * because I'm generating configuration constants using gulp.
 * This setup phase will use some of constants (for example "environment").
 * So setup phase should proceed after the "generate constants" phase
 */
var InventoryModule = angular.module('InventoryModule');

/**
 * Routing
 */
InventoryModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/pages/main.html'
    })
    .when('/games', {
      templateUrl: '/views/pages/games.html'
    });
}]);
