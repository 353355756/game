var app = require('./server');
var port = process.env.PORT || 3000;

var cluster = require('cluster');
var os = require('os');
var workers = {};
var numCpus = os.cpus().length;


if (cluster.isMaster) {

  console.log('Master process is started on port ' + port);
	
  cluster.on('death', function (worker) {
    delete workers[worker.process.pid];
    worker = cluster.fork();
    workers[worker.process.pid] = worker;
  });

  for (var i=0; i<numCpus; i++) {
    var worker = cluster.fork();
    console.log('Worker process: ' + worker.process.pid + ' is started.');
    workers[worker.process.pid] = worker;
  }
} else {
  app.listen(port);
}

process.on('SIGTERM', function () {
  for (var pid in workers) {
    process.kill(pid);
  }
  process.exit(0);
});

process.on('unCaughtException', function (err) {
  console.error(err.stack);
});
