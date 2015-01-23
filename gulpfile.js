var gulp = require('gulp');
var _ = require('lodash');
var karma = require('karma').server;
var karmaConf = require('./karma.conf');

var karmaConfFor = function(version) {
  var conf = _.clone(karmaConf);
  conf.files = _.clone(karmaConf.files);
  conf.files.unshift('test/lib/angular-*' + version + '.js');
  return conf;
};

gulp.task('test:legacy', function (done) {
  karma.start(_.assign({}, karmaConfFor('1.2.21'), {singleRun: true}), done);
});

/**
 * Run test once and exit
 */

gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaConfFor('1.3.6'), {singleRun: true}), done);
});

/**
 * Watch for file changes and re-run tests on each change
 */

gulp.task('tdd:legacy', function (done) {
  karma.start(karmaConfFor('1.2.21'), done);
});

gulp.task('tdd', function (done) {
  karma.start(karmaConfFor('1.3.6'), done);
});

gulp.task('default', ['tdd']);
