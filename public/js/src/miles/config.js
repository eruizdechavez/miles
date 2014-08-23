'use strict';

module.exports = ['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        template: require('./home.html')
      })
      .state('about', {
        url: '/about',
        template: require('./about.html')
      });
  }
];
