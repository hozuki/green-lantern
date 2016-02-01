/**
 * Created by MIC on 2015/11/18.
 */
var StageQuality = (function () {
    function StageQuality() {
    }
    Object.defineProperty(StageQuality, "BEST", {
        get: function () {
            return 'best';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageQuality, "HIGH", {
        get: function () {
            return 'high';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageQuality, "LOW", {
        get: function () {
            return 'low';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageQuality, "MEDIUM", {
        get: function () {
            return 'medium';
        },
        enumerable: true,
        configurable: true
    });
    return StageQuality;
})();
exports.StageQuality = StageQuality;

//# sourceMappingURL=StageQuality.js.map
