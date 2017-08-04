var fs = require('fs'),
    path = require('path'),
    md = require('marked'),
    _ = require('lodash-node'),
    http = require('http'),
    mdDir = 'md',
    releaseDir = path.join(__dirname, 'public', 'release');

var apidocs = require('./lib/apidocs');

var prettyPrint = function (str) {
    var ret = str.charAt(0).toUpperCase() + str.slice(1),
        re = /-/g;

    return ret.replace(re, ' ');
}

var getBreadCrumbOptions = function () {
    var options = {
            breadcrumb: []
        },
        i;

    for (i = 0; i < arguments.length; i += 1) {
        if (arguments[i].isArray) {
            options.breadcrumb.push(arguments[i]);
        } else {
            options.breadcrumb.push([prettyPrint(arguments[i]), arguments[i]]);
        }
    }
    return options;
};

var readMdFile = function (req, res, mdDoc, jadePage, options) {
    var mdDocPath = path.join(__dirname, mdDir, (mdDoc + '.md'));
    jadePage = jadePage || 'page';
    options = options || {};

    fs.readFile(mdDocPath, 'utf8', function (err, mdFile) {
        if (err) {
            console.error(err);
            return res.render('404');
        }

        options.content = md(mdFile);
        fs.stat(mdDocPath, function (err, stats) {
            if (err) {
                console.error(err);
                return res.render('404');
            }
            if (stats && stats.mtime) {
                options.content += '<p>Last modified: ' + stats.mtime + '</p>';
            }
            options.breadcrumb = mdDoc.split('/').slice(1).map(
                function (c, i, a) {
                    if (a.length - 1 === i) {
                        return [prettyPrint(c), mdDoc];
                    } else if (i === 0) {
                        return [prettyPrint(c), '/' + c];
                    } else {
                        return [prettyPrint(c)];
                    }
                }
            );
            res.render(jadePage, options);
        });

    });
};

/**
 * Reads the contents of the `bundles` directory under documentation.
 *
 * @param  {Function} cb function to be executed with the files
 * @return {String[]} returns the file names with relative paths in relation
 *                            to the `md` directory.
 */
var readBundleDir = function (cb) {
    var execFile = require('child_process').execFile,
        bundleDir = path.join(__dirname, mdDir, 'documentation', 'bundles');

    execFile('find', [bundleDir], function (err, stdout, stderr) {
        var files = _.chain(stdout.split('\n'))
            .map(function (file) {
                var regex = /bundles\/(.*)\.md$/;
                return _.last(regex.exec(file));
            })
            .reject(function (file) {
                return file === undefined;
            })
            .value();

        cb(files);
    });
};

function getApiJson(funcName, req, res) {
    var version = req.param('version');
    if(version) {
        apidocs[funcName](version, function(json) {
            res.send(json);
        });
        return;
    }
    // return latest if we didn't get any param
    apidocs.getVersions(function(values) {
        values = values.sort(function(a, b) {
            return a.version < b.version;
        });
        var latestVersion = values[0];
        apidocs[funcName](latestVersion, function(json) {
            res.send(json);
        });
    });
}

function getApiPage(type, req, res) {
    var functionName = 'getBundles';
    if(type === 'requests') {
        functionName = 'getRequests';
    } else if(type === 'events') {
        functionName = 'getEvents';
    }
    var pageName = 'api_' + type;
    apidocs.getVersions(function(versions) {
        if(!versions.length) {
            // no docs generated!! TODO: handle as error
            res.render(pageName, { versions : [], api: [] });
            return;
        }
        versions = versions.sort(function(a, b) {
            return a < b;
        });
        var latestVersion = versions[0];
        // TODO: do this in parallel instead of seq
        apidocs[functionName](latestVersion, function(api) {
            apidocs.log(latestVersion, function(log) {
                res.render(pageName, {versions : versions, api : api.api, changelog : log });
            })
        });
    });
}

module.exports = {
    apiSelection : function (req, res) {
        res.render('api');
    },
    bundlesPage : function (req, res) {
        getApiPage('bundles', req, res);
    },
    requestsPage : function (req, res) {
        getApiPage('requests', req, res);
    },
    eventsPage : function (req, res) {
        getApiPage('events', req, res);
    },
    bundlesJSON : function (req, res) {
        getApiJson('getBundles', req, res);
    },
    requestsJSON : function (req, res) {
        getApiJson('getRequests', req, res);
    },
    eventsJSON : function (req, res) {
        getApiJson('getEvents', req, res);
    },
    apiDoc : function (ver, bundle, callback) {
        apidocs.doc(ver, bundle, callback);
    },
    about: function (req, res) {
        res.render('about', getBreadCrumbOptions('about oskari'));
    },
    bundles: function (req, res) {
        readBundleDir(function (files) {
            res.render('bundles', {
                breadcrumb: ['Bundles', 'bundles'],
                files: files
            });
        });
    },
    bundledoc: function (req, res) {
        readBundleDir(function (files) {
            readMdFile(req, res, req.path, 'bundles', {
                files: files
            });
        });
    },
    guides: function (req, res) {
        res.render('guides', getBreadCrumbOptions('guides'));
    },
    documentation: function (req, res) {
        res.render('documentation', getBreadCrumbOptions('documentation'));
    },
    examples: function (req, res) {
        res.render('examples', getBreadCrumbOptions('examples'));
    },
    challenge: function (req, res) {
        res.render('challenge', getBreadCrumbOptions('challenge'));
    },
    contributing: function (req, res) {
        res.render('contributing', getBreadCrumbOptions('contributing'));
    },
    search: function (req, res) {
        var q = req.param('q');
        if (!q) {
            res.render('search', {
                breadcrumb: ['Search', 'search'],
                result: []
            });
            return;
        }
        var options = {
            host: 'localhost',
            path: '/solr/collection1/select?wt=json&rows=200&q=' + encodeURIComponent(q),
            port: '8983'
        };

        var callback = function (response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                var rspse = JSON.parse(str);
                res.render('search', {
                    breadcrumb: ['Search', 'search'],
                    result: rspse.response.docs,
                    numFound: rspse.response.numFound
                });
            });
        };

        http.request(options, callback).end();

    },

    download: function (req, res) {
        res.render('download', getBreadCrumbOptions('download'));
        // files are not updated currently so removing files from render model
        // should get rid of the direct download part of the page
        // TODO: enable when we actually have something relevant to show here
        /*
        fs.readdir(releaseDir, function (err, files) {
            if (err) {
                console.log(err);
            }    
            res.render('download', {
                files: files
            });
        })
        */
    },
    md: function (req, res) {
        readMdFile(req, res, req.path);
    },
    root: function (req, res) {
        res.render('index');
    }
};
