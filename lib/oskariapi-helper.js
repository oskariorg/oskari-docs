var path        = require('path');

function describeFileAsBundle(docPath) {
    var parts = docPath.split(path.sep);
    if(parts.length < 2) {
        return;
    }
    var value = {
        ns : parts[0],
        name : parts[1],
        isBundle : docPath.endsWith('bundle.md')
    };
    if(parts.length <= 2) {
        return value;
    }
    value.isRequest = parts[2] === 'request';
    value.isEvent = parts[2] === 'event';
    value.fileName = parts[3];
    return value;
}

var basePath = path.sep + 'api' + path.sep;
function getDocPath(filePath) {
    var baseIndex = filePath.indexOf(basePath);
    if(baseIndex === -1) {
        return;
    }

    return filePath.substring(baseIndex + basePath.length);
}



module.exports = {
    getDocPath : getDocPath,
    describeFileAsBundle : describeFileAsBundle
};