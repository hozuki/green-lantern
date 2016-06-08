/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var Elastic = (function () {
    function Elastic() {
    }
    Elastic.easeIn = function (t, b, c, d, a, p) {
        if (a === void 0) { a = 0; }
        if (p === void 0) { p = 0; }
        var s;
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        //if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
            s = p / 4;
            a = c;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };
    Elastic.easeInOut = function (t, b, c, d, a, p) {
        if (a === void 0) { a = 0; }
        if (p === void 0) { p = 0; }
        var s;
        if (t == 0)
            return b;
        if ((t /= d / 2) == 2)
            return b + c;
        //if (typeof p == "undefined") p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1)
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    };
    Elastic.easeOut = function (t, b, c, d, a, p) {
        if (a === void 0) { a = 0; }
        if (p === void 0) { p = 0; }
        var s;
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        //if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    };
    return Elastic;
}());
exports.Elastic = Elastic;

//# sourceMappingURL=Elastic.js.map
