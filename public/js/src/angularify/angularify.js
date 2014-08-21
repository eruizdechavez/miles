'use strict';

var angular = require('angular');

angular
  .module('angularify', [])
  .config(require('./config'))
  .directive('navBar', function () {
    return {
      restrict: 'E',
      template: require('./nav-bar.html')
    };
  });
