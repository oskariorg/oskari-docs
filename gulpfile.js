var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var less    = require('gulp-less');
var path    = require('path');

gulp.task('scripts', function() {
    // Minify and concatenate all JavaScript files (except vendor scripts)
    return gulp
        .src(['./client/js/**/*.js', '!client/js/vendor/**'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('stylesheets', function() {
    return gulp
        .src('./client/stylesheets/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./public/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('./client/stylesheets/**', function(event) {
        console.log('File ' + event.path + ' was ' + event.type);
        gulp.run('stylesheets');
    });
    gulp.watch('./client/js/**', function(event) {
        console.log('File ' + event.path + ' was ' + event.type);
        gulp.run('scripts');
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'stylesheets', 'watch']);
// The build task
gulp.task('build', ['scripts', 'stylesheets']);