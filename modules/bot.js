var config = require('../config');
var chanService = require('./4ChanService');
var telegramService = require('./telegramAPI');

var bot = {};

// MESSAGES

bot.readMessage = function(message) {
  message.text = bot.normalizeMessage(message);
  if (bot.isMessageNew(message)) {
    if (bot.isMessageCommand(message)) {
      bot.executeCommand(message);
    } else {
      var response = message.text + ' is not a command. Read /help to learn how to use it.';
      telegramService.postMessage(config.TOKEN, message.chat.id, response, function(err, res, body) {
        if (err) {
          return console.log(err);
        } else {
          return console.log('start message posted!');
        }
      });
    }
  } else {
    console.log('message ' + message.text + ' is old, dropped.');
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
      return console.log(err);
    } else {
      var extension = localPath.split('.').pop();
      if (extension == 'png' || extension == 'jpg') {
        telegramService.postImage(config.TOKEN, localPath, message.chat.id, function(err, res, body) {
          if (err) {
            return console.log(err);
          } else {
            return console.log('image posted!');
          }
        });
      } else {
        telegramService.postDocument(config.TOKEN, localPath, message.chat.id, function(err, res, body) {
          if (err) {
            return console.log(err);
          } else {
            return console.log('document posted!');
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
        return console.log(err);
      } else {
        return console.log('start message posted!');
      }
    });
  } else if (message.text == "/help") {
    telegramService.postMessage(config.TOKEN, message.chat.id, config.HELP_MESSAGE, function(err, res, body) {
      if (err) {
        return console.log(err);
      } else {
        return console.log('help message posted!');
      }
    });
  }
  return console.log('command ' + message.text);
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
  console.log('reading query...');
  if (bot.isQueryValid(inline_query)) {
    bot.executeQuery(inline_query);
  } else {
    console.log('query ' + inline_query.query + ' is invalid.');
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
      return console.log(err);
    } else {
      telegramService.answerQueryWithMedia(config.TOKEN, inline_query.id, mediaURLs, function(err, res, body) {
        if (err) {
          return console.log(err);
        } else {
          return console.log('query ' + inline_query.id + ' answered.');
        }
      });
    }
  });
};

module.exports = bot;
