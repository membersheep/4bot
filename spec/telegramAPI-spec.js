var proxyquire = require('proxyquire');

var requestStub = require('./stubs/request-stub');
var telegramAPI = proxyquire('../modules/telegramAPI', {'request': requestStub});

describe('Telegram API', function(){
  describe('setupWebhook', function(){
    it('sets up webhook', function(){
      telegramAPI.setupWebhook('token', 'url', function(err){
        expect(err).toBe(null);
      });
    });
  });
  describe('postImage', function(){
    it('sends a sendPhoto request to telegram', function(done){
      telegramAPI.postImage('token', __dirname + '/data/test.gif', 1, function(err) {
        expect(err).toBe(null);
        done();
      });
      // TODO: Add tests for request conformity
    });

    it('tries to send a photo and throws an error if file is missing', function(done) {
      telegramAPI.postImage('token', 'wrongpath', 1, function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });
  });
});
