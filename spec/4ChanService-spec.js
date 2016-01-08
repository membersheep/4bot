var proxyquire = require('proxyquire');

var chanAPIStub = require('./stubs/4ChanAPI-stub');
var chanService = proxyquire('../modules/4chanService', {'./4ChanAPI': chanAPIStub});

describe('4Chan Service', function(){
  describe('getRandomImage', function() {
    describe('given a board name', function() {
      it('requests a json for that board', function(done){
        chanService.getRandomImage('/b', function(err, path){
          expect(err).toBe(null);
          expect(path).not.toBe(null);
          done();
        });
      });
    });
  });
  describe('getRandomMediaURLsFromBoard', function() {
    describe('given a board name', function() {
      it('requests a json for that board', function(done){
        chanService.getRandomMediaURLsFromBoard('b', 1, function(err, path){
          expect(err).toBe(null);
          expect(path).not.toBe(null);
          done();
        });
      });
    });
  });
});
