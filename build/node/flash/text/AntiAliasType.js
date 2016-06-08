/**
 * Created by MIC on 2015/12/23.
 */
"use strict";
var AntiAliasType = (function () {
    function AntiAliasType() {
    }
    Object.defineProperty(AntiAliasType, "ADVANCED", {
        get: function () {
            return "advanced";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AntiAliasType, "NORMAL", {
        get: function () {
            return "normal";
        },
        enumerable: true,
        configurable: true
    });
    return AntiAliasType;
}());
exports.AntiAliasType = AntiAliasType;

//# sourceMappingURL=AntiAliasType.js.map
