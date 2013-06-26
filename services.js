var chars = require('./chars');
var fs = require('fs');

var index = null;
var dataShortKey = null;
var dataLongKey = null;

var init = function () {
    var obj = null;
    var dataFile = 'url_data.json';
    if(!fs.existsSync(dataFile)){
        obj = {
            index : -1,
            data  : {}
        };
    }else{
        var dataString = fs.readFileSync(dataFile, 'utf8');
        if(dataString.trim().length===0){
            obj = {
                index : -1,
                data  : {}
            };
        }else{
            obj = JSON.parse(dataString);
        }
    }
    index = obj.index;
    dataShortKey = obj.data;
    dataLongKey = invert(dataShortKey);
};

var persist = function () {
    var dataFile = 'url_data.json';
    var obj = {
        index:index,
        data:dataShortKey
    };
    var dataString = JSON.stringify(obj);
    fs.writeFile(dataFile, dataString, function(err){
        if(err) throw err;
    });
};

var load = function () {
    return {
        index: index,
        data: dataShortKey
    };
};

var shorten = function (longUrl) {
    var shortUrl = dataLongKey[longUrl];
    if (!shortUrl) {
        shortUrl = chars.getChars(++index);
        dataShortKey[shortUrl] = longUrl;
        dataLongKey[longUrl] = shortUrl;
        persist();
    }
    return shortUrl;
};

var find = function (shortUrl) {
    var longUrl = dataShortKey[shortUrl];
    if (!longUrl) {
        longUrl = '';
    }
    return longUrl;
}

var invert = function (o) {
    var ret = {};
    for (var i in o) {
        ret[o[i]] = i;
    }
    return ret;
}

exports.shorten = shorten;
exports.find = find;
exports.load = load;
exports.init = init;
exports.persist = persist;