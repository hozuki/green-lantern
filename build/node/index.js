/**
 * Created by MIC on 2015/11/20.
 */
var _util = require("./_util/index");
exports._util = _util;
var flash = require("./flash/index");
exports.flash = flash;
var webgl = require("./webgl/index");
exports.webgl = webgl;
var GLantern_1 = require("./GLantern");
exports.GLantern = GLantern_1.GLantern;
function injectToGlobal($this) {
    $this["_util"] = _util;
    $this["flash"] = flash;
    $this["webgl"] = webgl;
}
exports.injectToGlobal = injectToGlobal;

//# sourceMappingURL=index.js.map
