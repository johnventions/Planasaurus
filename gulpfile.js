var gulp = require('gulp');
var del = require('del');

gulp.task('clean:js', function () {
  return del([
    'server/**/*.js',
  ]);
});

gulp.task('default', gulp.series('clean:js'));