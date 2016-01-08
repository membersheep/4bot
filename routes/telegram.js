var bot = require('../modules/bot.js');

module.exports = function(req, res) {
  if (!req.hasOwnProperty('body')) {
    console.log('ERROR: body is missing form request.');
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
