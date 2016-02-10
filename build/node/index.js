/**
 * Created by MIC on 2015/11/20.
 */
var _util = require("./_util/index");
exports._util = _util;
var flash = require("./flash/index");
exports.flash = flash;
var webgl = require("./webgl/index");
exports.webgl = webgl;
var fl = require("./fl/index");
exports.fl = fl;
var mx = require("./mx/index");
exports.mx = mx;
var GLantern_1 = require("./GLantern");
exports.GLantern = GLantern_1.GLantern;
function injectToGlobal($this) {
    $this["_util"] = _util;
    $this["flash"] = flash;
    $this["webgl"] = webgl;
    $this["fl"] = fl;
    $this["mx"] = mx;
}
exports.injectToGlobal = injectToGlobal;
function isSupported() {
    var globalObject = window;
    var util = _util._util;
    if (!globalObject) {
        return false;
    }
    // GLantern is based on <canvas>, so it should exist.
    if (!util.isClassDefinition(globalObject["HTMLCanvasElement"])) {
        return false;
    }
    // GLantern uses WebGL, so there should be a corresponding rendering context.
    if (!util.isClassDefinition(globalObject["WebGLRenderingContext"])) {
        return false;
    }
    // GLantern uses Map and Set class, so they should exist.
    // Note: Map and Set are ES6 features, but they are implemented on modern browsers.
    if (!util.isClassDefinition(globalObject["Map"])) {
        return false;
    }
    if (!util.isClassDefinition(globalObject["Set"])) {
        return false;
    }
    // No plans for support of Chrome whose version is under 40, due to a WebGL memory leak problem.
    if (typeof globalObject["chrome"] === "object") {
        var chromeVersionRegExp = /Chrome\/(\d+)(?:\.\d+)*/;
        var chromeVersionInfo = chromeVersionRegExp.exec(window.navigator.appVersion);
        if (chromeVersionInfo.length < 2 || parseInt(chromeVersionInfo[1]) < 40) {
            return false;
        }
    }
    return true;
}
exports.isSupported = isSupported;

//# sourceMappingURL=index.js.map
