var gulp = require('gulp');
var config = require('./config');

// Plugin to enable live-reload (https://www.browsersync.io/docs/gulp)
var browserSync = require('browser-sync').create();


/*************** Task definition ***************/
gulp.task('server', gulp.series('build', gulp.parallel('lint:watch', watchBuild, watchServer, startServer)));


/*************** Watcher functions (change -> build) ***************/

// When a modification is done in the src folder, update the build
function watchBuild() {
    var html_glob = config.prefixGlob(config.paths.src, config.paths.glob.html);
    var js_glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var image_glob = config.prefixGlob(config.paths.src, config.paths.glob.images);
    var sass_glob = config.prefixGlob(config.paths.src, config.paths.glob.sass);
    var css_glob = config.prefixGlob(config.paths.src, config.paths.glob.css);

    gulp.watch(html_glob, gulp.series('update:html'));
    gulp.watch(js_glob, gulp.series('update:js'));
    gulp.watch(image_glob, gulp.series('update:image'));
    gulp.watch(sass_glob, gulp.series('update:sass'));
    gulp.watch(css_glob, gulp.series( 'update:css'));
}

// When change occurs in /build we want to notify the server (reload or inject)
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

/*************** Browsersync helper function ***************/

function startServer(){
    browserSync.init({
        server: {
            baseDir: config.paths.dist
        }
    });
}

// Inject css files (instead of reloading)
function injectCss(){
    var css_glob = config.prefixGlob(config.paths.dist, config.paths.glob.css);

    return gulp.src(css_glob)
    .pipe(browserSync.stream());
}

function reload(done){
    browserSync.reload();
    done();
}


