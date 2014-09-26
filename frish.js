var connect = require('connect');
var http = require('http');
var socket = require('socket.io');
var debounce = require('debounce');
var fs = require('fs');

/**
 * Create the reload server on a given port.
 *
 * @example
 *    var frish = require('frish');
 *    reloader = frish();
 *    reloader.reload()
 *    reloader.close()
 */
module.exports = function reloader(port, listening) {
  if (typeof port == 'function')
    listening = port;

  if (port === undefined)
    port = 3008;

  var server;
  var sockets = [];

  server = http.createServer();
  server.on('request', handleRequest);

  var io = socket.listen(server, {'log level': 1});
  io.sockets.on('connection', registerSocket);

  server.listen(port, listening);

  return {
    reload: sendReload,
    close: close
  };

  function registerSocket(socket) {
    sockets.push(socket);
    socket.on('disconnet', function() {
      var index = sockets.indexOf(socket);
      sockets.splice(index, 1);
    });
  }

  function sendReload() {
    sockets.forEach(function(socket) {
      socket.emit('reload');
    });
  }

  function handleRequest(req, res) {
    if (req.method == 'GET' && req.url == '/reloader.js') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/javascript');
      fs.createReadStream(__dirname + '/client.js').pipe(res);
    } else if (req.method == 'POST' && req.url == '/reload') {
      sendReload();
      res.statusCode = 200;
      res.end();
    } else {
      res.statusCode = 404;
      res.end();
    }
  }

  function close(callback) {
    sockets.forEach(function(socket) {
      socket.disconnect();
    });
    server.close(callback);
  }

};
