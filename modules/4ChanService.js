var chanAPI = require('./4ChanAPI');
var config = require('../config');
var NodeCache = require("node-cache");

var chanService = {};
var boardsCache = new NodeCache({stdTTL: 120});

chanService.getRandomImage = function(board, callback) {
  boardsCache.get(board, function(err, value) {
    if (err || value === undefined) {
      chanAPI.downloadJSONForBoard(board, function(err, body) {
        if (err) {
          return callback(err);
        } else {
          boardsCache.set(board, body);
          var randomFileName = extractRandomFileName(body);
          if (board == "/f") {
            randomFileName = extractRandomFlashFileName(body);
          }
          if (randomFileName === undefined) {
            return callback(new Error("Impossible to extract a file name from JSON."));
          }
          chanAPI.downloadMedia(randomFileName, board, __dirname + "/../images", function(err, path){
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
        var randomFileName = extractRandomFileName(value);
        if (board == "/f") {
          randomFileName = extractRandomFlashFileName(value);
        }
        if (randomFileName === undefined) {
          return callback(new Error("Impossible to extract a file name from JSON."));
        }
        chanAPI.downloadMedia(randomFileName, board, __dirname + "/../images", function(err, path){
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
      var randomFileNames = extractRandomFileNames(body, count);
      if (randomFileNames === undefined) {
        return callback(new Error("Impossible to extract a file name from JSON."));
      }
      var randomURLs = randomFileNames.map(function(filename){
        return config.CHAN_IMAGE_BASE_URL + boardName + '/' + filename;
      });
      return callback(null, randomURLs);
    }
	});
};

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
  console.log(body.threads.length);
  var validThreads = body.threads.filter(isValidThread);console.log(validThreads.length);
  
  if (validThreads.length === 0) {
    return undefined;
  }

    var rnd1 = Math.random();console.log(rnd1);
    rnd1 = rnd1 * validPosts.length;console.log(rnd1);
    rnd1 = Math.floor(rnd1);console.log(rnd1);    
  var threadIndex = Math.floor(rnd1);console.log(threadIndex);
  var randomThread = validThreads[threadIndex];
  var validPosts = randomThread.posts.filter(isValidPost);
    var rnd = Math.random();console.log(rnd);
    rnd = rnd * validPosts.length;console.log(rnd);
    rnd = Math.floor(rnd);console.log(rnd);
  var randomPost = validPosts[rnd];
  var fileName = randomPost.tim;console.log(fileName);
  var fileExtension = randomPost.ext;
  return fileName + fileExtension;
}

function extractRandomFlashFileName(body) {
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

  var randomThread = validThreads[Math.floor(Math.random() * validThreads.length)];
  var validPosts = randomThread.posts.filter(isValidPost);
  var randomPost = validPosts[Math.floor(Math.random()*validPosts.length)];
  var fileName = randomPost.filename;
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
