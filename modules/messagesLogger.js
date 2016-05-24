var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'messages-file',
      filename: 'messages.log',
      level: 'info',
      json: false
    })
  ]
});

module.exports = logger;
