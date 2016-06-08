/**
 * Created by MIC on 2015/12/26.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectContainer_1 = require("../../flash/display/DisplayObjectContainer");
var NotImplementedError_1 = require("../../flash/errors/NotImplementedError");
var Canvas = (function (_super) {
    __extends(Canvas, _super);
    function Canvas(root, parent) {
        _super.call(this, root, parent);
    }
    Canvas.prototype.__update = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Canvas.prototype.__render = function (renderer) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return Canvas;
}(DisplayObjectContainer_1.DisplayObjectContainer));
exports.Canvas = Canvas;

//# sourceMappingURL=Canvas.js.map
