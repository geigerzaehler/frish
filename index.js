var connect = require('connect');
var http = require('http');
var socket = require('socket.io');
var debounce = require('debounce');

module.exports = makeReloader;

function makeReloader() {

  var sockets = [];

  function onconnect(socket) {
    sockets.push(socket);
    socket.on('disconnet', function() {
      var index = sockets.indexOf(socket);
      sockets.splice(index, 1);
    });
  }

  function sendReload() {
    console.log('Sending reload');
    sockets.forEach(function(socket) {
      socket.emit('reload');
    });
  }

  function listen(port) {
    if (port == null)
      port = 3008;

    var app = connect();
    var server = http.createServer(app);

    app.use(connect.static(__dirname + '/client', {index: 'index.js'}));
    server.listen(port, function(){
      console.log('Reloader started on localhost:' + server.address().port);
    });

    var io = socket.listen(server, {'log level': 1});
    io.sockets.on('connection', onconnect);

    return sendReload;
  }

  sendReload.debounced = debounce(sendReload, 1200);
  sendReload.listen = listen;
  return sendReload;
}
