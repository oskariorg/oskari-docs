var fs          = require('fs');
var path        = require('path');
var through     = require('through2');
var gutil       = require('gulp-util');
var mdformatter = require('./mdformatter');
var helper      = require('./oskariapi-helper');


var structure = {};
function getStruct() {
    return structure;
}

function buildBundleDef(docPath, fileContent) {
    var def = helper.describeFileAsBundle(docPath);
    if(!def || def.ns === 'app-specific')  {
        // filter out any app-specific bundles until we know what to do with them
        return;
    }
    var ns = def.ns;
    var bundleid = def.name;

    if(!structure[ns]) {
        structure[ns] = {};
    }
    if(!structure[ns][bundleid]) {
        structure[ns][bundleid] = {};
    }
    var bundleDef = structure[ns][bundleid];
    bundleDef.ns = ns;
    bundleDef.name = bundleid;

    // Get some description text from md content
    var docContent = mdformatter.getBundleDescription(fileContent);
    if(def.isBundle) {
        bundleDef.desc = docContent.desc;
        bundleDef.path = docPath;
        return bundleDef;
    }

    if(def.isRequest) {
        if(!bundleDef.request) {
            bundleDef.request = [];
        }
        bundleDef.request.push({
            name : docContent.name || def.fileName.replace('.md', ''),
            path : docPath,
            file : def.fileName,
            desc : docContent.desc
        });
    }
    else if(def.isEvent) {
        if(!bundleDef.event) {
            bundleDef.event = [];
        }
        bundleDef.event.push({
            name : docContent.name || def.fileName.replace('.md', ''),
            path : docPath,
            file : def.fileName,
            desc : docContent.desc
        });
    }
    //console.log(structure);
    return bundleDef;
}

function combine (file, encoding, callback) {

    console.log(file.path);
    var docPath = helper.getDocPath(file.path);
    if (!docPath || file.isNull() || file.isDirectory()) {
        return callback();
    }

    if (['.md'].indexOf(path.extname(file.path)) !== -1) {
        // build the bundle documentation structure
        var fileContent = fs.readFileSync(file.path, "utf8");
        buildBundleDef(docPath, fileContent);
    }
    //this.structure = getStruct();
    return callback()
}
function flush (callback) {
    var target = new gutil.File();
    target.path = 'api.json';
    var content = JSON.stringify(getStruct(), null, 2);
    target.contents = new Buffer(content);

  	this.push(target);
    this.emit('data', target);
    this.emit('end');
  	return callback()
}

module.exports = function() {
	return through({objectMode: true}, combine, flush);
}