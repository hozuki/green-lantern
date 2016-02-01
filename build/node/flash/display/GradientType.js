/**
 * Created by MIC on 2015/11/20.
 */
var GradientType = (function () {
    function GradientType() {
    }
    Object.defineProperty(GradientType, "LINEAR", {
        get: function () {
            return "linear";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GradientType, "RADIAL", {
        get: function () {
            return "radial";
        },
        enumerable: true,
        configurable: true
    });
    return GradientType;
})();
exports.GradientType = GradientType;

//# sourceMappingURL=GradientType.js.map
