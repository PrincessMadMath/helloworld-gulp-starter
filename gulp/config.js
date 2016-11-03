// Load the core build.
var _ = require('lodash');
var gutil = require('gulp-util')

/*************** Path ***************/
var paths = {
    src: "src/",
    temp: ".temp/",
    dist: "build/",
    glob: {
        html: ['**/*.html'],
        sass: ['scss/**/*.scss'],
        css : ['css/**/*.css'],
        js: ['js/**/*.js'],
        images: ['img/**/*'],
    },
    dest: {
        html: '',
        css : 'css/',
        sass: 'scss/',
        js: 'js/',
        images: 'img/',
    },
}

// Todo: this should but not calculated at runtime...
function prefixGlob(prefix, glob){
    return glob.map(function(el) { 
        return prefix + el; 
    })
}

/*************** Constants ***************/

var constants = {
    default: {
        placeHolderConstant: ''
    },
    development: {
        placeHolderConstant: 'dev'
    },
    production: {
        placeHolderConstant: 'prod'
    }
};



/*************** Plugin toggling ***************/

var run = {
    default: {
        js: {
            uglify: false
        },
        css: {
            cssnano: false,
            autoprefixer : true,
        },
        html: {
            useref : false
        }
    },

    development: {
        js: {
            uglify: false
        },
        css: {
            cssnano: false
        }
    },

    production: {
        js: {
            uglify: true
        },
        css: {
            cssnano: true
        },
        html: {
            useref : true
        }
    }
};


/*************** Plugin options ***************/

var plugin = {
    default: {
        js: {
            uglify: {
                mangle: true
            }
        },
        css: {
            autoprefixer : {
                browsers: ['last 2 versions'],
            }
        },
        lint: {
            eslint: {
                configFile: ".eslintrc",
                fix: true
            }
        }
    },

    development: {
        js: {
            uglify: {
                
                mangle: false
            }
        },
        lint: {
            eslint: {
                configFile: ".dev.eslintrc",
            }
        }
    },

    production: {
        js: {
            uglify: {
                mangle: true
            }
        }
    }
};


/*************** Exports ***************/

// How to set : --env=[name]
var env = gutil.env.env || 'development';


// Merge 
var runOpts = _.merge( {}, run.default, run[ env ] );
var pluginOpts = _.merge( {}, plugin.default, plugin[ env ] );
var constantsOpts = _.merge( {}, constants.default, constants[ env ]);

module.exports.constants = constantsOpts;
module.exports.run = runOpts;
module.exports.plugin = pluginOpts;

module.exports.paths = paths;
module.exports.prefixGlob = prefixGlob;