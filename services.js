var chars = require('./chars');
var fs = require('fs');

var index = null;
var dataShortKey = null;
var dataLongKey = null;

var dataFile = 'url_data.json';
var tmpFile = 'url_data.tmp';

var init = function () {
    var obj = load();
    index = obj.index;
    dataShortKey = obj.data;
    persist();
    dataLongKey = invert(dataShortKey);
};

var load = function () {
    if (fs.existsSync(dataFile)) {
        var dataString = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(dataString);
    } else {
        return {
            index: -1,
            data: {}
        };
    }
};

var find = function (shortUrl) {
    var longUrl = dataShortKey[shortUrl];
    if (!longUrl) {
        longUrl = '';
    }
    return longUrl;
}

var all = function () {
    return {
        index: index,
        data: dataShortKey
    };
};

var persist = function () {
    var obj = all();
    var tmpFileExists = fs.existsSync(tmpFile);
    if (tmpFileExists) {
        var tmpData = fs.readFileSync(tmpFile, 'utf8').trim();
        var lines = tmpData.split('\n');
        var shortUrl = null;
        for (var i in lines) {
            var line = lines[i];
            var _position = line.indexOf('_');
            shortUrl = line.substring(0, _position);
            var longUrl = line.substring(_position + 1);
            obj.data[shortUrl] = longUrl;
        }
        if (shortUrl) {
            obj.index = chars.getIndex(shortUrl);
        }
        index = obj.index;
        dataShortKey = obj.data;
    }
    var dataString = JSON.stringify(obj);
    fs.writeFileSync(dataFile, dataString);
    if (tmpFileExists) {
        fs.unlink(tmpFile, function (err) {
            if (err) throw err;
        });
    }
};

// apend to the end of a file
var save_tmp = function (shortUrl, longUrl) {
    var tmpData = shortUrl + '_' + longUrl + '\n';
    fs.appendFile(tmpFile, tmpData, function (err) {
        if (err) throw err;
    });
};

var shorten = function (longUrl, shortUrlPrefix) {
    var shortUrl = dataLongKey[longUrl];
    if (!shortUrl) {
        shortUrl = chars.getChars(++index);
        if (shortUrlPrefix + '/' + shortUrl === longUrl) {
            --index;
            return null;
        }
        dataShortKey[shortUrl] = longUrl;
        dataLongKey[longUrl] = shortUrl;
        save_tmp(shortUrl, longUrl);
    }
    return shortUrl;
};

var invert = function (o) {
    var ret = {};
    for (var i in o) {
        ret[o[i]] = i;
    }
    return ret;
}

exports.all = all;
exports.shorten = shorten;
exports.find = find;
exports.load = load;
exports.init = init;
exports.persist = persist;