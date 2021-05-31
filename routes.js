var fs = require('fs'),
    path = require('path'),
    md = require('marked');

var apidocs = require('./lib/apidocs');

const prettyPrint = function (str) {
    const ret = str.charAt(0).toUpperCase() + str.slice(1);
    const dash = /-/g;
    const underscore = /_/g;

    // replace - and _ on names with spaces
    return ret.replace(dash, ' ').replace(underscore, ' ');
}

var getBreadCrumbOptions = function (...args) {
    var options = {
        breadcrumb: []
    };
    args.forEach(step => {
        if (step.isArray) {
            options.breadcrumb.push(step);
        } else {
            options.breadcrumb.push([prettyPrint(step), '/' + step]);
        }
    });
    return options;
};

const findFilePath = function (basePath, page, callback) {
    // try basePath + .md and basePath + /index.md
    if (page.endsWith(path.sep)) {
        page = page.substring(page.length -1);
    }
    const requestedPath = path.join(basePath, page);
    fs.stat(requestedPath + '.md', function(ignoredErr, mdStats) {
        // err is ok since we have a fallback coming up if this was not a direct hit
        // found direct md file
        if (mdStats && mdStats.isFile()) {
            callback(null, requestedPath + '.md', mdStats);
            return;
        }
        // check if the path was a dir that has index.md
        const indexFilePath = path.join(requestedPath, 'index.md');
        fs.stat(indexFilePath, function(ignoredErr, indexFileStats) {
            if (indexFileStats && indexFileStats.isFile()) {
                callback(null, indexFilePath, indexFileStats);
                return;
            }
            // Custom error thrower
            callback("Couldn't find file for " + requestedPath + ". Tried:\n - " + page + '.md\n - ' + page + '/index.md');
        });
    });
};

var readMdFileFromBaseDir = function (res, baseDir, mdDoc, jadePage = 'page', options = {}) {
    const requestedPath = path.join(__dirname, baseDir);
    findFilePath(requestedPath, mdDoc, function (err, pathToFile, stats) {
        if (err) {
            console.error(err);
            return res.render('404');
        }

        fs.readFile(pathToFile, 'utf8', function (err, mdFile) {
            if (err) {
                console.error(err);
                return res.render('404');
            }
            // md to html
            options.content = md(mdFile);
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
}

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
        var latestVersion = versions[0];
        // TODO: do this in parallel instead of seq
        apidocs[functionName](latestVersion, function(api) {
            apidocs.log(latestVersion, function(log) {
                if (type === 'requests' || type === 'events') {
                    sortApiBySections(api);
                }
                res.render(pageName, {versions : versions, api : api.api, changelog : log });
            })
        });
    });
}

function sortApiBySections(api) {
    var entries = api.api;
    var sorted = {};
    for (var i = 0; i < entries.length; i++) {
        if (!sorted[entries[i].ns]) {
            sorted[entries[i].ns] = [];
        }
        sorted[entries[i].ns].push(entries[i]);
    }
    api.api = sorted;
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
    gallery: function (req, res) {
        let page = req.path.substring('gallery'.length + 1);
        let filename = page + '.html';
        var opts = getBreadCrumbOptions('gallery');
        if (!page || page === '/') {
            filename = 'gallery.json';
        } else {
            opts.breadcrumb.push([prettyPrint(page.substring(1)), '/gallery' + page]);
        }
        const requestedPath = path.join(__dirname, './generated/gallery/', filename);
        fs.readFile(requestedPath, 'utf8', function (err, fileContents) {
            if (err) {
                res.sendStatus(404);
                return;
            }
            if (filename === 'gallery.json') {
                opts.gallery = JSON.parse(fileContents);
                res.render('gallery', opts);
            } else {
                opts.content = fileContents;
                res.render('page', opts);
            }
        });
    },
    about: function (req, res) {
        res.render('about', getBreadCrumbOptions('about'));
    },
    guides: function (req, res) {
        res.render('guides', getBreadCrumbOptions('guides'));
    },
    documentation: function (req, res) {
        res.render('documentation', getBreadCrumbOptions('documentation'));
    },
    oskari: function (req, res) {
        res.render('oskari', getBreadCrumbOptions('oskari'));
    },

    download: function (req, res) {
        res.render('download', getBreadCrumbOptions('download'));
    },
    md: function (req, res) {
        readMdFileFromBaseDir(res, 'md', req.path);
    },
    community: function (req, res) {
        readMdFileFromBaseDir(res, 'community', req.path.substring('community'.length + 1));
    },
    root: function (req, res) {
        res.render('index');
    },
    checkLatestVersion: function (req, res, next) {
        if (req.url.indexOf('latest') === -1) {
            next();
            return;
        }
        var version = apidocs.getLatestVersion();
        if (!version) {
            console.log('version not found');
            res.sendStatus(404);
            return;
        }
        var url = req.url.replace(/\/latest\//, `/${version}/`);
        console.log('redirecting to ' + url)
        req.url = url;
        next();
        return;
    }
};
