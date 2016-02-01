/**
 * Created by MIC on 2015/11/20.
 */
var CapsStyle = (function () {
    function CapsStyle() {
    }
    Object.defineProperty(CapsStyle, "NONE", {
        get: function () {
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CapsStyle, "ROUND", {
        get: function () {
            return "round";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CapsStyle, "SQUARE", {
        get: function () {
            return "square";
        },
        enumerable: true,
        configurable: true
    });
    return CapsStyle;
})();
exports.CapsStyle = CapsStyle;

//# sourceMappingURL=CapsStyle.js.map
