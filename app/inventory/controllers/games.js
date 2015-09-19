/* globals uuid, moment, angular, bodyClassMixin */
"use strict";

var inventoryModule = angular.module('inventoryModule');

inventoryModule.controller('gamesController', ['$scope', function($scope) {
  angular.extend($scope, bodyClassMixin('page-games'));

  $scope.games = [
    {
      uuid: uuid.v4(), name: 'Test game 1', isLocal: true, isOngoing: false, isActive: false,
      lastPlayed: 1442152314388, lastPlayedDate: (new Date(1442152314388)),
      lastPlayedDateHuman: moment(new Date(1442152314388)).fromNow()
    },
    {
      uuid: uuid.v4(), name: 'Test game 2', isLocal: true, isOngoing: false, isActive: false,
      lastPlayed: 1438858664297, lastPlayedDate: (new Date(1438858664297)),
      lastPlayedDateHuman: moment(new Date(1438858664297)).fromNow()
    },
    {
      uuid: uuid.v4(), name: 'Test game 3', isLocal: true, isOngoing: false, isActive: false,
      lastPlayed: 1441368211141, lastPlayedDate: (new Date(1441368211141)),
      lastPlayedDateHuman: moment(new Date(1441368211141)).fromNow()
    },
    {
      uuid: uuid.v4(), name: 'Test game 4', isLocal: true, isOngoing: true, isActive: true,
      lastPlayed: 1438776340994, lastPlayedDate: (new Date(1438776340994)),
      lastPlayedDateHuman: moment(new Date(1438776340994)).fromNow()
    },
    {
      uuid: uuid.v4(), name: 'Test game 5', isLocal: true, isOngoing: false, isActive: false,
      lastPlayed: 1441489646627, lastPlayedDate: (new Date(1441489646627)),
      lastPlayedDateHuman: moment(new Date(1441489646627)).fromNow()
    }
  ];
}]);
