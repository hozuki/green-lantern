/**
 * Created by MIC on 2015/12/23.
 */
"use strict";
var TextFieldType = (function () {
    function TextFieldType() {
    }
    Object.defineProperty(TextFieldType, "DYNAMIC", {
        get: function () {
            return "dynamic";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFieldType, "INPUT", {
        get: function () {
            return "input";
        },
        enumerable: true,
        configurable: true
    });
    return TextFieldType;
}());
exports.TextFieldType = TextFieldType;

//# sourceMappingURL=TextFieldType.js.map
