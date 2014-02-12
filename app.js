var express = require('express');
var fs      = require('fs');
var path    = require('path');
var md      = require('marked');
var asset   = require('static-asset');

var mdDir = 'md';
var port = process.env.NODE_PORT || 3003;
var environment = process.env.NODE_ENV || 'development';
var baseUrl = environment === 'production' ? '/beta/' : '/';
var releaseDir = path.join(__dirname, 'public', 'release');

var app = express();

// Configurations
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(asset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

md.setOptions({
    langPrefix: 'language-',
    highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

var readMdFile = function(req, res, mdDoc, jadePage) {
    var mdDocPath = path.join(__dirname, mdDir, (mdDoc + '.md'));
    jadePage = jadePage || 'page';

    fs.readFile(mdDocPath, 'utf8', function(err, mdFile) {
        if (err) {
            console.error(err);
            return res.render('404');
        }

        var html = md(mdFile);
        res.render(jadePage, {
            content: html,
            baseUrl: baseUrl
        });
    });
};

app.get('/guides/:guidepath/:doc?', function(req, res) {
    var docFilePath = path.join('guides', req.params.guidepath, (req.params.doc || 'my-first-bundle'));
    readMdFile(req, res, docFilePath);
});

app.get('/guides/:doc?', function(req, res) {
    var docFilePath = path.join('guides', (req.params.doc || 'guides'));
    readMdFile(req, res, docFilePath);
});

app.get('/documentation/:doc?', function(req, res) {
    var docFilePath = path.join('documentation', (req.params.doc || 'documentation'));
    readMdFile(req, res, docFilePath);
});

app.get('/documentation/:docpath/:doc', function(req, res) {
    var docFilePath = path.join('documentation', req.params.docpath, req.params.doc);
    readMdFile(req, res, docFilePath);
});

app.get('/download', function(req, res) {
    fs.readdir(releaseDir, function(err, files) {
        if (err) {
            console.log(err);

        }    
        res.render('download', {
            baseUrl: baseUrl,
            files: files
        });
    })
});

app.get('/about', function(req, res) {
    readMdFile(req, res, 'about');
});

app.get('/', function(req, res) {
    res.render('index', {
        baseUrl: baseUrl
    });
});

app.use(function(err, req, res, next) {
    console.error(err);
    next(err);
});

app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port') + ' on ' + environment + ' environment');
