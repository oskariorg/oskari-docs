var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;


function generateDoc(version, opts){
    // can't find watermark, exit now
    /*
    if (!fs.existsSync(oskariPath)) {
        new gutil.PluginError({
          plugin: 'OskariAPI',
          message: 'OskariAPI path "' + oskariPath + '" cannot be found.'
        });
    }
*/
	version = version || 'latest';

    // combine with default options
    /*
    opts = _.extend({
        alpha: 0.25,
        offsetX: 10,
        offsetY: 10,
        width: 0.1
    }, opts || {});
    */

    // cache the watermark image for the stream
//    var waterImg = new Canvas.Image();
//    waterImg.src = fs.readFileSync(watermark);

    return through.obj(function(file, enc, callback){
        // Pass file through if:
        // - file has no contents
        // - file is a directory
        console.log(file.path);
        if (file.isNull() || file.isDirectory()) {
            this.push(file);
            return callback();
        }
        // User's should be using a compatible glob with plugin.
        // Example: gulp.src('images/**/*.{md}').pipe(oskariAPI())
        if (['.md'].indexOf(path.extname(file.path)) === -1) {
            this.emit('error', new PluginError({
                plugin: 'OskariAPI',
                message: 'Supported formats include JPG and PNG only.'
            }));
            return callback();
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
            // create our virtual image
            // and set src to file's contents

            // replace the file contents with our new image
//            file.contents = canvas.toBuffer();

            this.push(file);
            return callback();
        }
    });
}

module.exports = generateDoc;