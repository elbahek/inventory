'use strict';

module.exports = function(siteDir) {
  var bowerDir = siteDir + '/bower_components',
    inventoryModuleDir = siteDir + '/app/inventory';
  return {
    fonts: {
      thirdParty: [
        bowerDir + '/ionicons/fonts/*'
      ],
      app: []
    },
    styles: {
      thirdParty: [
        bowerDir + '/ionicons/css/ionicons.css'
      ],
      app: [
        inventoryModuleDir + '/assets/main.scss'
      ]
    },
    scripts: {
      thirdParty: [
        bowerDir + '/angular/angular.js',
        bowerDir + '/angular-route/angular-route.js'
      ],
      app: [
        inventoryModuleDir + '/inventory.module.js'
      ]
    }
  };
};
