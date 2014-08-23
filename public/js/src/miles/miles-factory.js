'use strict';

module.exports = ['Restangular', function(Restangular) {
  return {
    get: function(username, repo) {
      return Restangular.one('badges').one(username).one(repo).get();
    }
  };
}];
