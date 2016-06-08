/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var Circular = (function () {
    function Circular() {
    }
    Circular.easeIn = function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    };
    Circular.easeInOut = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        else {
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    };
    Circular.easeOut = function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    };
    return Circular;
}());
exports.Circular = Circular;

//# sourceMappingURL=Circular.js.map
