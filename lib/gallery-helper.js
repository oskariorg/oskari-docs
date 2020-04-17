var path        = require('path');

var basePath = path.sep + 'gallery' + path.sep;
function normalizePath(filePath) {
    var baseIndex = filePath.indexOf(basePath);
    if(baseIndex === -1) {
        return;
    }

    return filePath.substring(baseIndex + basePath.length);
}

module.exports = {
    normalizePath: normalizePath
};