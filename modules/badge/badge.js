'use strict';

var util = require('util');

module.exports = function (milestone) {

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

  return util.format('https://img.shields.io/badge/%s-%s-%s.svg', name, encodeURIComponent(complete), color);
};
