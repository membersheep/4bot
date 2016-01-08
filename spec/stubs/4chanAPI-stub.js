var stubBody = require('../data/4ChanJSONRequest');

exports.downloadJSONForBoard =  function(board, callback){
  // TODO: Validate board name
  callback(null, stubBody);
};

exports.downloadMedia = function(name, board, localPath, callback) {
  // TODO: Validate image name, board name, local path
  var targetPath = localPath + "/" + name;

  return callback(null, targetPath);
};
