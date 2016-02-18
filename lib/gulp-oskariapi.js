var fs          = require('fs');
var path        = require('path');
var _           = require('lodash');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var mdformatter = require('./mdformatter.js');

var structure = {};
function getStruct() {
    return structure;
}

function getBundleDef(docPath) {
    var parts = docPath.split(path.sep);
    if(parts.length < 2) {
        return;
    }
    var ns = parts[0];
    if(ns === 'app-specific') {
        // filter out any app-specific bundles until we know what to do with them
        return;
    }
    var bundleid = parts[1];

    if(!structure[ns]) {
        structure[ns] = {};
    }
    if(!structure[ns][bundleid]) {
        structure[ns][bundleid] = {};
    }
    var bundleDef = structure[ns][bundleid];
    bundleDef.ns = ns;
    bundleDef.name = bundleid;
    if(parts.length <= 2) {
        return bundleDef;
    }
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

var basePath = path.sep + 'api' + path.sep;
function getDocPath(filePath) {

    console.log(filePath);
    var baseIndex = filePath.indexOf(basePath);
    if(baseIndex === -1) {
        return;
    }

    return filePath.substring(baseIndex + basePath.length);
}

function generateDoc(version) {


    return through.obj(function(file, enc, callback) {
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
        /*
        // Need to allow images as well at least!!
        if (['.md'].indexOf(path.extname(file.path)) === -1) {
            this.emit('error', new PluginError({
                plugin: 'OskariAPI',
                message: 'Supported formats include Markdown only.'
            }));
            return callback();
        }
        */
        if(docPath === 'CHANGELOG.md') {
            // format the changelog
            var formatted = mdformatter.log(fs.readFileSync(file.path, "utf8"));
            file.contents = new Buffer(formatted);
            file.path = gutil.replaceExtension(file.path, '.html');
        } else if (['.md'].indexOf(path.extname(file.path)) !== -1) {
            // bundle doc handling
            var def = getBundleDef(docPath);
            if (def) {
                // not a bundle, but copy anyway?
                var fileContent = fs.readFileSync(file.path, "utf8");
                var firstText = mdformatter.getBundleDescription(fileContent);
                if(firstText) {
                    def.desc = firstText.text;
                }
                file.contents = new Buffer(mdformatter.bundle(fileContent, version, def.ns + '/' + def.name));
                file.path = gutil.replaceExtension(file.path, '.html');
            }
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

module.exports = {
    task : generateDoc,
    json : getStruct
};