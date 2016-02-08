var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

//var stream = require('stream');


var structure = {

};
function getStruct() {

//    var rs = new stream.Readable(); // { objectMode: true }
//    rs.push(JSON.stringify(structure));
//    rs.push(null);
    return structure;
}


function getBundleDef(docPath) {
    var parts = docPath.split(path.sep);
    if(parts.length < 2) {
        return;
    }
    var ns = parts[0];
    if(ns === 'app-specific') {
        return;
    }
    var bundleid = parts[1];
    
    if(!structure[ns]) {
        structure[ns] = {};
    }
    if(!structure[ns][bundleid]) {
        structure[ns][bundleid] = {};
    }
    if(parts.length <= 2) {
        return;
    }
    var bundleDef = structure[ns][bundleid];
    if(parts[2] === 'request') {
        if(!bundleDef.request) {
            bundleDef.request = [];
        }
        bundleDef.request.push(parts[3]);
    }
    if(parts[2] === 'event') {
        if(!bundleDef.event) {
            bundleDef.event = [];
        }
        bundleDef.event.push(parts[3]);
    }
    //console.log(structure);
    return bundleDef;
}


function generateDoc() {

    var basePath = path.sep + 'api' + path.sep;
    function getDocPath(filePath) {

        console.log(filePath);
        var baseIndex = filePath.indexOf(basePath);
        if(baseIndex === -1) {
            return;
        }

        return filePath.substring(baseIndex + basePath.length);
    }

    return through.obj(function(file, enc, callback){
        // Pass file through if:
        // - file has no contents
        // - file is a directory
        var docPath = getDocPath(file.path);
        if (!docPath || file.isNull() || file.isDirectory()) {
            this.push(file);
            return callback();
        }


        // User's should be using a compatible glob with plugin.
        // Example: gulp.src('images/**/*.{md}').pipe(oskariAPI())
        if (['.md'].indexOf(path.extname(file.path)) === -1) {
            this.emit('error', new PluginError({
                plugin: 'OskariAPI',
                message: 'Supported formats include Markdown only.'
            }));
            return callback();
        }
        var def = getBundleDef(docPath);
        if (!def) {
            // not a bundle, but copy anyway?
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

module.exports = {
    task : generateDoc,
    end : getStruct
};