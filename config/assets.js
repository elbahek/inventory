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
        bowerDir + '/node-uuid/uuid.js',
        bowerDir + '/moment/moment.js',
        bowerDir + '/angular/angular.js',
        bowerDir + '/angular-route/angular-route.js',
        bowerDir + '/angular-animate/angular-animate.js',
        bowerDir + '/v-accordion/dist/v-accordion.js'
      ],
      app: [
        inventoryModuleDir + '/inventory.module.js',
        inventoryModuleDir + '/controllers/mixins/bodyClass.js',
        inventoryModuleDir + '/controllers/games.js'
      ]
    }
  };
};
