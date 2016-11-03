var gulp = require('gulp');
var config = require('./config');

/*** js lint ***/
var eslint = require('gulp-eslint');


/*** style tools ***/
var postcss = require('gulp-postcss');


/*** style lint ***/
var stylelint = require('stylelint')
var syntax_scss = require('postcss-scss');
var reporter = require('postcss-reporter');

var stylefmt = require('stylefmt');

var sorting = require('postcss-sorting');


/*** util ***/
// We also use lint for formatting, if we must only overwrite if a changed was
// made or else we have an infinite loop
var changed = require('gulp-changed');


gulp.task('lint', gulp.parallel(jsLint, cssLint, sassLint));
gulp.task('lint:js', jsLint);
gulp.task('lint:style', gulp.parallel(cssLint, sassLint));

gulp.task('lint:watch', gulp.series('lint', watchLint));



/*************** Function to lint js ***************/

function jsLint(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var dest = config.paths.src + config.paths.dest.js;
    
    return gulp.src(glob)
        .pipe(eslint(config.plugin.lint.eslint))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(changed(dest))
        .pipe(gulp.dest(dest));
}



/*************** Function to lint css and sass ***************/

// Additionnal linting that we want to do
//  sorting: will sort css attribute
//  stylefmt: will format css code
var processors = [
    stylefmt,
    sorting,
    stylelint({failAfterError: true}),
    reporter({ clearMessages: true }),
];

function cssLint(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.css);
    var dest = config.paths.src + config.paths.dest.css;

    return gulp.src(glob)
    .pipe(postcss(processors))
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
}


function sassLint(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.sass);
    var dest = config.paths.src + config.paths.dest.sass;

    return gulp.src(glob)
    .pipe(postcss(processors, {
        syntax: syntax_scss
    }))
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
}


// When a modification is done in the src folder, update the build
function watchLint() {
    var js_glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var sass_glob = config.prefixGlob(config.paths.src, config.paths.glob.sass);
    var css_glob = config.prefixGlob(config.paths.src, config.paths.glob.css);

    gulp.watch(js_glob, jsLint);
    gulp.watch(css_glob, cssLint);
    gulp.watch(sass_glob,  sassLint);
}