var config = require('../config');
var request = require('request');
var async = require('async');
var fs = require('fs');

var requestOptions = {
	json: true,
	headers: {
		'if-modified-since': (new Date()).toUTCString()
	}
};
var chanInterface = {};

chanInterface.downloadJSONForBoard = function(board, callback) {
  var baseRequestUrl = config.CHAN_BASE_URL + board + "/";
  var indices = [0,1,2,3,4,5];
  var urls = indices.map(function(index) { return baseRequestUrl+index+".json"; });
  async.map(urls, fetch, function(err, results){
    if (err){
       callback(err);
    } else {
        var threads = results.reduce(function(accumulator, currentValue, currentIndex, array) {
            return accumulator.concat(currentValue.threads);
        }, []);
        return {'threads': threads}
    }
  });
};

function fetch(url, cb) {
    request(file, requestOptions, function(err, response, body) {
        if (err) {
            cb(err);
        } else if (response.statusCode == 200) {
            cb(null, body);
        } else {
            return callback(new Error("Unable to download JSON. Code " + res.statusCode));
        }
    });
}

chanInterface.downloadMedia = function(name, board, localPath, callback) {
  var requestUrl = config.CHAN_IMAGE_BASE_URL + board + "/" + name;
  var targetPath = localPath + "/" + name;
	ensureExists(localPath, 0744, function(err){
		if(err) {
			return callback(err);
		} else {
			request.head(requestUrl, function(err, res, body){
		    if(err) {
		      return callback(err);
		    } else {
		      var r = request(requestUrl).pipe(fs.createWriteStream(targetPath)).on('close', function(){
						callback(null, targetPath);
					}).on('error', function(err) {
						return callback(err);
					});
		    }
		  });
		}
	});
};

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') {
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
					if (err.code == 'EEXIST') {
						cb(null);
					} else {
						cb(err);
					}
        } else {
					cb(null);
				}
    });
}

module.exports = chanInterface;
