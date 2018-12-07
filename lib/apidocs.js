var path    = require('path');
var fs      = require('fs');

var generatedDocsPath = __dirname + "/../generated/api";

var versions = {
    // minute
    pollInterval : 60000,
    // last updated
    ts : -1,
    inProgress : false,
    cached : []
}

var bundles = {
    // minute
    pollInterval : 60000,
    inProgress : false,
    // last updated
    ts : -1,
    cached : {}
}

function getVersions(callback) {
    if(typeof callback !== 'function') {
        console.log('No callback given to getVersions');
        return;
    }
    if(versions.ts > new Date().getTime() + versions.pollInterval || versions.inProgress) {
        callback(versions.cached);
        return;
    }
    versions.inProgress = true;
    var values = [];
    fs.readdir(generatedDocsPath, function (err, files) {
        if (err) {
            console.log('Error reading directory that should contain api docs: ' + generatedDocsPath, err);
            callback(versions.cached);
            return;
        }
        var erronousVersions = 0;
        files.forEach(function(ver) {
            getBundles(ver, function(api) {
                if(!api) {
                    erronousVersions++;
                    return;
                }
                values.push(api.version);
                if(values.length + erronousVersions === files.length) {
                    // that was the last one
                    // sort versions
                    values.sort();
                    // reverse the order so latest is the first one
                    values.reverse();
                    versions.cached = values;
                    versions.ts = new Date().getTime();
                    callback(versions.cached);
                    versions.inProgress = false;
                }
            });
        });
    });
}

function getEvents(version, callback) {
    getJson('events.json', version, callback);
}

function getRequests(version, callback) {
    getJson('requests.json', version, callback);
}

function getBundles(version, callback) {
    getJson('bundles.json', version, callback);
}

function getJson(filename, version, callback) {
    if(bundles.cached[version] && bundles.ts > new Date().getTime() + bundles.pollInterval) {
        callback(bundles.cached[version]);
        return;
    }
    bundles.inProgress = true;
    var dirPath = generatedDocsPath + '/' + version;
    fs.stat(dirPath, function(err, stat) {
        if(err) {
            console.log('Error reading dir ' + dirPath);
            callback();
            return;
        }
        if(!stat.isDirectory()) {
            console.log('Api doc folder contains non-dir file: ' + dirPath);
            callback();
            return;
        }
        var filePath = dirPath + '/' + filename;
        fs.readFile(filePath, 'utf8', function(err, data)  {
            if(err) {
                console.log('Error reading file ' + filename + ' from path ' + filePath);
                callback();
                return;
            }
            bundles.cached[version] = {
                version : version,
                api : JSON.parse(data)
            };
            bundles.ts = new Date().getTime();
            callback(bundles.cached[version]);
            bundles.inProgress = false;
        });
    });
}


function getChangelog(version, callback) {
    var mdDocPath = path.join(generatedDocsPath, version, 'CHANGELOG.html');
    fs.readFile(mdDocPath, 'utf8', function (err, fileContent) {
        if (err) {
            console.error('Error reading changelog for version ' + version, err);
            callback();
            return;
        }
        callback(fileContent);
    });

}
function getBundleDoc(version, bundle, callback) {
    if(!bundle) {
        // no bundle requested, respond with log
        getChangelog(version, callback);
        return;
    }
    if(bundle.endsWith('.md')) {
        bundle = bundle.replace('.md', '.html');
    }
    else {
        bundle = bundle + '/bundle.html';
    }
    var mdDocPath = path.join(generatedDocsPath, version, bundle);
    fs.readFile(mdDocPath, 'utf8', function (err, fileContent) {
        if (err) {
            console.error('Error reading bundle doc for version ' + version + ' and bundle ' + bundle, err);
            callback();
            return;
        }
        callback(fileContent);
    });
}


module.exports = {
    getVersions : getVersions,
    getBundles : getBundles,
    getRequests : getRequests,
    getEvents : getEvents,
    doc : getBundleDoc,
    log : getChangelog
}