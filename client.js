(function() {
  var srcScript = document.querySelector('script[data-frish]');
  var hostname = window.location.hostname;
  var port = 3008;
  var host = hostname + ':' + port;
  var reloaderUrl = '//' + host;
  var ioSrc = '//' + host + '/socket.io/socket.io.js';
  var timeoutIncrease = 1.4;
  var timeout = 300;

  if (typeof define == "function" && define.amd) {
    define([ioSrc], function() {
      return listenOnReload;
    });
  } else {
    loadScript(ioSrc, listenOnReload);
  }


  /**
   * Reloads the page.
   *
   * If the server does not respond, we try again later.
   */
  function reload() {
    timeout *= timeoutIncrease;

    testConnection = new XMLHttpRequest();
    testConnection.open('HEAD', window.location, false);
    try {
      testConnection.send();
    } catch (error) {
      return setTimeout(reload, timeout);
    }
    window.location.reload();
  }


  /**
   * Connects to reloader and listens for the reload event.
   */
  function listenOnReload() {
    io
    .connect(reloaderUrl)
    .on('reload', reload);
  }


  /**
   * Loads the script from url and run callback when it's loaded.
   */
  function loadScript(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = url;

    callback = once(callback);
    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
  }


  /**
   * Returns a function that executes `func` only once
   */
  function once(func) {
    var ran = false;

    return function() {
      if (ran) return;
      func.apply(null, arguments);
      ran = true;
    };
  }
})();
