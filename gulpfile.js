var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var less    = require('gulp-less');
var minify  = require('gulp-minify-css');
var prefix  = require('gulp-autoprefixer');
var path    = require('path');
var lr      = require('gulp-livereload');

var minJs   = 'main.min.js';
var minCss  = 'main.min.css';

gulp.task('scripts', function () {
    // Minify and concatenate all JavaScript files (except vendor scripts)
    return gulp
        .src(['./client/js/**/*.js', '!client/js/vendor/**'])
        .pipe(concat(minJs))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('stylesheets', function () {
    return gulp
        .src('./client/stylesheets/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(concat(minCss))
        .pipe(minify())
        .pipe(prefix('last 2 versions', '> 1%', 'ie 8'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('livereload', function () {
    var server = lr();
    gulp.watch([
        './public/**'
        ,'./md/**'
        ,'./views/**'
        ], function (file) {
            server.changed(file.path);
        });
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('./client/stylesheets/**', function (event) {
        console.log('File ' + event.path + ' was ' + event.type);
        gulp.run('stylesheets');
    });
    gulp.watch('./client/js/**', function (event) {
        console.log('File ' + event.path + ' was ' + event.type);
        gulp.run('scripts');
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'stylesheets', 'livereload', 'watch']);
// The build task
gulp.task('build', ['scripts', 'stylesheets']);
