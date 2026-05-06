// this ensures node understands the future
require('babel-register');

var startTime = Date.now();
var timeoutHandler;
// this is where server starts booting up
var app = require('./server');
console.log('waiting for db to connect');


var onConnect = function() {
  console.log('db connected in %s ms', Date.now() - startTime);
  if (timeoutHandler) {
    clearTimeout(timeoutHandler);
  }

  // Run autoupdate (safe schema migration — adds missing tables/columns,
  // never drops existing data). Works for both PostgreSQL and MongoDB.
  var ds = app.dataSources.db;
  if (ds && typeof ds.autoupdate === 'function') {
    ds.autoupdate(function(err) {
      if (err) {
        console.error('autoupdate failed (non-fatal):', err.message);
      } else {
        console.log('db schema up to date');
      }
      app.start();
    });
  } else {
    app.start();
  }
};

var timeoutHandler = setTimeout(function() {
  var message =
    'db did not after  ' +
    (Date.now() - startTime) +
    ' ms connect crashing hard';

  console.log(message);
  // purposely shutdown server
  // pm2 should restart this in production
  throw new Error(message);
}, 15000);

app.dataSources.db.on('connected', onConnect);
