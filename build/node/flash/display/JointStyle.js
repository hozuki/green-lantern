/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var JointStyle = (function () {
    function JointStyle() {
    }
    Object.defineProperty(JointStyle, "BEVEL", {
        get: function () {
            return "bevel";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JointStyle, "MITER", {
        get: function () {
            return "miter";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JointStyle, "ROUND", {
        get: function () {
            return "round";
        },
        enumerable: true,
        configurable: true
    });
    return JointStyle;
}());
exports.JointStyle = JointStyle;

//# sourceMappingURL=JointStyle.js.map
