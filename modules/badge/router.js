'use strict';

var router = require('express').Router(),
  request = require('request'),
  util = require('util'),
  badge = require('./badge');

router.get('/:user/:repo', function (req, res) {
  request({
    url: util.format('https://api.github.com/repos/%s/%s/milestones?state=all', req.params.user, req.params.repo),
    json: true,
    headers: {
      'User-Agent': 'request'
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
  request({
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
