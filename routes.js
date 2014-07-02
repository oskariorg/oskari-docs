var fs = require('fs');
var path = require('path');
var md = require('marked');
var _ = require('lodash-node');
var http = require('http');

var mdDir = 'md';
var releaseDir = path.join(__dirname, 'public', 'release');

var readMdFile = function(req, res, mdDoc, jadePage, options) {
    var mdDocPath = path.join(__dirname, mdDir, (mdDoc + '.md'));
    jadePage = jadePage || 'page';
    options = options || {};

    fs.readFile(mdDocPath, 'utf8', function(err, mdFile) {
        if (err) {
            console.error(err);
            return res.render('404');
        }

        options.content = md(mdFile);
        res.render(jadePage, options);
    });
};

/**
 * Reads the contents of the `bundles` directory under documentation.
 * 
 * @param  {Function} cb function to be executed with the files
 * @return {String[]} returns the file names with relative paths in relation
 *                            to the `md` directory.
 */
var readBundleDir = function(cb) {
    var execFile = require('child_process').execFile;
    var bundleDir = path.join(__dirname, mdDir, 'documentation', 'bundles');

    execFile('find', [bundleDir], function(err, stdout, stderr) {
        var files = _.chain(stdout.split('\n'))
            .map(function(file) {
                var regex = /bundles\/(.*)\.md$/;
                return _.last(regex.exec(file));
            })
            .reject(function(file) {
                return file === undefined;
            })
            .value();

        cb(files);
    });
};

module.exports = {
    about: function (req, res) {
        res.render('about');
    },
    bundles: function (req, res) {
        readBundleDir(function(files) {
            res.render('bundles', {
                files: files
            });
        });
    },
    bundledoc: function(req, res) {
        readBundleDir(function(files) {
            readMdFile(req, res, req.path, 'bundles', {
                files: files
            });
        });
    },
    guides: function (req, res) {
        res.render('guides');
    },
    documentation: function (req, res) {
        res.render('documentation');
    },
    examples: function (req, res) {
        res.render('examples');
    },
    search: function (req, res) {
        var q = req.param('q');
        if(!q) {
            res.render('search', {
                result:[]});
            return;
        }
        var options = {
          host: 'localhost',
          path: '/solr/collection1/select?wt=json&rows=30&q=' + q, 
          port: '8983'
        };

        console.log(options.path);
        callback = function(response) {
          var str = '';

          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            var rspse=JSON.parse(str);
            res.render('search', {
                result:rspse.response.docs,
                numFound:rspse.response.numFound});
          });
        }

        http.request(options, callback).end();
            
    },

    download: function (req, res) {
        fs.readdir(releaseDir, function(err, files) {
            if (err) {
                console.log(err);
            }    
            res.render('download', {
                files: files
            });
        })
    },
    md: function (req, res) {
        readMdFile(req, res, req.path);
    },
    root: function (req, res) {
        res.render('index');
    }
};