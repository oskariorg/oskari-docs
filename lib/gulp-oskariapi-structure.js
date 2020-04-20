var fs          = require('fs');
var path        = require('path');
var through     = require('through2');
var gutil       = require('gulp-util');
var mdformatter = require('./oskariapi-formatter');
var helper      = require('./oskariapi-helper');

var structure = {};
function getStruct() {
    return structure;
}

function sortByName(list) {
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
}

function getBundlesJson() {
    var index = getStruct();
    var response = [];
    Object.keys(index).forEach((ns) => {
        var nsDef = {
            name : ns,
            bundles : []
        };
        const content = index[ns];
        Object.keys(content).forEach((bundleid) => {
            const def = content[bundleid];
            nsDef.bundles.push({
                name : bundleid,
                desc : def.desc,
                path : ns + '/' + bundleid
            });
        });
        response.push(nsDef);
        sortByName(nsDef.bundles);
    });
    sortByName(response);
    return response;
}

function getRequestsJson() {
    var index = getStruct();
    var response = [];
    Object.keys(index).forEach((ns) => {
        const content = index[ns];
        Object.keys(content).forEach((bundleid) => {
            const def = content[bundleid];
            if(!def.request || !def.request.length) {
                return;
            }
            def.request.forEach((req) => {
                response.push({
                    name : req.name,
                    desc : req.desc,
                    path : req.path,
                    rpc : req.rpc,
                    bundle : bundleid,
                    ns : ns
                });
            });
        });
    });
    sortByName(response);
    return response;
}
function getEventsJson() {
    var index = getStruct();
    var response = [];
    Object.keys(index).forEach((ns) => {
        const content = index[ns];
        Object.keys(content).forEach((bundleid) => {
            const def = content[bundleid];
            if(!def.event || !def.event.length) {
                return;
            }
            def.event.forEach((event) => {
                response.push({
                    name : event.name,
                    desc : event.desc,
                    path : event.path,
                    rpc : event.rpc,
                    bundle : bundleid,
                    ns : ns
                });
            });
        });
    });
    sortByName(response);
    return response;
}
/*
{
      "ns": "admin",
      "name": "admin",
      "desc": "Bundle manages administrative functionalities that can have minimal UI requirements. Currently only default view management is implemented.",
      "path": "admin\\admin\\bundle.md",
      "request": [
        {
          "name": "Admin.AddTabRequest",
          "path": "admin\\admin\\request\\Admin.AddTabRequest.md",
          "file": "Admin.AddTabRequest.md",
          "desc": "Requests tab to be added"
        }
      ]
    }
 */
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
            path : docPath.replace(/\\/g, '/'),
            file : def.fileName,
            rpc : docContent.rpc,
            desc : docContent.desc
        });
    }
    else if(def.isEvent) {
        if(!bundleDef.event) {
            bundleDef.event = [];
        }
        bundleDef.event.push({
            name : docContent.name || def.fileName.replace('.md', ''),
            path : docPath.replace(/\\/g, '/'),
            file : def.fileName,
            rpc : docContent.rpc,
            desc : docContent.desc
        });
    } else {
        bundleDef.subFiles = bundleDef.subFiles || [];
        bundleDef.subFiles.push({
            docPath: docPath,
            fileContent: fileContent
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
    target.contents = Buffer.from(content);

  	this.push(target);
    this.emit('data', target);

    var bundles = new gutil.File();
    bundles.path = 'bundles.json';
    bundles.contents = Buffer.from(JSON.stringify(getBundlesJson(), null, 2));
    this.push(bundles);
    this.emit('data', bundles);

    var requests = new gutil.File();
    requests.path = 'requests.json';
    requests.contents = Buffer.from(JSON.stringify(getRequestsJson(), null, 2));
    this.push(requests);
    this.emit('data', requests);

    var events = new gutil.File();
    events.path = 'events.json';
    events.contents = Buffer.from(JSON.stringify(getEventsJson(), null, 2));
    this.push(events);
    this.emit('data', events);

    // TODO: generate bundles.json
    // TODO: generate requests.json
    // TODO: generate events.json


    this.emit('end');
  	return callback()
}

module.exports = function() {
	return through({objectMode: true}, combine, flush);
}