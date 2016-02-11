var express = require('express');
var path    = require('path');
var asset   = require('static-asset');
var routes  = require('./routes');

var port = process.env.NODE_PORT || 3003;
var environment = process.env.NODE_ENV || 'development';
var publicDir = path.join(__dirname, 'public');

var app = express();

// Configurations
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(asset(publicDir));
app.use(express.static(publicDir));

app.get('/guides', routes.guides);
app.get('/guides/*', routes.md);
app.get('/documentation', routes.documentation);
app.get('/documentation/bundles', routes.bundles);
app.get('/documentation/bundles/*', routes.bundledoc);
// <remove this after oskari-server release>
app.get('/documentation/backend/basic-install', function (req, res) {
    // As the README in oskari-server currently points to
    // /documentation/backend/basic-install
    // let's do a temporary redirect
    res.redirect('/documentation/backend/overview');
});
// </remove this after oskari-server release>
app.get('/documentation/*', routes.md);
app.get('/download', routes.download);
app.get('/examples', routes.examples);
app.get('/about', routes.about);
app.get('/search', routes.search);
app.get('/challenge', routes.challenge);
app.get('/oskari', routes.oskari);
// new api doc end points
app.get('/api', routes.apiPage);
app.get('/api.json', routes.apiJSON);
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
app.use('/apires', express.static(__dirname + '/md/generated/api'));


app.get('/', routes.root);

app.post('/search', routes.search);

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
