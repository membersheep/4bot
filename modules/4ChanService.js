var chanAPI = require('./4ChanAPI');
var config = require('../config');
var NodeCache = require("node-cache");

var chanService = {};
var boardsCache = new NodeCache({stdTTL: 60});

chanService.getRandomImage = function(board, callback) {
  boardsCache.get(board, function(err, value) {
    if (err || value === undefined) {
      chanAPI.downloadJSONForBoard(board, function(err, body) {
        if (err) {
          return callback(err);
        } else {
          var posts = extractPosts(body);
          var post = posts.pop();
          var fileName = post.tim + post.ext;
          boardsCache.set(board, posts);
          if (fileName === undefined) {
            return callback(new Error("Impossible to extract a file name from JSON."));
          }
          chanAPI.downloadMedia(fileName, board, __dirname + "/../images", function(err, path){
            if (err) {
              return callback(err);
            } else {
              return callback(null, path);
            }
        	});
        }
    	});
    } else {
      if (value) {
        var post = value.pop();
        var fileName = post.tim + post.ext;
        boardsCache.set(board, value);
        if (fileName === undefined) {
          return callback(new Error("Impossible to extract a file name from JSON."));
        }
        chanAPI.downloadMedia(fileName, board, __dirname + "/../images", function(err, path){
          if (err) {
            return callback(err);
          } else {
            return callback(null, path);
          }
      	});
      }
    }
  });
};

chanService.getRandomMediaURLsFromBoard = function(boardName, count, callback) {
  var board = '/' + boardName;
  chanAPI.downloadJSONForBoard(board, function(err, body){
    if (err) {
      return callback(err);
    } else {
      var posts = extractPosts(body);
      if (posts.length > count) {
          posts = posts.slice(0, count);
      }
      var fileNames = posts.map(function(post){ return post.tim + post.ext; })
      var urls = fileNames.map(function(filename){
        return config.CHAN_IMAGE_BASE_URL + boardName + '/' + filename;
      });
      return callback(null, urls);
    }
	});
};

function extractPosts(body) {
  if (!body.hasOwnProperty('threads')) {
    return undefined;
  }
  if (Object.prototype.toString.call(body.threads) !== '[object Array]') {
    return undefined;
  }
  var validThreads = body.threads.filter(isValidThread);
  if (validThreads.length === 0) {
    return undefined;
  }
  var posts = [];
  var threadsCount = validThreads.length;
  for (var i = 0; i < threadsCount; i++) {
      var currentThread = validThreads[i];
      var validPosts = currentThread.posts.filter(isValidPost);
      posts = posts.concat(validPosts);
  }
  return posts;
}

function extractRandomFileNames(body, count) {
  var filenames = [];
  for (var i = 0; i < count; i++) {
    var filename = extractRandomFileName(body);
    if (filename === undefined) {
      return undefined;
    }
    if (filenames.indexOf(filename) < 0) {
      filenames.push(filename);
    }
  }
  return filenames;
}

function extractRandomFileName(body) {
  if (!body.hasOwnProperty('threads')) {
    return undefined;
  }
  if (Object.prototype.toString.call(body.threads) !== '[object Array]') {
    return undefined;
  }
  var validThreads = body.threads.filter(isValidThread);
  if (validThreads.length === 0) {
    return undefined;
  }
  var posts = [];
  var threadsCount = validThreads.length;
  for (var i = 0; i < threadsCount; i++) {
      var currentThread = validThreads[i];
      var validPosts = currentThread.posts.filter(isValidPost);
      posts = posts.concat(validPosts);
  }
  if (posts.length === 0) {
    return undefined;
  }
  var rnd = Math.random();
  rnd = rnd * posts.length;
  rnd = Math.floor(rnd);
  var randomPost = posts[rnd];
  var fileName = randomPost.tim;
  var fileExtension = randomPost.ext;
  return fileName + fileExtension;
}

function isValidThread(element, index, array) {
  if (element.hasOwnProperty('posts')) {
    if (Object.prototype.toString.call( element.posts ) === '[object Array]') {
      if (element.posts[0].hasOwnProperty('tim') && element.posts[0].hasOwnProperty('ext')) {
        return true;
      }
    }
  }
  return false;
}

function isValidPost(element, index, array) {
  return element.hasOwnProperty('tim') && element.hasOwnProperty('ext');
}

module.exports = chanService;
