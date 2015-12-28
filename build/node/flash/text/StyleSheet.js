/**
 * Created by MIC on 2015/12/23.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var EventDispatcher_1 = require("../events/EventDispatcher");
var StyleSheet = (function (_super) {
    __extends(StyleSheet, _super);
    function StyleSheet() {
        _super.call(this);
        throw new NotImplementedError_1.NotImplementedError();
    }
    StyleSheet.prototype.clear = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    StyleSheet.prototype.getStyle = function (styleName) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    StyleSheet.prototype.parseCSS = function (cssText) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    StyleSheet.prototype.setStyle = function (styleName, styleObject) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    StyleSheet.prototype.transform = function (formatObject) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    StyleSheet.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        throw new NotImplementedError_1.NotImplementedError();
    };
    Object.defineProperty(StyleSheet.prototype, "styleNames", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    return StyleSheet;
})(EventDispatcher_1.EventDispatcher);
exports.StyleSheet = StyleSheet;

//# sourceMappingURL=StyleSheet.js.map
