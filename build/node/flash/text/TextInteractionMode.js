/**
 * Created by MIC on 2015/12/23.
 */
"use strict";
var TextInteractionMode = (function () {
    function TextInteractionMode() {
    }
    Object.defineProperty(TextInteractionMode, "NORMAL", {
        get: function () {
            return "normal";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInteractionMode, "SELECTION", {
        get: function () {
            return "selection";
        },
        enumerable: true,
        configurable: true
    });
    return TextInteractionMode;
}());
exports.TextInteractionMode = TextInteractionMode;

//# sourceMappingURL=TextInteractionMode.js.map
