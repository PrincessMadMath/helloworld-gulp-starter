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



/*************** Task definition ***************/

gulp.task('build:check', gulp.parallel('lint:js', 'lint:style'));

// From superset files (sass, typescript (not implemented)) to files usable by the browser (css, plain js,...)
gulp.task('build:compile', gulp.series(
  cleanAsset, 
  gulp.parallel(copyHtml, copyScript, copyCss, copyImages, compileSass)
));

// Different operation to do on basic files: minify, autoprefixer,...
gulp.task('build:build', gulp.series(
  cleanBuild,
  gulp.parallel(buildHtml, buildScript, buildCss, buildImages)
));

// Any task that need to be perform on "final" files
gulp.task('build:post', postBuildConcat);

/*** Tasks to build step-by-step ***/
gulp.task('build', gulp.series('build:check', 'build:compile', 'build:build', 'build:post'));


gulp.task('clean', gulp.parallel(cleanAsset, cleanBuild));


/*** Tasks to update assets type ***/
gulp.task('update:html', gulp.series(copyHtml, buildHtml, postBuildConcat));
gulp.task('update:css', gulp.series(copyCss, buildCss, postBuildConcat));
gulp.task('update:sass', gulp.series(compileSass, buildCss, postBuildConcat));
gulp.task('update:js', gulp.series(copyScript, buildScript, postBuildConcat));
gulp.task('update:image', gulp.series(copyImages, buildImages));


/*************** Utils function ***************/

function cleanAsset() {
    return del([config.paths.temp]);
}

function cleanBuild() {
    return del([config.paths.dist]);
}

/*************** Compile function ***************/

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

// Because we concat files based on the declaration in the .html, we need to
// run the concat everytime one of the target files is update 
// (or else it is not in the concat version)
function postBuildConcat(){
    var glob = config.prefixGlob(config.paths.dist, config.paths.glob.html);
    var dest = config.paths.dist + config.paths.dest.html;

    return gulp.src(glob)
    .pipe(gulpif(config.run.html.useref, useref()))
    .pipe(gulp.dest(dest));
}


