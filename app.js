var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var statusHandler = require('./routes/status');

var telegramHandler = require('./routes/telegram');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/status', statusHandler);
app.post('/telegramBot', telegramHandler);

var server = app.listen(config.SERVER_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('server listening at http://%s:%s', host, port);
});
