var express = require('express');
var path    = require('path');
var fs      = require('fs');
var asset   = require('static-asset');
var routes  = require('./routes');

var port = process.env.NODE_PORT || 3003;
var environment = process.env.NODE_ENV || 'development';
var publicDir = path.join(__dirname, 'public');

var app = express();

// Configurations
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view options', {
    layout: false
});
app.use(asset(publicDir));
app.use(express.static(publicDir));

app.get('/guides', routes.guides);
app.get('/guides/*', routes.md);
app.get('/documentation', routes.documentation);
// redirect requests for old bundledocs to the new /api/bundles
app.get('/documentation/bundles', function (req, res) {
    res.redirect('/api/bundles');
});
app.get('/documentation/bundles/*', function (req, res) {
    res.redirect('/api/bundles');
});
app.get('/documentation/*', routes.md);

// The route is just meant to be used as a preview and should not be used for linking from other sites.
// Once we move the contents to intended places we can remove this route completely
app.get('/community/*', routes.community);

app.get('/download', routes.download);
app.get('/examples', routes.examples);
app.get('/about', routes.about);
app.get('/oskari', routes.oskari);

// new api doc end points
app.get('/api', routes.apiSelection);
app.get('/api/bundles', routes.bundlesPage);
app.get('/api/requests', routes.requestsPage);
app.get('/api/events', routes.eventsPage);
app.get('/api/bundles.json', routes.bundlesJSON);
app.get('/api/requests.json', routes.requestsJSON);
app.get('/api/events.json', routes.eventsJSON);
app.get('/apidoc/:ver/*', function(req, res) {
    routes.apiDoc(req.params.ver, req.params[0], function(content) {
        if(!content) {
            res.send(404);
            return;
        }
        res.send(content);
    })
});
// for handling images linked in bundle docs
var apiResDir = path.join(__dirname, 'generated/api')
app.use(asset(apiResDir));
app.use('/apires', express.static(apiResDir));

// generated jsdocs
app.use('/jsdoc', routes.checkLatestVersion);
app.use('/jsdoc', express.static(path.join(__dirname, 'generated/jsdoc')));

// generated db documentation
app.use('/db', express.static(path.join(__dirname, 'generated/db')));

app.get('/', routes.root);

app.use(function(err, req, res, next) {
    console.error(err);
    next(err);
});
/*
process.on('uncaughtException', function (error) {
   console.log(error.stack);
});
*/
app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port') + ' on ' + environment + ' environment');
