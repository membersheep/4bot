var config = require('../config');
var chanService = require('./4ChanService');
var telegramService = require('./telegramAPI');
var winston = require('winston');

var bot = {};

// MESSAGES

bot.readMessage = function(message) {
  message.text = bot.normalizeMessage(message);
  if (bot.isMessageNew(message)) {
    if (bot.isMessageCommand(message)) {
      bot.executeCommand(message);
    } else {
      if (message.text) {
        var response = message.text + ' is not a command. Read /help to learn how to use this bot.';
        telegramService.postMessage(config.TOKEN, message.chat.id, response, function(err, res, body) {
          if (err) {
            return winston.error(err);
          }
        });
      }
    }
  }
};

bot.executeCommand = function(message) {
  if(config.BOARD_COMMANDS.indexOf(message.text) >= 0) {
    bot.executeBoardCommand(message);
  } else if(config.GENERIC_COMMANDS.indexOf(message.text) >= 0) {
    bot.executeGenericCommand(message);
  }
};

bot.executeBoardCommand = function (message) {
  chanService.getRandomImage(message.text, function(err, localPath){
    if (err) {
      return winston.error(err);
    } else {
      var extension = localPath.split('.').pop();
      if (extension == 'png' || extension == 'jpg') {
        telegramService.postImage(config.TOKEN, localPath, message.chat.id, function(err, res, body) {
          if (err) {
            return winston.error(err);
          } else {
            return winston.info('image posted by %j from', message);
          }
        });
      } else {
        telegramService.postDocument(config.TOKEN, localPath, message.chat.id, function(err, res, body) {
          if (err) {
            return winston.error(err);
          } else {
            return winston.info('document posted by %j from', message);
          }
        });
      }
    }
  });
};

bot.executeGenericCommand = function (message) {
  if (message.text == "/start") {
    telegramService.postMessage(config.TOKEN, message.chat.id, config.START_MESSAGE,function(err, res, body) {
      if (err) {
        return winston.error(err);
      } else {
        return winston.info('start message posted by %j', message.from);
      }
    });
  } else if (message.text == "/help") {
    telegramService.postMessage(config.TOKEN, message.chat.id, config.HELP_MESSAGE, function(err, res, body) {
      if (err) {
        return winston.error(err);
      } else {
        return winston.info('help message posted by %j', message.from);
      }
    });
  }
};

bot.isMessageCommand = function(message) {
  if (!message.hasOwnProperty('text')) {
    return false;
  }
  return config.COMMANDS.indexOf(message.text) >= 0;
};

bot.normalizeMessage = function(message) {
  if (!message.hasOwnProperty('text')) {
    return false;
  }
  return message.text.replace("@" + config.BOT_NAME, "");
};

bot.isMessageNew = function(message) {
  if (!message.hasOwnProperty('date')) {
    return false;
  }
  if (!Number.isInteger(message.date)) {
    return false;
  }
  var currentDate = Date.now();
  var ONE_MINUTE = 60 * 60 * 1000;
  return (currentDate/1000 - message.date) < ONE_MINUTE;
};

// INLINE QUERIES

bot.readQuery = function(inline_query) {
  if (bot.isQueryValid(inline_query)) {
    bot.executeQuery(inline_query);
  } else {
    winston.error('query ' + inline_query.query + ' is invalid.');
  }
};

bot.isQueryValid = function(inline_query) {
  if (!inline_query.hasOwnProperty('query')) {
    return false;
  }
  return config.VALID_QUERIES.indexOf(inline_query.query) >= 0;
};

bot.executeQuery = function (inline_query) {
  chanService.getRandomMediaURLsFromBoard(inline_query.query, config.QUERY_RESULT_COUNT, function(err, mediaURLs) {
    if (err) {
      return winston.error(err);
    } else {
      telegramService.answerQueryWithMedia(config.TOKEN, inline_query.id, mediaURLs, function(err, res, body) {
        if (err) {
          return winston.error(err);
        }
      });
    }
  });
};

module.exports = bot;
