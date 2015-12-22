/**
 * Created by MIC on 2015/11/20.
 */
var GraphicsPathCommand = (function () {
    function GraphicsPathCommand() {
    }
    Object.defineProperty(GraphicsPathCommand, "CUBIC_CURVE_TO", {
        get: function () {
            return 6;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathCommand, "CURVE_TO", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathCommand, "LINE_TO", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathCommand, "MOVE_TO", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathCommand, "NO_OP", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathCommand, "WIDE_LINE_TO", {
        get: function () {
            return 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphicsPathCommand, "WIDE_MOVE_TO", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    return GraphicsPathCommand;
})();
exports.GraphicsPathCommand = GraphicsPathCommand;

//# sourceMappingURL=GraphicsPathCommand.js.map
