var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');

var config = require('./config');


// Plugin to enable live-reload (https://www.browsersync.io/docs/gulp)
var browserSync = require('browser-sync').create();

/*************** Task definition ***************/

gulp.task('build:temp', gulp.series(
  cleanAsset, 
  gulp.parallel(copyHtml, copyScript, copyCss, copyImages, compileSass)
));

gulp.task('build:build', gulp.series(
  cleanBuild,
  gulp.parallel(buildHtml, buildScript, buildCss, buildImages)
));

gulp.task('build', gulp.series('build:temp', 'build:build'));

gulp.task('clean', gulp.parallel(cleanAsset, cleanBuild));

gulp.task('server', gulp.series('build', gulp.parallel(watchBuild, watchServer, startServer)));


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
    var glob = config.prefixGlob(config.paths.src,config.paths.glob.scss);
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
    .pipe(cssnano())
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
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(dest));
}

/*************** Watcher functions (change -> build) ***************/

// When a modification is done in the src folder, update the build
function watchBuild() {
  var html_glob = config.prefixGlob(config.paths.src,config.paths.glob.html);
  var js_glob = config.prefixGlob(config.paths.src,config.paths.glob.js);
  var image_glob = config.prefixGlob(config.paths.src,config.paths.glob.images);
  var sass_glob = config.prefixGlob(config.paths.src,config.paths.glob.scss);
  var css_glob = config.prefixGlob(config.paths.src,config.paths.glob.css);

  gulp.watch(html_glob, gulp.series(copyHtml, buildHtml));
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
