var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var file = require('gulp-file');

gulp.task('global', function() {
    var coreFunction = require('./src/onfontready.js').toString();

    return file('onfontready.global.js', 'window.onfontready = ' + coreFunction + ';', { src: true })
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
    }))
    .pipe(gulp.dest('./dist'));
});