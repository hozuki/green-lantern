/**
 * Created by MIC on 2015/11/19.
 */

const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const gutil = require("gulp-util");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const os = require("os");

const tsConfig = {
    target: "es5",
    module: "commonjs",
    noImplicitAny: true,
    noEmitOnError: true,
    removeComments: false
};

gulp.task("default", ["build"]);

gulp.task("build", ["build-compile", "build-browserify"], copyBuildResults);

gulp.task("build-compile", function () {
    "use strict";
    return gulp
        .src(["src/**/*.ts", "inc/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(ts(tsConfig))
        .js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/node"))
});

gulp.task("build-browserify", ["build-compile"], function () {
    "use strict";
    return browserify({
        entries: "build/node/browser-bootstrap.js",
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

// Consider using stream-combiner2. (http://www.cnblogs.com/giggle/p/5562459.html)
function errorHandler(err) {
    "use strict";
    var colors = gutil.colors;
    gutil.log(os.EOL);
    gutil.log(colors.red("Error:") + " " + colors.magenta(err.fileName));
    gutil.log("    on line " + colors.cyan(err.loc.line) + ": " + colors.red(err.message));
    gutil.log("    plugin: " + colors.yellow(err.plugin));
}

function copyBuildResults() {
    "use strict";
    return gulp
        .src(["./build/GLantern-browser.min.js"])
        .pipe(gulp.dest("./test/visual"));
}
