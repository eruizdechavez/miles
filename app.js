'use strict';

var express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
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
    basePath: config.basePath,
    badgePath: config.badgePath
  };
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

app.use(config.badgePath, require('./modules/badge/router'));

app.start = function (done) {
    app.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
        done();
    });
};

app.stop = function (done) {
    done();
};


module.exports = app;
