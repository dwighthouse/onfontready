'use strict';

const babel = require('gulp-babel');
const brotli = require('gulp-brotli');
const clone = require('gulp-clone');
const envify = require('gulp-envify');
const es = require('event-stream');
const gulp = require('gulp');
const gzip = require('gulp-gzip');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const zopfli = require('gulp-zopfli');

function build(options) {
    let baseStream = gulp.src('./src/onfontready.js')
        .pipe(replace('module.exports', 'window.onfontready'))
        .pipe(envify({
            isLegacy: options.isLegacy || false,
            isTest: options.isTest || false,
        }))
        .pipe(babel({
            plugins: [
                'check-es2015-constants',
                'transform-es2015-block-scoping',
                'transform-es2015-arrow-functions',
                'transform-node-env-inline',
                'transform-dead-code-elimination',
            ],
        }));
        
    if (options.isLegacy)
    {
        baseStream = baseStream.pipe(rename((path) => { path.basename += '.legacy' }));
    }

    baseStream = baseStream.pipe(gulp.dest(options.dest));

    if (options.minify)
    {
        baseStream = baseStream
            .pipe(uglify())
            .pipe(rename((path) => { path.basename += '.min' }))
            .pipe(gulp.dest(options.dest));
    }

    // Multiple branching streams here, because we don't want to re-compress in new formats
    let outStreams = [
        baseStream,
    ];

    if (options.gzip)
    {
        outStreams.push(
            baseStream.pipe(clone())
            .pipe(gzip())
        );
    }

    if (options.zopfli)
    {
        outStreams.push(
            baseStream.pipe(clone())
            .pipe(rename((path) => { path.basename += '.zopfli' }))
            .pipe(zopfli())
        );
    }

    if (options.brotli)
    {
        outStreams.push(
            baseStream.pipe(clone())
            .pipe(rename((path) => { path.basename += '.brotli' }))
            .pipe(brotli.compress())
        );
    }

    // Merge the streams back together and output
    return es.merge.apply(null, outStreams)
        .pipe(gulp.dest(options.dest));
}



gulp.task('modern', function() {
    return build({
        dest: './dist',
        minify: true,
        gzip: true,
        zopfli: true,
        brotli: true,
    });
});

gulp.task('legacy', function() {
    return build({
        isLegacy: true,
        dest: './dist',
        minify: true,
        gzip: true,
        zopfli: true,
        brotli: true,
    });
});

gulp.task('build', ['legacy', 'modern']);

gulp.task('buildWatch', ['build'], function() {
    gulp.watch('./src/onfontready.js', ['build']);
});



gulp.task('modernTest', function() {
    return build({
        isTest: true,
        dest: './tests/mainTests/builds',
    });
});

gulp.task('legacyTest', function() {
    return build({
        isLegacy: true,
        isTest: true,
        dest: './tests/mainTests/builds',
    });
});

gulp.task('buildTest', ['legacyTest', 'modernTest']);

gulp.task('buildTestWatch', ['buildTest'], function() {
    gulp.watch('./src/onfontready.js', ['buildTest']);
});
