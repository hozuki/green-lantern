/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject_1 = require("./DisplayObject");
var Graphics_1 = require("./Graphics");
var ShaderID_1 = require("../../webgl/ShaderID");
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape(root, parent) {
        _super.call(this, root, parent);
        this._graphics = null;
        this._graphics = new Graphics_1.Graphics(this, root.worldRenderer);
    }
    Shape.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._graphics.dispose();
        this._graphics = null;
    };
    Object.defineProperty(Shape.prototype, "graphics", {
        get: function () {
            return this._graphics;
        },
        enumerable: true,
        configurable: true
    });
    Shape.prototype.__update = function () {
        this._graphics.update();
    };
    Shape.prototype.__render = function (renderer) {
        this.graphics.render(renderer, renderer.currentRenderTarget, false);
    };
    Shape.prototype.__selectShader = function (shaderManager) {
        // Switched to the new Primitive2Shader. Consider the obsolete of PrimitiveShader.
        shaderManager.selectShader(ShaderID_1.ShaderID.PRIMITIVE2);
    };
    return Shape;
}(DisplayObject_1.DisplayObject));
exports.Shape = Shape;

//# sourceMappingURL=Shape.js.map
