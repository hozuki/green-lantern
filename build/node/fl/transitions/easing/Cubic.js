/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var Cubic = (function () {
    function Cubic() {
    }
    Cubic.easeIn = function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    };
    Cubic.easeInOut = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    };
    Cubic.easeOut = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };
    return Cubic;
}());
exports.Cubic = Cubic;

//# sourceMappingURL=Cubic.js.map
