#!/usr/bin/env node

var frish = require('./frish');
var port = process.argv[0] || 3008;
frish(process.argv[0], function() {
  console.log('Frish is listening on port ' + port);
});
