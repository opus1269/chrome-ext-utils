/*
 *  Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 *  Licensed under the BSD-3-Clause
 *  https://opensource.org/licenses/BSD-3-Clause
 *  https://github.com/opus1269/screensaver/blob/master/LICENSE.md
 */
/* tslint:disable */
'use strict';
/* eslint no-console: 0 */
/* eslint require-jsdoc: 0 */

// paths and files
const base = {
  app: 'chrome-ext-utils',
  src: 'src/',
  docs: 'docs/',
};
const path = {
  scripts: `${base.src}`,
};
const files = {
  scripts: `${path.scripts}**/*.js`,
  scripts_ts: `${path.scripts}**/*.ts`,
};
files.tmpJs = [files.scripts];
files.ts = [files.scripts_ts];
files.lintdevjs = ['./gulpfile.js'];

// command options
const watchOpts = {
  verbose: true,
  base: '.',
};

// flag for watching
let isWatch = false;
// flag for production release build
let isProd = false;

const gulp = require('gulp');
const runSequence = require('run-sequence');

const noop = require('gulp-noop');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const eslint = require('gulp-eslint');
// const debug = require('gulp-debug'); // eslint-disable-line no-unused-vars

// TypeScript
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');

// code replacement
const SRCH_DEBUG = 'const _DEBUG = false';
const REP_DEBUG = 'const _DEBUG = true';

// to get the current task name
let currentTaskName = '';
gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
  currentTaskName = task.name;
  this.__runTask(task);
};

// Default - watch for changes during development
gulp.task('default', ['incrementalBuild']);

// Incremental Development build
gulp.task('incrementalBuild', (cb) => {
  isProd = false;
  isWatch = true;

  runSequence([
    '_watch_ts',
    '_lintdevjs',
    '_lint',
  ], cb);
});

// Development build
gulp.task('buildDev', (cb) => {
  isProd = false;
  isWatch = false;

  runSequence('_lint', '_build_js', cb);
});


// Production build
gulp.task('buildProd', (cb) => {
  isProd = true;
  isWatch = false;
  base.dist = '../build/prod/app';

  runSequence('_build_js', 'docs', cb);
});

// Generate Typedoc
gulp.task('docs', () => {

  const input = files.ts;
  return gulp.src(input).pipe(typedoc({
    mode: 'modules',
    module: 'system',
    target: 'ES6',
    out: 'docs/gen',
    name: 'Chrome Extension Utilities',
    readme: 'README.md',
    tsconfig: 'tsconfig.json',
  }));
});

// Lint development js files
gulp.task('_lintdevjs', () => {
  const input = files.lintdevjs;
  watchOpts.name = currentTaskName;
  return gulp.src(input, {base: '.'}).
      pipe(isWatch ? watch(input, watchOpts) : noop()).
      pipe(eslint()).
      pipe(eslint.formatEach()).
      pipe(eslint.failOnError());
});

// Lint TypeScript files
gulp.task('_lint', () => {
  const input = files.ts;
  watchOpts.name = currentTaskName;
  return gulp.src(input, {base: '.'}).
      pipe(isWatch ? watch(input, watchOpts) : noop()).
      pipe(tslint({
        formatter: 'verbose',
      })).
      pipe(plumber()).
      pipe(tslint.report({emitError: false}));
});

// Build TypeScript for development
gulp.task('_ts_dev', () => {
  const input = files.ts;
  return gulp.src(input, {base: '.'}).
      pipe(tsProject(ts.reporter.longReporter())).
      on('error', () => {/* Ignore compiler errors */}).
      pipe((!isProd ? replace(SRCH_DEBUG, REP_DEBUG) : noop())).
      pipe(gulp.dest(base.dev));
});

// Watch for changes to TypeScript files
gulp.task('_watch_ts', ['_ts_dev'], () => {
  const input = files.ts;
  gulp.watch(input, ['_ts_dev']);
});

// Compile the typescript to js in place
gulp.task('_build_js', () => {
  console.log('compiling ts to js...');

  const input = files.ts;
  return gulp.src(input, {base: '.'}).
      pipe(tsProject(ts.reporter.longReporter())).js.
      pipe((!isProd ? replace(SRCH_DEBUG, REP_DEBUG) : noop())).
      pipe(gulp.dest(base.src), noop());
});
