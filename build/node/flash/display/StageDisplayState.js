/**
 * Created by MIC on 2015/11/18.
 */
var StageDisplayState = (function () {
    function StageDisplayState() {
    }
    Object.defineProperty(StageDisplayState, "FULL_SCREEN", {
        get: function () {
            return 'fullScreen';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageDisplayState, "FULL_SCREEN_INTERACTIVE", {
        get: function () {
            return 'fullScreenInteractive';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StageDisplayState, "NORMAL", {
        get: function () {
            return 'normal';
        },
        enumerable: true,
        configurable: true
    });
    return StageDisplayState;
})();
exports.StageDisplayState = StageDisplayState;

//# sourceMappingURL=StageDisplayState.js.map
