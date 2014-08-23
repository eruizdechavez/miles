'use strict';

var alertify = require('alertify');

module.exports = ['$scope', 'miles.MilesFactory',
  function ($scope, MilesFactory) {

    $scope.get = function (username, repo) {
      $scope.loading = true;
      $scope.username = username;
      $scope.repo = repo;

      MilesFactory.get(username, repo).then(function (milestones) {
        $scope.loading = false;
        $scope.milestones = milestones;
      }, function (err) {
        $scope.loading = false;
        if (err.status === 500) {
          alertify.alert('Oops! Something is broken. Please try again later.');
        } else if (err.status === 404) {
          alertify.alert('Hmm.. looks like something is missing, please double check your username/repository and try again.');
        }
      });
    };

    $scope.reset = function () {
      $scope.username = '';
      $scope.repo = '';
      $scope.milestones = null;
      $scope.loading = false;
    };

    $scope.reset();
  }
];
