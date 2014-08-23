'use strict';

var express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  request = require('request'),
  util = require('util'),
  app = express(),
  config = require('./modules/config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals = {
    host: config.host,
    basePath: config.basePath
  };
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

function badgeUrl(milestone) {

  var name = milestone.title,
    openIssues = milestone.open_issues,
    closedIssues = milestone.closed_issues,
    complete = '?',
    totalIssues = openIssues + closedIssues,
    color;

  if (!totalIssues) {
    color = 'blue';
  } else if (closedIssues / totalIssues === 1) {
    color = 'brightgreen';
  } else if (closedIssues / totalIssues > 0.8) {
    color = 'green';
  } else if (closedIssues / totalIssues > 0.6) {
    color = 'yellowgreen';
  } else if (closedIssues / totalIssues > 0.4) {
    color = 'yellow';
  } else if (closedIssues / totalIssues > 0.2) {
    color = 'orange';
  } else {
    color = 'red';
  }

  if (totalIssues) {
    complete = Math.floor(closedIssues / totalIssues * 100) + '%';
  }

  return util.format('http://img.shields.io/badge/%s-%s-%s.svg', name, encodeURIComponent(complete), color);
}

app.get('/badge/:user/:repo', function (req, res) {
  request({
    url: util.format('https://api.github.com/repos/%s/%s/milestones?state=all', req.params.user, req.params.repo),
    json: true,
    headers: {
      'User-Agent': 'request'
    }
  }, function (err, response, milestones) {

    if (err) {
      return res.send(500);
    } else if (response.statusCode === 404) {
      return res.send(404);
    }

    var data = milestones.map(function (milestone) {
      return {
        number: milestone.number,
        title: milestone.title,
        badge: badgeUrl(milestone),
        url: util.format('/badge/%s/%s/%s', req.params.user, req.params.repo, milestone.number)
      };
    });

    data = data.sort(function (a, b) {
      return a.number > b.number ? 1 : -1;
    });
    res.render('milestones', {
      milestones: data
    });
  });
});

app.get('/badge/:user/:repo/:milestone', function (req, res) {
  request({
    url: util.format('https://api.github.com/repos/%s/%s/milestones/%s', req.params.user, req.params.repo, req.params.milestone),
    json: true,
    headers: {
      'User-Agent': 'request'
    }
  }, function (err, response, milestone) {
    var url = '';

    if (err) {
      url = 'http://img.shields.io/badge/error-500-red.svg';
    } else if (response.statusCode === 404) {
      url = 'http://img.shields.io/badge/error-404-red.svg';
    } else {
      url = badgeUrl(milestone);
    }

    return request({
      url: url
    }).pipe(res);
  });
});

module.exports = app;
