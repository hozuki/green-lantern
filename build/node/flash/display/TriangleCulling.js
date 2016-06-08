/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var TriangleCulling = (function () {
    function TriangleCulling() {
    }
    Object.defineProperty(TriangleCulling, "NEGATIVE", {
        get: function () {
            return "negative";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleCulling, "NONE", {
        get: function () {
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriangleCulling, "POSITIVE", {
        get: function () {
            return "positive";
        },
        enumerable: true,
        configurable: true
    });
    return TriangleCulling;
}());
exports.TriangleCulling = TriangleCulling;

//# sourceMappingURL=TriangleCulling.js.map
