var fs = require('fs');
var path = require('path');
var md = require('marked');
var _ = require('lodash-node');

md.setOptions({
    langPrefix: 'language-',
    highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

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
 *                            to the `bundles` directory.
 */
var readBundleDir = function(cb) {
    var execFile = require('child_process').execFile;
    var bundleDir = path.join(__dirname, mdDir, 'documentation', 'bundles');

    execFile('find', [bundleDir], function(err, stdout, stderr) {
        var files = _.chain(stdout.split('\n'))
            .map(function(file) {
                var baseName = file.split('bundles/')[1];
                if (baseName) {
                    var mdDoc = baseName.split('.md');
                    if (mdDoc.length === 2) {
                        return mdDoc[0];
                    }
                }
                return '';
            })
            .filter(function(file) {
                return file !== '';
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
        var bundleDoc = req.path.split('/documentation')[1];
        bundleDoc = path.join('documentation' + bundleDoc);

        readBundleDir(function(files) {
            readMdFile(req, res, bundleDoc, 'bundles', {
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