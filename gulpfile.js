/*
 *  Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 *  Licensed under the BSD-3-Clause
 *  https://opensource.org/licenses/BSD-3-Clause
 *  https://github.com/opus1269/screensaver/blob/master/LICENSE.md
 */

'use strict';

// paths and files
const base = {
  app: './',
  src: 'src/',
  docs: 'docs/',
  dest: './',
};
const files = {
  ts: `${base.src}**/*.ts`,
  js: [`${base.app}gulpfile.js`],
};

// plugins
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');

// Lint development js files
function jsLint() {
  const input = files.js;
  return gulp.src(input, {base: '.'}).
      pipe(eslint()).
      pipe(eslint.formatEach()).
      pipe(eslint.failOnError());
}

// Lint TypeScript files
function tsLint() {
  const input = files.ts;
  return gulp.src(input, {base: '.'}).
      pipe(tslint({
        formatter: 'verbose',
      })).
      pipe(plumber()).
      pipe(tslint.report({emitError: false}));
}

// Compile the typescript to js in place
function tsCompile() {
  console.log('compiling ts to js...');

  const input = files.ts;
  return gulp.src(input, {base: '.'}).
      pipe(tsProject(ts.reporter.longReporter())).js.
      pipe(gulp.dest(base.dest));
}

// watch for file changes
function watch() {
  gulp.watch(files.ts, gulp.series(tsLint));

  gulp.watch(files.js, gulp.series(jsLint));
}

// Generate Typedoc
function docs() {
  const input = files.ts;
  return gulp.src(input).pipe(typedoc({
    mode: 'modules',
    module: 'system',
    target: 'ES6',
    out: 'docs/gen',
    name: 'Chrome Extension Utilities',
    readme: 'README.md',
    tsconfig: 'tsconfig.json'}));
}

exports.develop = watch;
exports.build = gulp.series(jsLint, tsLint, tsCompile, docs);
exports.docs = docs;
exports.default = watch;
