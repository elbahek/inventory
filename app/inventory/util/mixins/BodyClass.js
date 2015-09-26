/* globals angular */
"use strict";

var InventoryModule = angular.module('InventoryModule');

InventoryModule.factory('BodyClassMixin', [function() {
  return function(bodyClassValue) {
    if (!angular.isString(bodyClassValue)) {
      bodyClassValue = '';
    }

    return {
      bodyClassValue: bodyClassValue
    };
  };
}]);
