var express = require('express');
var router = express.Router();

var http = require('http');
var request = require('request');
var fs = require('fs');

// var fs = require('graceful-fs');

var uuid = require('node-uuid');
var zlib = require('zlib');
var tar = require('tar');
var webshot = require('webshot');
var fstream = require('fstream');
var targz = require('tar.gz');

var path = require('path');
var url = require('url');

var mime = require('mime');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/l2i', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    var uid = uuid.v4();

    if (!fs.existsSync('public/images/' + uid)) {
        fs.mkdirSync('public/images/' + uid, 0777, function(err) {
            if (err) {
                console.log(err);
                response.send("ERROR! Can't make the directory! \n"); // echo the result back
            }
        });
    }

    var options = {
        screenSize: {
            width: 1920,
            height: 1080
        },
        windowSize: {
            width: 1920,
            height: 1080
        },
        shotSize: {
            width: 1920,
            height: 'all'
        },
        userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
        quality: 100,
        streamType: 'png',
        siteType: 'url',
        renderDelay: 0,
        timeout: 0,
        defaultWhiteBackground: true
    }

    var links = req.body.links;
    links = JSON.parse(links);
    console.log(links);

    //
    if(!links) {
        var result = {
            'error': 'true',
            'message': 'missing links parameter.'
        };
        res.send(result);
        return false;
    }

    // links.forEach(function(element, index, array) {
    //     console.log(url.parse(element).hostname);
    //     webshot(element, 'public/images/' + uid + '/' + url.parse(element).hostname + '.png', options, function(err) {
    //         console.log('screenshot taken!');
    //     });
    // });

    async.eachSeries(links, function (element, callback) {
        if(!url.parse(element).hostname) return;
        console.log(url.parse(element).hostname);
        webshot(element, 'public/images/' + uid + '/' + url.parse(element).hostname + '.jpeg', options, function(err) {
            console.log('screenshot taken!');
            callback(); // Alternatively: callback(new Error());
        });
    }, function (err) {
        if (err) { throw err; }

        console.log('Well done :-)!');

        var compress = new targz().compress('public/images/' + uid, 'public/tar/' + uid + '.tar.gz', function(err) {
            if (err)
                console.log(err);

            var file = {
                'file': uid
            };

            res.send(file);


            console.log('The compression has ended!');

            return;
            
        });
    });
});

router.get('/download', function(req, res, next) {
    //
    if(!req.query.file) {
        var result = {
            'error': 'true',
            'message': 'missing file parameter.'
        };
        res.send(result);
        return false;
    }

    var file = 'public/tar/' + req.query.file + '.tar.gz';

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);


    res.setHeader('Content-disposition', 'attachment; filename=' + req.query.file + '.tar.gz');
    res.setHeader('Content-type', 'application/x-gzip');

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
    console.log('tar file was sent to be downloaded!');

});

module.exports = router;