'use strict';

var router = require('express').Router(),
  request = require('request'),
  util = require('util'),
  ok = require('okay'),
  badge = require('./badge'),
  redis = require('../redis'),
  config = require('../config');


function get(options, callback) {
  redis.get(util.format('etag:%s', options.url), ok(callback, function (etag) {
    if (etag) {
      options.headers = options.headers || {};
      options.headers['if-none-match'] = etag;
    }

    options.qs = {
      client_id: config.clientId,
      client_secret: config.clientSecret
    };

    request(options, ok(callback, function (result, data) {
      if (result.statusCode === 304) {
        redis.get(util.format('data:%s', options.url), ok(function (data) {
          try {
            callback(null, result, JSON.parse(data));
          } catch (err) {
            callback(err);
          }
        }));

        return;
      }

      redis.set(util.format('etag:%s', options.url), result.headers.etag);
      redis.set(util.format('data:%s', options.url), JSON.stringify(data));

      callback(null, result, data);
    }));
  }));
}

router.get('/:user/:repo', function (req, res) {
  var url = util.format('https://api.github.com/repos/%s/%s/milestones', req.params.user, req.params.repo);

  get({
    url: url,
    json: true,
    headers: {
      'User-Agent': 'miles/1.0.0'
    }
  }, function (err, response, milestones) {


    if (err || !Array.isArray(milestones)) {
      return res.send(500);
    } else if (response.statusCode === 404) {
      return res.send(404);
    }

    var data = milestones.map(function (milestone) {
      return {
        number: milestone.number,
        title: milestone.title,
        badge: badge(milestone),
        url: util.format('%s%s/%s/%s/%s', res.locals.basePath, res.locals.badgePath, req.params.user, req.params.repo, milestone.number)
      };
    });

    data = data.sort(function (a, b) {
      return a.number > b.number ? 1 : -1;
    });
    res.json(data);
  });
});

router.get('/:user/:repo/:milestone', function (req, res) {
  get({
    url: util.format('https://api.github.com/repos/%s/%s/milestones/%s', req.params.user, req.params.repo, req.params.milestone),
    json: true,
    headers: {
      'User-Agent': 'miles/1.0.0'
    }
  }, function (err, response, milestone) {
    var url = '';

    if (err) {
      url = 'http://img.shields.io/badge/error-500-red.svg';
    } else if (response.statusCode === 404) {
      url = 'http://img.shields.io/badge/error-404-red.svg';
    } else {
      url = badge(milestone);
    }

    return request({
      url: url
    }).pipe(res);
  });
});


module.exports = router;
