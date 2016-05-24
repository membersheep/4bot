var bot = require('../modules/bot.js');
var logger = require('../modules/logger');

module.exports = function(req, res) {
  if (!req.hasOwnProperty('body')) {
    logger.error('request body is missing.');
    return res.send();
  }
  var body = req.body;

  if (body.hasOwnProperty('message')) {
    bot.readMessage(body.message);
  } else if (body.hasOwnProperty('inline_query')) {
    bot.readQuery(body.inline_query);
  }
  res.send();
};
