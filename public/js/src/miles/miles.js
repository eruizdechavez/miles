'use strict';

var angular = require('angular');

angular
  .module('miles', ['restangular'])
  .config(require('./config'))
  .factory('miles.MilesFactory', require('./miles-factory'))
  .controller('miles.MilesController', require('./miles-controller'))
  .directive('navBar', function () {
    return {
      restrict: 'E',
      template: require('./nav-bar.html')
    };
  });
