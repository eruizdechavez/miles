'use strict';

var domready = require('domready'),
  angular = require('angular');

require('./miles/miles');

domready(function () {
  angular
    .module('app', [
      'ui.bootstrap',
      'ui.router',
      'miles'
    ]);

  angular.bootstrap(document, ['app']);
});
