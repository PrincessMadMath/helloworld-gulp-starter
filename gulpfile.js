var gulp = require('gulp');

// Pluggin to support splitting gulp task in multiple files
var requireDir = require('require-dir');

// If we want to use tasks declare in other files: this plugging enable forward-reference
var fwdRef = require('undertaker-forward-reference');


// Start registry to support forward-reference
gulp.registry(fwdRef());

// Load differents taks found in the files
requireDir('./gulp');