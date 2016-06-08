/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var LineScaleMode = (function () {
    function LineScaleMode() {
    }
    Object.defineProperty(LineScaleMode, "HORIZONTAL", {
        get: function () {
            return "horizontal";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineScaleMode, "NONE", {
        get: function () {
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineScaleMode, "NORMAL", {
        get: function () {
            return "normal";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineScaleMode, "VERTICAL", {
        get: function () {
            return "vertical";
        },
        enumerable: true,
        configurable: true
    });
    return LineScaleMode;
}());
exports.LineScaleMode = LineScaleMode;

//# sourceMappingURL=LineScaleMode.js.map
