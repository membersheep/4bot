var lastRequest = {};

module.exports =  function(request, options, callback) {
  lastRequest = request;
  callback(null, {statusCode: 200}, {requestedURL: request});
};

module.exports.post =  function(request, callback) {
  lastRequest = request;
  callback(null, {statusCode: 200}, {requestedURL: request});
};

module.exports.head =  function(request, callback) {
  lastRequest = request;
  callback(null, {statusCode: 200}, {requestedURL: request});
};

module.exports.lastRequest =  function() {
  return lastRequest;
};
