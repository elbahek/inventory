/* global angular */
'use strict';

var InventoryModule = angular.module('InventoryModule', [
  'ngRoute',
  'vAccordion'
]);

InventoryModule.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/pages/main.html'
    })
    .when('/games', {
      templateUrl: '/views/pages/games.html'
    });
});
