var called = false;
var path = 'path';

exports.getRandomImage =  function(board, callback){
  called = true;
  callback(null, path);
};

exports.called = function() {
  return called;
};

exports.path = function() {
  return path;
};
