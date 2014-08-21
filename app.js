'use strict';

var express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals = {
    host: 'localhost:3000',
    basePath: ''
  };
  next();
});

app.use('/', function (req, res) {
  res.render('index');
});

module.exports = app;
