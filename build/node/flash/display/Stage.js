/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColorCorrectionSupport_1 = require("./ColorCorrectionSupport");
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var StageScaleMode_1 = require("./StageScaleMode");
var StageQuality_1 = require("./StageQuality");
var StageDisplayState_1 = require("./StageDisplayState");
var ColorCorrection_1 = require("./ColorCorrection");
var StageAlign_1 = require("./StageAlign");
var DisplayObjectContainer_1 = require("./DisplayObjectContainer");
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage(renderer) {
        _super.call(this, null, null);
        this.align = StageAlign_1.StageAlign.TOP_LEFT;
        this.color = 0x000000;
        this.colorCorrection = ColorCorrection_1.ColorCorrection.DEFAULT;
        this.displayState = StageDisplayState_1.StageDisplayState.NORMAL;
        this.focus = null;
        this.frameRate = 60;
        this.fullScreenSourceRect = null;
        this.mouseChildren = true;
        this.quality = StageQuality_1.StageQuality.HIGH;
        this.scaleMode = StageScaleMode_1.StageScaleMode.NO_SCALE;
        this.showDefaultContextMenu = true;
        this.tabChildren = true;
        this._allowFullScreen = true;
        this._allowFullScreenInteractive = true;
        this._colorCorrectionSupport = ColorCorrectionSupport_1.ColorCorrectionSupport.DEFAULT_OFF;
        this._stageHeight = 0;
        this._stageWidth = 0;
        this._worldRenderer = null;
        this._root = this;
        this._worldRenderer = renderer;
        this._rawRenderTarget = renderer.createRenderTarget();
        this.resize(renderer.view.width, renderer.view.height);
    }
    Object.defineProperty(Stage.prototype, "allowFullScreen", {
        get: function () {
            return this._allowFullScreen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "allowFullScreenInteractive", {
        get: function () {
            return this._allowFullScreenInteractive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "colorCorrectionSupport", {
        get: function () {
            return this._colorCorrectionSupport;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "fullScreenHeight", {
        get: function () {
            return screen.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "fullScreenWidth", {
        get: function () {
            return screen.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "softKeyboardRect", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "stageHeight", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        set: function (v) {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "stageWidth", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        set: function (v) {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "x", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "y", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Stage.prototype.invalidate = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Stage.prototype.isFocusInaccessible = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Object.defineProperty(Stage.prototype, "worldRenderer", {
        get: function () {
            return this._worldRenderer;
        },
        enumerable: true,
        configurable: true
    });
    Stage.prototype.resize = function (width, height) {
        this._width = width;
        this._height = height;
        // TODO: Fully implement this
    };
    Stage.prototype.render = function (renderer) {
        _super.prototype.render.call(this, renderer);
        // Copy it to the screen target.
        //throw new NotImplementedError();
        renderer.copyRenderTargetContent(this.outputRenderTarget, renderer.inputTarget, true);
    };
    Stage.prototype.__render = function (renderer) {
        this._rawRenderTarget.clear();
    };
    Stage.prototype.__update = function () {
    };
    return Stage;
})(DisplayObjectContainer_1.DisplayObjectContainer);
exports.Stage = Stage;

//# sourceMappingURL=Stage.js.map
