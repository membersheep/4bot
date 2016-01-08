var localPath = '';
var chatId = '';

exports.postImage =  function(token, imageLocalPath, cId) {
  localPath = imageLocalPath;
  chatId = cId;
};

exports.postDocument =  function(token, imageLocalPath, cId) {
  localPath = imageLocalPath;
  chatId = cId;
};

exports.localPath = function() {
  return localPath;
};

exports.chatId = function() {
  return chatId;
};
