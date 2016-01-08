var proxyquire = require('proxyquire');

var requestStub = require('./stubs/request-stub');
var chanAPI = proxyquire('../modules/4chanAPI', {'request': requestStub});

describe('4Chan API', function(){
  describe('downloadJSONForBoard', function() {
    describe('given a board name', function() {
      it('downloads a json for an example board', function(done){
        chanAPI.downloadJSONForBoard('/b', function(err, body){
          expect(err).toBe(null);
          expect(body).not.toBe(null);
          done();
        });
      });
    });
  });
});
