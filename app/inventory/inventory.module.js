/* global angular */
'use strict';

var inventoryModule = angular.module('inventoryModule', [
  'ngRoute',
  'vAccordion'
]);

inventoryModule.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/pages/main.html'
    })
    .when('/games', {
      templateUrl: '/views/pages/games.html'
    });
});
