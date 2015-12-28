/**
 * Created by MIC on 2015/12/23.
 */
var GridFitType = (function () {
    function GridFitType() {
    }
    Object.defineProperty(GridFitType, "NONE", {
        get: function () {
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridFitType, "PIXEL", {
        get: function () {
            return "pixel";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridFitType, "SUBPIXEL", {
        get: function () {
            return "subpixel";
        },
        enumerable: true,
        configurable: true
    });
    return GridFitType;
})();
exports.GridFitType = GridFitType;

//# sourceMappingURL=GridFitType.js.map
