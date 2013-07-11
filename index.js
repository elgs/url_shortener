var express = require('express');
var http = require('http');
var app = express();
var services = require('./services');

app.set('port', process.env.PORT || 10309);
app.use(express.bodyParser());
app.use(app.router);

services.init();
process.on('exit', function () {
    var obj = services.persist();
});

app.use('/', express.static('views'));

app.get('/_shorten', function (req, res) {
    var longUrl = req.query.url;
    var shortUrlPrefix = req.protocol + "://" + req.get('host');

    if (longUrl.indexOf('.') < 0) {
        res.json({
            longUrl: longUrl,
            error: 'This does not appear to be a valid url.'
        });
        return;
    }
    if (longUrl.trim().indexOf('http') != 0) {
        longUrl = 'http://' + longUrl;
    }
    var shortUrl = services.shorten(longUrl, shortUrlPrefix);
    if (!shortUrl) {
        res.json({
            longUrl: longUrl,
            error: 'Hacking!!!'
        });
        return;
    }
    res.json({
        shortUrl: shortUrl,
        longUrl: longUrl
    });
});

app.get('/_all', function (req, res) {
    res.json(services.all());
});

app.all('/:shortUrl', function (req, res) {
    var shortUrl = req.params.shortUrl;
    var shortUrlPrefix = req.protocol + "://" + req.get('host');

    if (shortUrl.trim().length === 0) {
        res.end();
        return;
    }
    var longUrl = services.find(shortUrl);
    if (longUrl === shortUrlPrefix + '/' + shortUrl) {
        res.redirect(301, shortUrlPrefix);
        return;
    }
    if (longUrl) {
        res.redirect(301, longUrl);
    } else {
        res.end();
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});