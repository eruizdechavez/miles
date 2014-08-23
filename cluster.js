// Original code at http://blog.evantahler.com/blog/production-deployment-with-node-js-clusters.html

'use strict';

var cluster = require('cluster'),
  numCPUs = require('os').cpus().length,
  numWorkers = numCPUs - 2;

if (numWorkers < 2) {
  numWorkers = 2;
}

console.log('STARTING CLUSTER');

var workerRestartArray = [],
  workersExpected = 0;

var startAWorker = function () {
  var worker = cluster.fork();
  console.log('starting worker #' + worker.id);
  worker.on('message', function (message) {
    if (worker.state !== 'none') {
      console.log('Message [' + worker.process.pid + ']: ' + message);
    }
  });
  worker.send('start');
};

var loopUntilNoWorkers = function () {
  if (cluster.workers.length > 0) {
    console.log('there are still ' + cluster.workers.length + ' workers...');
    setTimeout(loopUntilNoWorkers, 1000);
  } else {
    console.log('all workers gone');
    process.exit();
  }
};

var setupShutdown = function () {
  console.log('Cluster manager quitting');
  console.log('Stopping each worker...');

  for (var i in cluster.workers) {
    if (cluster.workers.hasOwnProperty(i)) {
      cluster.workers[i].send('stop');
    }
  }


  setTimeout(loopUntilNoWorkers, 1000);
};

var reloadAWorker = function () {
  var count = cluster.workers.length;

  if (workersExpected > count) {
    startAWorker();
  }

  if (workerRestartArray.length > 0) {
    var worker = workerRestartArray.pop();
    worker.send('stop');
  }
};

cluster.setupMaster({
  exec: __dirname + '/index.js'
});

for (var i = 0; i < numWorkers; i++) {
  workersExpected++;
  startAWorker();
}

cluster.on('fork', function (worker) {
  console.log('worker ' + worker.process.pid + ' (#' + worker.id + ') has spawned');
});

cluster.on('exit', function (worker) {
  console.log('worker ' + worker.process.pid + ' (#' + worker.id + ') has exited');

  // to prevent CPU-splsions if crashing too fast
  setTimeout(reloadAWorker, 1000);
});

process.on('SIGINT', function () {
  console.log('Signal: SIGINT');
  workersExpected = 0;
  setupShutdown();
});

process.on('SIGTERM', function () {
  console.log('Signal: SIGTERM');
  workersExpected = 0;
  setupShutdown();
});

process.on('SIGUSR2', function () {
  console.log('Signal: SIGUSR2');
  console.log('swap out new workers one-by-one');
  workerRestartArray = [];
  for (var i in cluster.workers) {
    if (cluster.workers.hasOwnProperty(i)) {
      workerRestartArray.push(cluster.workers[i]);
    }
  }
  reloadAWorker();
});

process.on('SIGWINCH', function () {
  console.log('Signal: SIGWINCH');
  console.log('stop all workers');
  workersExpected = 0;
  for (var i in cluster.workers) {
    if (cluster.workers.hasOwnProperty(i)) {
      var worker = cluster.workers[i];
      worker.send('stop');
    }
  }
});

process.on('SIGTTIN', function () {
  console.log('Signal: SIGTTIN');
  console.log('add a worker');
  workersExpected++;
  startAWorker();
});

process.on('SIGTTOU', function () {
  console.log('Signal: SIGTTOU');
  console.log('remove a worker');
  workersExpected--;

  for (var i in cluster.workers) {
    if (cluster.workers.hasOwnProperty(i)) {
      var worker = cluster.workers[i];
      worker.send('stop');
      break;
    }
  }
});

process.on('exit', function () {
  workersExpected = 0;
  console.log('Bye!');
});
