var fs          = require('fs');
var path        = require('path');
var through     = require('through2');
var Vinyl       = require('vinyl');
var mdformatter = require('./gallery-formatter');
var helper      = require('./gallery-helper');


var galleryItems = [];
function getGalleryItems() {
    return galleryItems;
}

function sortByName(list) {
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
}

function buildGalleryDef(docPath, fileContent) {
    // Get some description text from md content
    var docContent = mdformatter.getGalleryDescription(fileContent);
    docContent.path = docPath;
    const page = docPath.substring(0, docPath.lastIndexOf('.md'));
    docContent.url = '/gallery/' + page;
    return docContent;
}

function combine (file, encoding, callback) {
    const normalizedPath = helper.normalizePath(file.path);
    if (!normalizedPath || file.isNull() || file.isDirectory()) {
        return callback();
    }

    if (['.md'].indexOf(path.extname(normalizedPath)) !== -1) {
        // build the bundle documentation structure
        var fileContent = fs.readFileSync(file.path, "utf8");
        var def = buildGalleryDef(normalizedPath, fileContent);
        getGalleryItems().push(def);
    }
    return callback();
}
function flush (callback) {
    var content = JSON.stringify(getGalleryItems(), null, 2);
    var target = new Vinyl({
        path: 'gallery.json',
        contents: Buffer.from(content)
    });
  	this.push(target);
    this.emit('data', target);

    this.emit('end');
  	return callback()
}

module.exports = function() {
	return through({objectMode: true}, combine, flush);
}