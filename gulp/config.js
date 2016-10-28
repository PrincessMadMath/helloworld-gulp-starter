/*************** Path ***************/

var paths = {
  src: "src/",
  temp: ".temp/",
  dist: "build/",
  glob: {
    html: ['**/*.html'],
    scss: ['scss/**/*.scss'],
    css : ['css/**/*.css'],
    js: ['js/**/*.js'],
    images: ['img/**/*'],
  },
  dest: {
    html: '',
    css : 'css/',
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



module.exports.paths = paths;
module.exports.prefixGlob = prefixGlob;