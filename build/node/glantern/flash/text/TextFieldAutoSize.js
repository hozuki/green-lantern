/**
 * Created by MIC on 2015/12/23.
 */
var TextFieldAutoSize = (function () {
    function TextFieldAutoSize() {
    }
    Object.defineProperty(TextFieldAutoSize, "CENTER", {
        get: function () {
            return "center";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFieldAutoSize, "LEFT", {
        get: function () {
            return "left";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFieldAutoSize, "NONE", {
        get: function () {
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFieldAutoSize, "RIGHT", {
        get: function () {
            return "right";
        },
        enumerable: true,
        configurable: true
    });
    return TextFieldAutoSize;
})();
exports.TextFieldAutoSize = TextFieldAutoSize;

//# sourceMappingURL=TextFieldAutoSize.js.map
