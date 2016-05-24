var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'info.log',
      level: 'info'
    })
  ]
});

module.exports = logger;
