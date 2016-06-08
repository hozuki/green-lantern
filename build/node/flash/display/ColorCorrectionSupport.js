/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var ColorCorrectionSupport = (function () {
    function ColorCorrectionSupport() {
    }
    Object.defineProperty(ColorCorrectionSupport, "DEFAULT_OFF", {
        get: function () {
            return 'defaultOff';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorCorrectionSupport, "DEFAULT_ON", {
        get: function () {
            return 'defaultOn';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorCorrectionSupport, "UNSUPPORTED", {
        get: function () {
            return 'unsupported';
        },
        enumerable: true,
        configurable: true
    });
    return ColorCorrectionSupport;
}());
exports.ColorCorrectionSupport = ColorCorrectionSupport;

//# sourceMappingURL=ColorCorrectionSupport.js.map
