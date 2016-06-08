/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var InterpolationMethod = (function () {
    function InterpolationMethod() {
    }
    Object.defineProperty(InterpolationMethod, "LINEAR_RGB", {
        get: function () {
            return 'linearRGB';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterpolationMethod, "RGB", {
        get: function () {
            return 'rgb';
        },
        enumerable: true,
        configurable: true
    });
    return InterpolationMethod;
}());
exports.InterpolationMethod = InterpolationMethod;

//# sourceMappingURL=InterpolationMethod.js.map
