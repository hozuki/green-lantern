/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var Quintic = (function () {
    function Quintic() {
    }
    Quintic.easeIn = function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    };
    Quintic.easeInOut = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    };
    Quintic.easeOut = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };
    return Quintic;
}());
exports.Quintic = Quintic;

//# sourceMappingURL=Quintic.js.map
