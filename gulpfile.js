/*
 *  Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 *  Licensed under the BSD-3-Clause
 *  https://opensource.org/licenses/BSD-3-Clause
 *  https://github.com/opus1269/screensaver/blob/master/LICENSE.md
 */
'use strict';
/* eslint no-console: 0 */
/* eslint require-jsdoc: 0 */

// paths and files
const base = {
  app: 'chrome-ext-utils',
  src: 'src/',
  docs: 'docs/',
  dest: './',
};
const path = {
  scripts: `${base.src}`,
};
const files = {
  ts: `${path.scripts}**/*.ts`,
  jsDev: ['./gulpfile.js'],
};

const gulp = require('gulp');

const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
// noinspection JSUnusedLocalSymbols
const debug = require('gulp-debug'); // eslint-disable-line no-unused-vars

// TypeScript
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');

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
  const input = files.jsDev;
  return gulp.src(input, {base: '.'}).
      pipe(eslint()).
      pipe(eslint.formatEach()).
      pipe(eslint.failOnError());
});

// Lint TypeScript files
gulp.task('_lint', () => {
  const input = files.ts;
  return gulp.src(input, {base: '.'}).
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
      pipe(gulp.dest(base.dest));
});

// Compile the typescript to js in place
gulp.task('_build_js', () => {
  console.log('compiling ts to js...');

  const input = files.ts;
  return gulp.src(input, {base: '.'}).
      pipe(tsProject(ts.reporter.longReporter())).js.
      pipe(gulp.dest(base.dest));
});

// Production build
gulp.task('build', gulp.series('_lint', '_build_js', 'docs', (done) => {
  done();
}));

// Incremental Development build
gulp.task('incrementalBuild', (done) => {
  // typescript changes
  gulp.watch(files.ts, gulp.series('_lint'));

  // gulpfile changes
  gulp.watch(files.jsDev, gulp.series('_lintdevjs'));

  done();
});

// Default - watch for changes during development
gulp.task('default', gulp.series('incrementalBuild', (done) => {
  done();
}));

