Frish
=====

Frish is a small tool that let’s you trigger page reloads in browsers.
It helps you to quickly display code changes in your browser.

To get, started install *frish* with npm and fire up the server.

```
npm install frish
node_modules/.bin/frish
```

Then add the following script tag to your html file.
```html
<script src="http://localhost:3008/reloader.js" data-frish></script>
```

Open the html file in your browser, change something and run
```
curl -X POST localhost:3008/reload
```

The browser will reload the current page and display the changes you
made.

If you want to integrate *frish* into your build system to trigger
reloads when files have changed or a built has finished you can use
the library in Node.


CLI Refernece
-------------

```
frish [PORT]
```

Start the *frish* server at the given port. If omitted, the port
defaults to '3008'.


API Reference
-------------

The 'frish' module exports a server contructor.

```js
var frish = require('frish');
var reloader = frish(port, callback);
```

The `port` and `callback` arguments are optional. The default port is
'3008'.

The reloader has two functions, both of which are bound to the reloader
so you can easily pass them as callbacks.

```js
reloader.reload();
```

This will send a message to all connected browsers and trigger a page
reload.

```js
reloader.close(callback);
```

This shuts down the server.
