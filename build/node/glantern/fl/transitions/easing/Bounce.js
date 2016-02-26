/**
 * Created by MIC on 2015/12/26.
 */
var Bounce = (function () {
    function Bounce() {
    }
    Bounce.easeIn = function (t, b, c, d) {
        return c - Bounce.easeOut(d - t, 0, c, d) + b;
    };
    Bounce.easeInOut = function (t, b, c, d) {
        if (t < d / 2) {
            return Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
        }
        else {
            return Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };
    Bounce.easeOut = function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        }
        else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        }
        else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    };
    return Bounce;
})();
exports.Bounce = Bounce;

//# sourceMappingURL=Bounce.js.map
