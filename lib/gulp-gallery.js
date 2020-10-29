var fs          = require('fs');
var path        = require('path');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var mdformatter = require('./gallery-formatter');
var helper      = require('./gallery-helper');

function generateDoc(galleryItems) {

    return through.obj(function(file, enc, callback) {
        // Pass file through if:
        // - file has no contents
        // - file is a directory
        var normalizedPath = helper.normalizePath(file.path);
        if (!normalizedPath || file.isNull() || file.isDirectory()) {
            this.push(file);
            return callback();
        }
        if (['.md'].indexOf(path.extname(normalizedPath)) !== -1) {
            // bundle doc handling
            const def = galleryItems.find(item => item.path === normalizedPath);
            var fileContent = fs.readFileSync(file.path, "utf8");
            file.contents = Buffer.from(mdformatter.galleryDoc(fileContent, def));
            file.path = gutil.replaceExtension(file.path, '.html');
        }

        // No support for streams
        if (file.isStream()) {
            this.emit('error', new PluginError({
                plugin: 'OskariGallery',
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