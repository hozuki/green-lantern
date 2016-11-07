/**
 * Created by MIC on 2015/11/19.
 */

"use strict";

const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const gutil = require("gulp-util");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const os = require("os");

const tsConfigs = {
    "build": {
        target: "es5",
        module: "commonjs",
        noImplicitAny: true,
        noEmitOnError: true,
        removeComments: false
    },
    "tests": {
        target: "es5",
        module: "commonjs",
        noImplicitAny: true,
        noEmitOnError: true,
        removeComments: false
    }
};

const incDirs = {
    "base": ["chalk", "libtess.js", "node", "pako"]
};
incDirs.tests = incDirs.base;
incDirs.build = incDirs.base.concat("es2015");
incDirToRel(incDirs.tests);
incDirToRel(incDirs.build);

gulp.task("default", ["build"]);

gulp.task("build", ["build-compile", "build-browserify"], copyBuildResults);

gulp.task("build-compile", function () {
    return gulp
        .src(["src/gl/**/*.ts"].concat(incDirs.build))
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfigs.build))
        .js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/node/gl"))
});

gulp.task("build-browserify", ["build-compile"], function () {
    return browserify({
        entries: "build/node/gl/browser-bootstrap.js",
        debug: true
    })
        .bundle()
        .pipe(source("GLantern-browser.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest("build"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .on("error", errorHandler)
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));
});

gulp.task("copy", copyBuildResults);

gulp.task("transform-tests", ["build-compile"], function () {
    return gulp
        .src(["src/tests/logical/**/*.ts"].concat(incDirs.tests))
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfigs.tests))
        .js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/node/tests/logical"))
});

// Consider using stream-combiner2. (http://www.cnblogs.com/giggle/p/5562459.html)
function errorHandler(err) {
    var colors = gutil.colors;
    gutil.log(os.EOL);
    gutil.log(colors.red("Error:") + " " + colors.magenta(err.fileName));
    gutil.log("    on line " + colors.cyan(err.loc.line) + ": " + colors.red(err.message));
    gutil.log("    plugin: " + colors.yellow(err.plugin));
}

function copyBuildResults() {
    return gulp
        .src(["./build/**/*"])
        .pipe(gulp.dest("src/tests/visual/build"));
}

/**
 *
 * @param arr {String[]}
 */
function incDirToRel(arr) {
    for (var i = 0; i < arr.length; ++i) {
        arr[i] = "inc/" + arr[i] + "/**/*.ts";
    }
}
