/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var GraphicsPathWinding = (function () {
    function GraphicsPathWinding() {
    }
    Object.defineProperty(GraphicsPathWinding, "EVEN_ODD", {
        get: function () {
            return "evenOdd";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathWinding, "NON_ZERO", {
        get: function () {
            return "nonZero";
        },
        enumerable: true,
        configurable: true
    });
    return GraphicsPathWinding;
}());
exports.GraphicsPathWinding = GraphicsPathWinding;

//# sourceMappingURL=GraphicsPathWinding.js.map
