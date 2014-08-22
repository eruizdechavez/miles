'use strict';

var fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  _ = require('lodash'),
  config, overrideConfig, filePath, yamlFile, overrideFile;

module.exports = (function () {
  if (config) {
    return config;
  }

  filePath = path.dirname(require.main.filename);

  yamlFile = path.join(filePath, 'config', 'config.yml');
  try {
    config = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
  } catch (err) {
    config = null;
  }

  overrideFile = path.join(filePath, 'config', process.env.NODE_ENV + '.yml');
  try {
    overrideConfig = yaml.safeLoad(fs.readFileSync(overrideFile, 'utf8'));
  } catch (err) {
    overrideConfig = null;
  }

  if (overrideConfig) {
    _.merge(config, overrideConfig);
  }

  return config;
}());
