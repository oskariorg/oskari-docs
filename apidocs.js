var path    = require('path');
var fs      = require('fs');
var md      = require('marked');

var generatedDocsPath = "./md/generated/api";

var ts = -1;
// minute
var pollInterval = 60000;
var updating = false;
var cachedFiles = [];

function getVersions(callback) {
    if(typeof callback !== 'function') {
        console.log('No callback given to getVersions');
        return;
    }
    if(ts > new Date().getTime() + pollInterval || updating) {
        callback(cachedFiles);
        return;
    }
    updating = true;
    var values = [];
    fs.readdir(generatedDocsPath, function (err, files) {
        if (err) {
            console.log('Error reading directory that should contain api docs: ' + generatedDocsPath, err);
            callback(cachedFiles);
        }
        var erronousVersions = 0;
        files.forEach(function(ver) {
            getSingleVersion(ver, function(api) {
                if(!api) {
                    erronousVersions++;
                    return;
                }
                values.push(api);
                if(values.length + erronousVersions === files.length) {
                    // that was the last one
                    cachedFiles = values;
                    ts = new Date().getTime();
                    callback(cachedFiles);
                    updating = false;
                }
            });
        });
    });
}


function getSingleVersion(version, callback) {
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
        fs.readFile(dirPath + '/api.json', 'utf8', function(err, data)  {
            if(err) {
                console.log('Error reading api.json ' + dirPath + '/api.json');
                callback();
                return;
            }
            callback({
                version : version,
                api : JSON.parse(data)
            });
        });
    });
}


function getChangelog(version, callback) {
    var mdDocPath = path.join(generatedDocsPath, version, 'CHANGELOG.md');
    fs.readFile(mdDocPath, 'utf8', function (err, fileContent) {
        if (err) {
            console.error('Error reading changelog for version ' + version, err);
            callback();
            return;
        }

        var renderer = new md.Renderer();
        renderer.heading = function (text, level) {
            var clazz = '';
            if(text.indexOf('[add]') != -1) {
                clazz = 'add';
            } else if (text.indexOf('[mod]') != -1) {
                clazz = 'mod'
            } else if (text.indexOf('[rem]') != -1) {
                clazz = 'rem'
            }
            var text = text.replace('[mod]', '');
            text = text.replace('[add]', '');
            text = text.replace('[rem]', '');
            text = text.replace('[rpc]', '<span class="label label-primary">RPC</span>');

            return '<h' + level + ' class=' +  clazz + '>' + text + '</h' + level + '>';
        }

        var formatted = md(fileContent, { renderer: renderer });
        callback(formatted);
        //callback(md(fileContent));
    });

}
function getBundleDoc(version, bundle, callback) {
    var mdDocPath = path.join(generatedDocsPath, version, bundle, 'bundle.md');
    fs.readFile(mdDocPath, 'utf8', function (err, fileContent) {
        if (err) {
            console.error('Error reading bundle doc for version ' + version + ' and bundle ' + bundle, err);
            callback();
            return;
        }

        var renderer = new md.Renderer();
        var orig = renderer.image;
        renderer.image = function(href, title, text) {
            // href like toolbar.png
            // override it to use the versioned url prefixed with /apires
            href = '/apires/' + version + '/' + bundle + '/' + href;
            return orig.apply(this, [href, title, text]);
        }
        var content = md(fileContent, { renderer: renderer });
        callback(content);
    });
}


module.exports = {
    index : getVersions,
    doc : getBundleDoc,
    log : getChangelog
}