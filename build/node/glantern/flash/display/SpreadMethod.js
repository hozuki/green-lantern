/**
 * Created by MIC on 2015/11/20.
 */
var SpreadMethod = (function () {
    function SpreadMethod() {
    }
    Object.defineProperty(SpreadMethod, "PAD", {
        get: function () {
            return "pad";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpreadMethod, "REFLECT", {
        get: function () {
            return "reflect";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpreadMethod, "REPEAT", {
        get: function () {
            return "repeat";
        },
        enumerable: true,
        configurable: true
    });
    return SpreadMethod;
})();
exports.SpreadMethod = SpreadMethod;

//# sourceMappingURL=SpreadMethod.js.map
