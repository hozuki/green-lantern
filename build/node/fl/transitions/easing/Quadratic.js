/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var Quadratic = (function () {
    function Quadratic() {
    }
    Quadratic.easeIn = function (t, b, c, d) {
        return c * (t /= d) * t + b;
    };
    Quadratic.easeInOut = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    };
    Quadratic.easeOut = function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };
    return Quadratic;
}());
exports.Quadratic = Quadratic;

//# sourceMappingURL=Quadratic.js.map
