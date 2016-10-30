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



gulp.task('lint:js', jsLint);
gulp.task('lint:style', gulp.parallel(cssLint));



/*************** Function to lint js ***************/

function jsLint(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.js);
    var dest = config.paths.src + config.paths.dest.js;
    
    return gulp.src(glob)
        .pipe(eslint(config.plugin.lint.eslint))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
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
    .pipe(gulp.dest(dest));
}

function sassLint(){
    var glob = config.prefixGlob(config.paths.src, config.paths.glob.sass);
    var dest = config.paths.src + config.paths.dest.sass;

    return gulp.src(glob)
    .pipe(postcss(processors, {
        syntax: syntax_scss
    }))
    .pipe(gulp.dest(dest));
}