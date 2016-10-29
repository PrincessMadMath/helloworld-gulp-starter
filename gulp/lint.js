var gulp = require('gulp');
var config = require('./config');

/*** js lint ***/
var eslint = require('gulp-eslint');



gulp.task('js-lint', jsLint);


function jsLint(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var dest = config.paths.src + config.paths.dest.js;

    gulp.src(glob)
    .pipe(eslint(config.plugin.lint.eslint))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest(dest));
}