"use strict";

const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mochelec = require('gulp-mochelec');
const notifier = require('node-notifier');
const through = require('through2');

const TIMEOUT_PASS = 2000;
const TIMEOUT_FAIL = 4000;
const IMAGE_PASS = path.join(__dirname, 'img/pass.png');
const IMAGE_FAIL = path.join(__dirname, 'img/fail.png');

let args = require('minimist')(process.argv.slice(2));

// Command line arguments:
// `coverage`: generate code coverage from unit tests
// 'live': start livereload server watching coverage reports
// 'test-files': unit test files to run as glob patterns
// 'test-grep': grep pattern to filter unit tests

let files = {
	sources: ['index.js', 'lib/**/*.js'],
	tests: args['test-files'] || ['test/test-*.js'],
};


function notifyFailure(err) {
	gutil.log("Failure: " + err.message);
	notifier.notify({
		'expire-time': TIMEOUT_FAIL,
		icon: IMAGE_FAIL,
		title: "Failed",
		message: err.message
	});
}

function notifyPass() {
	return through.obj((file, enc, cb) => {
		notifier.notify({
			'expire-time': TIMEOUT_PASS,
			icon: IMAGE_PASS,
			title: "Pass",
			message: "All unit tests passed."
		});
		cb(null, file);
	});
}

gulp.task('test', () => {
	return gulp.src(files.tests, { read: false })
		.pipe(mochelec({
			renderer: true,
			require: args.coverage ? 'test/support/require-coverage.js' : undefined,
			hook: args.coverage ? 'test/support/hook-coverage.js' : undefined,
			grep: args['test-grep'],
		}))
		.on('error', notifyFailure)
		.pipe(notifyPass())
});

gulp.task('test:watch', ['test'], () => {
	gulp.watch([].concat(files.sources, files.tests), ['test']);
});
