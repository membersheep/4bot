var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'info.log', level: 'info' });
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'info' });

var statusHandler = require('./routes/status');
var logHandler = require('./routes/log');
var telegramHandler = require('./routes/telegram');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/status', statusHandler);
app.post('/telegramBot', telegramHandler);
app.use(express.static());

var server = app.listen(config.SERVER_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  winston.info('server listening at http://%s:%s', host, port);
});
