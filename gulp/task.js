var gulp = require('gulp');
var config = require('./config');

/*** html pluggins ***/
var useref = require("gulp-useref");

/*** js plugins ***/
var uglify = require('gulp-uglify');

/*** style plugins ***/
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');


/*** image plugins ***/
var imagemin = require('gulp-imagemin');

/*** util plugins ***/
var del = require('del');
var gulpif = require('gulp-if');
// Plugin to enable live-reload (https://www.browsersync.io/docs/gulp)
var browserSync = require('browser-sync').create();


/*************** Task definition ***************/

gulp.task('build:check', gulp.parallel('lint:js', 'lint:style'));

gulp.task('build:temp', gulp.series(
  cleanAsset, 
  gulp.parallel(copyHtml, copyScript, copyCss, copyImages, compileSass)
));

gulp.task('build:build', gulp.series(
  cleanBuild,
  gulp.parallel(buildHtml, buildScript, buildCss, buildImages)
));

gulp.task('build:post', postBuildHtml);

gulp.task('build', gulp.series('build:temp', 'build:build', 'build:post'));

gulp.task('clean', gulp.parallel(cleanAsset, cleanBuild));

gulp.task('server', gulp.series('build', gulp.parallel('lint:watch', watchBuild, watchServer, startServer)));


/*************** Utils function ***************/

function cleanAsset() {
    return del([config.paths.temp]);
}

function cleanBuild() {
    return del([config.paths.dist]);
}



/*************** Pre-compile function ***************/

function copyHtml(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.html);
    var dest = config.paths.temp + config.paths.dest.html;

    return gulp.src(glob)
    .pipe(gulp.dest(dest));
}

function copyScript(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var dest = config.paths.temp + config.paths.dest.js;

    return gulp.src(glob)
    .pipe(gulp.dest(dest));
}

function copyCss(){
    var glob = config.prefixGlob(config.paths.src,config.paths.glob.css);
    var dest = config.paths.temp + config.paths.dest.css;

    return gulp.src(glob)
    .pipe(gulp.dest(dest));
}

function copyImages(){
    var glob = config.prefixGlob(config.paths.src,config.paths.glob.images);
    var dest = config.paths.temp + config.paths.dest.images;

    return gulp.src(glob)
    .pipe(gulp.dest(dest));
}

function compileSass(){
    var glob = config.prefixGlob(config.paths.src,config.paths.glob.sass);
    var dest = config.paths.temp + config.paths.dest.css;

    return gulp.src(glob)
    .pipe(sass())
    .pipe(gulp.dest(dest));
}


/*************** Build functions (make ready for production) ***************/

function buildHtml(){
    var glob = config.prefixGlob(config.paths.temp, config.paths.glob.html);
    var dest = config.paths.dist + config.paths.dest.html;

    return gulp.src(glob)
    .pipe(gulp.dest(dest));
}

// Only take from .temp and minify
function buildCss() {
    var glob = config.prefixGlob(config.paths.temp, config.paths.glob.css);
    var dest = config.paths.dist + config.paths.dest.css;

    return gulp.src(glob)
    .pipe(gulpif(config.run.css.autoprefixer, autoprefixer(config.plugin.css.autoprefixer)))
    .pipe(gulpif(config.run.css.cssnano, cssnano()))
    .pipe(gulp.dest(dest));
}

function buildImages() {
    var glob = config.prefixGlob(config.paths.temp, config.paths.glob.images);
    var dest = config.paths.dist + config.paths.dest.images;

    return gulp.src(glob)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(dest));
}

function buildScript() {
    var glob = config.prefixGlob(config.paths.temp, config.paths.glob.js);
    var dest = config.paths.dist + config.paths.dest.js;

    return gulp.src(glob)
    .pipe(gulpif(config.run.js.uglify, uglify(config.plugin.js.uglify)))
    .pipe(gulp.dest(dest));
}


/*************** Post-build task (final file modification) ***************/

function postBuildHtml(){
    var glob = config.prefixGlob(config.paths.dist, config.paths.glob.html);
    var dest = config.paths.dist + config.paths.dest.html;

    return gulp.src(glob)
    .pipe(gulpif(config.run.html.useref, useref()))
    .pipe(gulp.dest(dest));
}


/*************** Watcher functions (change -> build) ***************/

// When a modification is done in the src folder, update the build
function watchBuild() {
    var html_glob = config.prefixGlob(config.paths.src, config.paths.glob.html);
    var js_glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var image_glob = config.prefixGlob(config.paths.src, config.paths.glob.images);
    var sass_glob = config.prefixGlob(config.paths.src, config.paths.glob.sass);
    var css_glob = config.prefixGlob(config.paths.src, config.paths.glob.css);

    gulp.watch(html_glob, gulp.series(copyHtml, buildHtml, postBuildHtml));
    gulp.watch(js_glob, gulp.series(copyScript, buildScript));
    gulp.watch(image_glob, gulp.series(copyImages, buildImages));
    gulp.watch(sass_glob, gulp.series(compileSass, buildCss));
    gulp.watch(css_glob,  gulp.series(copyCss, buildCss));
}

// When change occurs in /build reload-server
function watchServer() {
    var html_glob = config.prefixGlob(config.paths.dist,config.paths.glob.html);
    var js_glob = config.prefixGlob(config.paths.dist,config.paths.glob.js);
    var image_glob = config.prefixGlob(config.paths.dist,config.paths.glob.images);
    var css_glob = config.prefixGlob(config.paths.dist,config.paths.glob.css);

    gulp.watch(html_glob, reload);
    gulp.watch(js_glob, reload);
    gulp.watch(image_glob, reload);
    gulp.watch(css_glob,  injectCss);
}

function reload(done){
    browserSync.reload();
    done();
}

// Todo: what if src not from same place as baseDir
function injectCss(){
    var css_glob = config.prefixGlob(config.paths.dist,config.paths.glob.css);

    return gulp.src(css_glob)
    .pipe(browserSync.stream());
}

function startServer(){
    browserSync.init({
        server: {
            baseDir: config.paths.dist
        }
    });
}
