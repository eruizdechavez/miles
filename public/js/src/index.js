'use strict';

var domready = require('domready'),
  angular = require('angular');

require('./angularify/angularify');

domready(function () {
  angular
    .module('app', [
      'ui.bootstrap',
      'ui.router',
      'angularify'
    ]);

  angular.bootstrap(document, ['app']);
});
