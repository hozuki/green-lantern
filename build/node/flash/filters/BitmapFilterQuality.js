/**
 * Created by MIC on 2015/11/30.
 */
var BitmapFilterQuality = (function () {
    function BitmapFilterQuality() {
    }
    Object.defineProperty(BitmapFilterQuality, "HIGH", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapFilterQuality, "LOW", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapFilterQuality, "MEDIUM", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    return BitmapFilterQuality;
})();
exports.BitmapFilterQuality = BitmapFilterQuality;

//# sourceMappingURL=BitmapFilterQuality.js.map
