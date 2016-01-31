/**
 * Created by MIC on 2015/11/18.
 */
var ShaderID = (function () {
    function ShaderID() {
    }
    Object.defineProperty(ShaderID, "PRIMITIVE", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "BLUR_X", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "BLUR_Y", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "REPLICATE", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "COLOR_TRANSFORM", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "FXAA", {
        get: function () {
            return 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "BLUR2", {
        get: function () {
            return 6;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "COPY_IMAGE", {
        get: function () {
            return 7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderID, "PRIMITIVE2", {
        get: function () {
            return 8;
        },
        enumerable: true,
        configurable: true
    });
    return ShaderID;
})();
exports.ShaderID = ShaderID;

//# sourceMappingURL=ShaderID.js.map
