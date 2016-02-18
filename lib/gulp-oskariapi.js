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
            if(def.isBundle) {
                var bundle = index[def.ns][def.name];
                // construct request/event part of the documentation
            }
            else if (def.isRequest) {
                // link back to bundle?
            }
            else if (def.isEvent) {
                // link back to bundle?
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

module.exports = generateDoc