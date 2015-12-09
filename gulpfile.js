// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha-co');

// Lint Tasks
gulp.task('lint', function() {
  return gulp.src(['index.js', 'src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
  gulp.src('spec/**/*.js')
    .pipe(mocha({
        reporter: 'nyan',
        clearRequireCache: true,
        ignoreLeaks: true
    }));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['index.js', 'src/**/*.js', 'spec/**/*.js'], ['test']);
});

// Default Task
gulp.task('default', ['test','watch']);