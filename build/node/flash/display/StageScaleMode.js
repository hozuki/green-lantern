/**
 * Created by MIC on 2015/11/18.
 */
var StageScaleMode = (function () {
    function StageScaleMode() {
    }
    Object.defineProperty(StageScaleMode, "EXACT_FIT", {
        get: function () {
            return 'exactFit';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageScaleMode, "NO_BORDER", {
        get: function () {
            return 'noBorder';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageScaleMode, "NO_SCALE", {
        get: function () {
            return 'noScale';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageScaleMode, "SHOW_ALL", {
        get: function () {
            return 'showAll';
        },
        enumerable: true,
        configurable: true
    });
    return StageScaleMode;
})();
exports.StageScaleMode = StageScaleMode;

//# sourceMappingURL=StageScaleMode.js.map
