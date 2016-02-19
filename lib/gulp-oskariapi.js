var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var mdformatter = require('./mdformatter');
var helper      = require('./oskariapi-helper');

function generateDoc(version, index) {

    return through.obj(function(file, enc, callback) {
        // Pass file through if:
        // - file has no contents
        // - file is a directory
        var docPath = helper.getDocPath(file.path);
        if (!docPath || file.isNull() || file.isDirectory()) {
            this.push(file);
            return callback();
        }

        if(docPath === 'CHANGELOG.md') {
            // format the changelog
            var formatted = mdformatter.log(fs.readFileSync(file.path, "utf8"));
            file.contents = new Buffer(formatted);
            file.path = gutil.replaceExtension(file.path, '.html');
        } else if (['.md'].indexOf(path.extname(file.path)) !== -1) {
            // bundle doc handling
            var fileContent = fs.readFileSync(file.path, "utf8");
            var def = helper.describeFileAsBundle(docPath);
            if(def.ns !== 'app-specific') {
                var bundle = index[def.ns][def.name];
                if(def.isBundle) {
                    // construct request/event part of the documentation
                    fileContent += getRequestMD(bundle);
                    fileContent += getEventMD(bundle);
                }
                else if (def.isRequest) {
                    fileContent += "\n\n*Included in bundle: " + bundle.ns + '/' + bundle.name + '*';
                    // link back to bundle?
                }
                else if (def.isEvent) {
                    // link back to bundle?
                    fileContent += "\n\n*Included in bundle: " + bundle.ns + '/' + bundle.name + '*';
                }
            }
            file.contents = new Buffer(mdformatter.bundle(fileContent, version, def.ns + '/' + def.name));
            file.path = gutil.replaceExtension(file.path, '.html');
        }

        // No support for streams
        if (file.isStream()) {
            this.emit('error', new PluginError({
                plugin: 'OskariAPI',
                message: 'Streams are not supported.'
            }));
            return callback();
        }

        if (file.isBuffer()) {
            this.push(file);
            return callback();
        }
    });
}

function getRequestMD(bundle) {
    if(!bundle.request || !bundle.request.length) {
        return '';
    }
    var md = '\n\n## Requests that the bundle handles\n\n';
        md += '<table class="table"><tr><th> Request </th><th> Use </th></tr>\n';
    bundle.request.forEach(function(req) {
        md += '<tr><td>`' + req.name + '`</td><td>' + req.desc + '</td></tr>';
    });
    md += '</table>\n';
    return md;
}
function getEventMD(bundle) {
    if(!bundle.event || !bundle.event.length) {
        return '';
    }
    var md = '\n\n## Events that the bundle sends\n\n';
        md += '<table class="table"><tr><th> Event </th><th> Use </th></tr>\n';
    bundle.event.forEach(function(event) {
        md += '<tr><td>`' + event.name + '`</td><td>' + event.desc + '</td></tr>';
    });
    md += '</table>\n';
    return md;
}

module.exports = generateDoc