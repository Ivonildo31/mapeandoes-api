"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gulp = require("gulp");
const ts = require("gulp-typescript");
let clean = require('gulp-clean');
const tslint = require("gulp-tslint");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const mocha = require("gulp-mocha");
let serverPath = 'server';
let serverCompiled = ['**/*.js', '**/*.js.map', '**/*.d.ts'].map(el => serverPath + el);
let istanbul = require('gulp-istanbul');
let remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
let tsProject = ts.createProject('tsconfig.json');
let serverTS = [serverPath + '/**/*.ts'];
let runTest = () => gulp.src([`${serverPath}/**/*.Spec.js`]) // take our transpiled test source
    .pipe(mocha({ timeout: 64000 })); // runs tests
let tsCompile = () => gulp
    .src(serverTS)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: path.join(__dirname, serverPath) }))
    .pipe(gulp.dest(serverPath));
gulp.task('default', ['ts'], function () {
    return gulp.watch(`${serverPath}/**/*.ts`, ['ts-inc']);
});
gulp.task('ts-inc', function () {
    return tsCompile();
});
gulp.task('tslint', () => gulp.src(serverTS)
    .pipe(tslint.default({
    configuration: 'tslint.json'
}))
    .pipe(tslint.default.report()));
gulp.task('ts', ['clean'], function () {
    return tsCompile();
});
gulp.task('clean', function () {
    return gulp
        .src(serverCompiled, { read: false })
        .pipe(clean());
});
gulp.task('pre-test', ['ts', 'tslint'], () => gulp.src([`${serverPath}/**/**.js`, `!${serverPath}/**/*.Spec.js`])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
);
gulp.task('test', ['pre-test'], () => runTest()
    .once('error', () => process.exit(1))
    .once('end', () => process.exit()));
gulp.task('test-coverage', ['pre-test'], function () {
    return runTest()
        .once('error', () => process.exit(1))
        .pipe(istanbul.writeReports({
        reporters: ['json'] // this yields a basic non-sourcemapped coverage.json file
    }));
});
gulp.task('coverage', ['test-coverage'], () => gulp.src('./coverage/coverage-final.json')
    .pipe(remapIstanbul({
    basePath: '.',
    reports: {
        'html': './coverage',
        'text-summary': null,
        'lcovonly': './coverage/lcov.info'
    }
}))
    .once('end', () => process.exit()));
//# sourceMappingURL=gulpfile.js.map