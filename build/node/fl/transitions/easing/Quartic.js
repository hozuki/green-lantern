/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var Quartic = (function () {
    function Quartic() {
    }
    Quartic.easeIn = function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };
    Quartic.easeInOut = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        else {
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    };
    Quartic.easeOut = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    return Quartic;
}());
exports.Quartic = Quartic;

//# sourceMappingURL=Quartic.js.map
