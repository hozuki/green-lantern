/**
 * Created by MIC on 2015/12/26.
 */
var None = (function () {
    function None() {
    }
    None.easeIn = function (t, b, c, d) {
        return c * t / d + b;
    };
    None.easeInOut = function (t, b, c, d) {
        return c * t / d + b;
    };
    None.easeNone = function (t, b, c, d) {
        return t < d ? b : b + c;
    };
    None.easeOut = function (t, b, c, d) {
        return c * t / d + b;
    };
    return None;
})();
exports.None = None;

//# sourceMappingURL=None.js.map
