'use strict';

const babel = require('gulp-babel');
const brotli = require('gulp-brotli');
const clone = require('gulp-clone');
const envify = require('gulp-envify');
const es = require('event-stream');
const gulp = require('gulp');
const gzip = require('gulp-gzip');
const prettyError = require('pretty-error');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const zopfli = require('gulp-zopfli');

const pe = new prettyError();
pe.appendStyle({
    'pretty-error > header > message': {
        color: 'grey',
    },
    'pretty-error > trace > item > header > what': {
        color: 'grey',
    },
    'pretty-error > trace > item > header > pointer > file': {
        color: 'cyan',
    },
    'pretty-error > trace > item > header > pointer > line': {
        color: 'cyan',
    },
});

const build = (options) => {
    let baseStream = gulp.src(options.src)
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
        }))
        .on('error', function(error) {
            // We want the this to re-bind, so avoid arrow function
            console.log(pe.render(error));
            this.emit('end');
        });
        
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
    return es.merge.apply(null, outStreams).pipe(gulp.dest(options.dest));
}



gulp.task('modern', () => {
    return build({
        src: './src/onfontready.js',
        dest: './dist',
        minify: true,
        gzip: true,
        zopfli: true,
        brotli: true,
    });
});

gulp.task('legacy', () => {
    return build({
        src: './src/onfontready.js',
        isLegacy: true,
        dest: './dist',
        minify: true,
        gzip: true,
        zopfli: true,
        brotli: true,
    });
});

gulp.task('build', ['legacy', 'modern']);

gulp.task('buildWatch', ['build'], () => {
    gulp.watch('./src/onfontready.js', ['build']);
});



gulp.task('modernTest', () => {
    return build({
        src: './src/onfontready.js',
        isTest: true,
        dest: './tests/mainTests/builds',
    });
});

gulp.task('legacyTest', () => {
    return build({
        src: './src/onfontready.js',
        isLegacy: true,
        isTest: true,
        dest: './tests/mainTests/builds',
    });
});

gulp.task('buildTest', ['legacyTest', 'modernTest']);

gulp.task('buildTestWatch', ['buildTest'], () => {
    gulp.watch('./src/onfontready.js', ['buildTest']);
});



gulp.task('promise', () => {
    return build({
        src: './src/onfontready.promiseshim.js',
        dest: './dist',
        minify: true,
    });
});

gulp.task('promiseWatch', ['promise'], () => {
    gulp.watch('./src/onfontready.promiseshim.js', ['promise']);
});



gulp.task('onfontsready', () => {
    return build({
        src: './src/onfontsready.js',
        dest: './dist',
        minify: true,
    });
});

gulp.task('onfontsreadyWatch', ['onfontsready'], () => {
    gulp.watch('./src/onfontsready.js', ['onfontsready']);
});



gulp.task('all', ['build', 'buildTest', 'promise', 'onfontsready']);

gulp.task('allWatch', ['buildWatch', 'buildTestWatch', 'promiseWatch', 'onfontsreadyWatch']);
