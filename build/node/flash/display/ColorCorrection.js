/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var ColorCorrection = (function () {
    function ColorCorrection() {
    }
    Object.defineProperty(ColorCorrection, "DEFAULT", {
        get: function () {
            return 'default';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorCorrection, "OFF", {
        get: function () {
            return 'off';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorCorrection, "ON", {
        get: function () {
            return 'on';
        },
        enumerable: true,
        configurable: true
    });
    return ColorCorrection;
}());
exports.ColorCorrection = ColorCorrection;

//# sourceMappingURL=ColorCorrection.js.map
