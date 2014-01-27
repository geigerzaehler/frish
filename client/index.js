var hostname = 'localhost';
var port = 3008;
var host = 'localhost:' + port;

function listenToReload() {

  var socket = io.connect('http://' + host);

  socket.on('reload', reload)

  socket.on('disconnect', function () {
    socket.on('connect', function() {
      setTimeout(reload, 400)
    })
  });

  function reload() {
    window.location.reload();
  }
}


(function loadSocket(callback) {

  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');

  script.type = 'text/javascript';
  script.src =  'http://' + host + '/socket.io/socket.io.js';

  script.onreadystatechange = callback;
  script.onload = callback;

  head.appendChild(script);

})(listenToReload);
