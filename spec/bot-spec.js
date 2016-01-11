var proxyquire = require('proxyquire');
var chanStub = require('./stubs/4chan-stub');
var telegramStub = require('./stubs/telegram-stub');

var bot = proxyquire('../modules/bot', {
  './4ChanService': chanStub,
  './telegramAPI': telegramStub
});

var telegramMessage = require('./data/telegramRequest').message;
var telegramStartMessage = require('./data/telegramStartMessage').message;
var telegramQuery = require('./data/telegramInlineQuery').inline_query;

describe('Bot: when it reads a message', function(){
  describe('that is a board name', function(){
    it('gets a random image and posts it to the same chat', function() {
      bot.readMessage(telegramMessage);

      expect(chanStub.called()).toBe(true);
      expect(telegramStub.chatId()).toEqual(telegramMessage.chat.id);
      expect(telegramStub.localPath()).toEqual(chanStub.path());
    });
  });
  describe('that is a generic command name', function(){
    it('posts a message to the same chat', function() {
      bot.readMessage(telegramStartMessage);

      expect(telegramStub.chatId()).toEqual(telegramStartMessage.chat.id);
    });
  });
});

describe('Bot: when it reads a query', function(){
  describe('that is valid', function(){
    it('executes the query.', function() {
      // TODO
    });
  });
  describe('that is invalid', function(){
    it('does not crash.', function() {
      bot.readQuery({});
    });
  });
});

describe('Bot: when executes a query', function(){
  it('gets a random media URL and answers the query with it', function() {
    // TODO
    });
});
