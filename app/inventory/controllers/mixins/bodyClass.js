/* globals angular */
"use strict";

function bodyClassMixin(bodyClassValue) {
  if (!angular.isString(bodyClassValue)) {
    bodyClassValue = '';
  }

  return {
    bodyClassValue: bodyClassValue
  };
}
