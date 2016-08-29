var config = require('../config');
var chanService = require('./4ChanService');
var telegramService = require('./telegramAPI');
var logger = require('./logger');
var messagesLogger = require('./messagesLogger');
var NodeCache = require("node-cache");

var messageLimiter = new NodeCache({stdTTL: config.TIME_LIMIT});
var bot = {};

// MESSAGES

bot.readMessage = function(message) {
  messagesLogger.info(message.from.first_name +' '+ message.from.username +' '+ message.from.last_name + ': ' + message.text);
  message.text = bot.normalizeMessage(message);
  if (bot.isMessageNew(message)) {
    if (bot.isMessageCommand(message)) {
      if (bot.isValidCommand(message)) {
        if (!bot.isUserSpamming(message)) {
          bot.executeCommand(message);
        } else {
          telegramService.postMessage(config.TOKEN, message.chat.id, 'Wait ' + config.TIME_LIMIT + ' seconds before posting another command.', function(err, res, body) {
            if (err) {
              return logger.error(err);
            }
          });
        }
      } else {
        if (message.text) {
          var response = message.text + ' is not a command. Read /help to learn how to use this bot.';
          telegramService.postMessage(config.TOKEN, message.chat.id, response, function(err, res, body) {
            if (err) {
              return logger.error(err);
            }
          });
        }
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
      telegramService.postMessage(config.TOKEN, message.chat.id, "There was an error (4chan API timed out), maybe you're making too much requests...", function(err, res, body) {});
      return logger.error(err);
    } else {
      var extension = localPath.split('.').pop();
      if (extension == 'png' || extension == 'jpg') {
        telegramService.postImage(config.TOKEN, localPath, message.chat.id, function(err, res, body) {
          if (err) {
            telegramService.postMessage(config.TOKEN, message.chat.id, "There was an error (Telegram API timed out), try again in a few seconds...", function(err, res, body) {});
            return logger.error(err);
          } else {
            return logger.info('image posted by from', message);
          }
        });
      } else {
        telegramService.postDocument(config.TOKEN, localPath, message.chat.id, function(err, res, body) {
          if (err) {
            telegramService.postMessage(config.TOKEN, message.chat.id, "There was an error (Telegram API timed out), try again in a few seconds...", function(err, res, body) {});
            return logger.error(err);
          } else {
            return logger.info('document posted by from', message);
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
        return logger.error(err);
      } else {
        return logger.info('start message posted by ', message.from);
      }
    });
  } else if (message.text == "/help") {
    telegramService.postMessage(config.TOKEN, message.chat.id, config.HELP_MESSAGE, function(err, res, body) {
      if (err) {
        return logger.error(err);
      } else {
        return logger.info('help message posted by ', message.from);
      }
    });
  }
};

bot.isMessageCommand = function(message) {
  if (!message.hasOwnProperty('text')) {
    return false;
  }
  return message.text.indexOf("/") === 0;
};

bot.isValidCommand = function(message) {
  if (!message.hasOwnProperty('text')) {
    return false;
  }
  if (message.text === '/random') {
    message.text = config.COMMANDS[Math.floor(Math.random() * config.COMMANDS.length)];
  }
  return config.COMMANDS.indexOf(message.text) >= 0;
};

bot.normalizeMessage = function(message) {
  if (!message.hasOwnProperty('text')) {
    return '';
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

bot.isUserSpamming = function(message) {
  logger.info('spamming?');
  if (!message.hasOwnProperty('from')) {
    return false;
  }
  var user = message.from;
  if (!user.hasOwnProperty('id')) {
    return false;
  }
  var id = user.id;
  logger.info('id is '+id);
  var value = messageLimiter.get(id);
  if (value === undefined) {
    logger.info('not found in cache');
    messageLimiter.set(id, {});
    return false;
  }
  logger.info('found in cache');
  return true;
};

// INLINE QUERIES

bot.readQuery = function(inline_query) {
  if (bot.isQueryValid(inline_query)) {
    bot.executeQuery(inline_query);
  } else {
    logger.error('query ' + inline_query.query + ' is invalid.');
  }
};

bot.isQueryValid = function(inline_query) {
  if (!inline_query.hasOwnProperty('query')) {
    return false;
  }
  return config.VALID_QUERIES.indexOf(inline_query.query) >= 0;
};

bot.executeQuery = function(inline_query) {
  chanService.getRandomMediaURLsFromBoard(inline_query.query, config.QUERY_RESULT_COUNT, function(err, mediaURLs) {
    if (err) {
      return logger.error(err);
    } else {
      telegramService.answerQueryWithMedia(config.TOKEN, inline_query.id, mediaURLs, function(err, res, body) {
        if (err) {
          return logger.error(err);
        }
      });
    }
  });
};

module.exports = bot;
