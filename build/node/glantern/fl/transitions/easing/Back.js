/**
 * Created by MIC on 2015/12/26.
 */
var Back = (function () {
    function Back() {
    }
    Back.easeIn = function (t, b, c, d, s) {
        if (s === void 0) { s = 0; }
        //if (typeof s == "undefined") s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    Back.easeInOut = function (t, b, c, d, s) {
        if (s === void 0) { s = 0; }
        //if (typeof s == "undefined") s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    };
    Back.easeOut = function (t, b, c, d, s) {
        if (s === void 0) { s = 0; }
        //if (typeof s == "undefined") s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    return Back;
})();
exports.Back = Back;

//# sourceMappingURL=Back.js.map
