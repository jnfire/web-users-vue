//===
// IMPORTS
//===
const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');

//===
// VARIABLES
//===
const SRC_PATH = 'src/assets';
const DEST_PATH = 'public';

//===
// TASKS
//===
function cleanDist() {
    return src(['public/img', 'public/fonts'], {allowEmpty: true})
        .pipe(clean());
}

// Compile SASS + sourcemaps
function sassCompile() {
    return src([SRC_PATH + "/sass/mobile.sass",  SRC_PATH + "/sass/desktop.sass"])
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(DEST_PATH + '/css/'))
        .pipe(browserSync.stream());
}

// Copy images
function images() {
    return src(SRC_PATH + '/img/**/*',{'allowEmpty':true})
        .pipe(dest(DEST_PATH + '/img/'))
        .pipe(browserSync.stream());
}

// Copy fonts
function fonts() {
    return src(SRC_PATH + "/fonts/**/*")
        .pipe(dest(DEST_PATH + "/fonts/"))
        .pipe(browserSync.stream());
}

//===
// Tasks
//===

// Default: 'gulp'
const build = series(
    cleanDist,
    parallel(sassCompile, images, fonts)
);
exports.default = build;

// Dev: 'gulp dev'
exports.dev = function () {
    build();
    watch([SRC_PATH + '/sass/*.sass', SRC_PATH + '/sass/**/*.sass'], sassCompile);
    watch([SRC_PATH + '/img/*', SRC_PATH + '/img/**/*'], images);
    watch([SRC_PATH + '/fonts/*', SRC_PATH + '/fonts/**/*'], fonts);
}
