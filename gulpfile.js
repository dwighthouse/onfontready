'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const file = require('gulp-file');
const gzip = require('gulp-gzip');
const envify = require('gulp-envify');
const fs = require('fs');

gulp.task('legacyTest', function() {
    const text = fs.readFileSync('./src/onfontready.legacy.js', 'utf8').replace('module.exports', 'window.onfontready');

    return file('onfontready.legacy.js', text, { src: true })
    .pipe(envify({NODE_ENV: 'test'}))
    .pipe(gulp.dest('./tests/main/builds'));
});

gulp.task('legacyTestWatch', ['legacyTest'], function() {
    gulp.watch('./src/onfontready.legacy.js', ['legacyTest']);
});

gulp.task('modernTest', function() {
    const text = fs.readFileSync('./src/onfontready.js', 'utf8').replace('module.exports', 'window.onfontready');

    return file('onfontready.js', text, { src: true })
    .pipe(envify({NODE_ENV: 'test'}))
    .pipe(gulp.dest('./tests/main/builds'));
});

gulp.task('modernTestWatch', ['modernTest'], function() {
    gulp.watch('./src/onfontready.js', ['modernTest']);
});

gulp.task('testWatch', ['legacyTestWatch', 'modernTestWatch']);


gulp.task('legacy', function() {
    const text = fs.readFileSync('./src/onfontready.legacy.js', 'utf8').replace('module.exports', 'window.onfontready');

    return file('onfontready.legacy.js', text, { src: true })
    .pipe(envify({NODE_ENV: 'production'}))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('legacyWatch', ['legacy'], function() {
    gulp.watch('./src/onfontready.legacy.js', ['legacy']);
});

gulp.task('modern', function() {
    const text = fs.readFileSync('./src/onfontready.js', 'utf8').replace('module.exports', 'window.onfontready');

    return file('onfontready.js', text, { src: true })
    .pipe(envify({NODE_ENV: 'production'}))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('modernWatch', ['modern'], function() {
    gulp.watch('./src/onfontready.js', ['modern']);
});

gulp.task('build', ['legacy', 'modern']);