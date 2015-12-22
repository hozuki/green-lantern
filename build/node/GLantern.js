/**
 * Created by MIC on 2015/11/25.
 */
var WebGLRenderer_1 = require("./webgl/WebGLRenderer");
var Stage_1 = require("./flash/display/Stage");
var _util_1 = require("./_util/_util");
var GLantern = (function () {
    function GLantern() {
        this._isRunning = false;
        this._renderer = null;
        this._stage = null;
        this._isInitialized = false;
    }
    GLantern.prototype.initialize = function (width, height, options) {
        if (options === void 0) { options = WebGLRenderer_1.WebGLRenderer.DEFAULT_OPTIONS; }
        if (this._isInitialized) {
            return;
        }
        this._renderer = new WebGLRenderer_1.WebGLRenderer(width, height, options);
        this._stage = new Stage_1.Stage(this._renderer);
        this._isInitialized = true;
    };
    GLantern.prototype.uninitialize = function () {
        if (!this._isInitialized) {
            return;
        }
        this._stage.dispose();
        this._renderer.dispose();
        this._stage = null;
        this._renderer = null;
        this._isInitialized = false;
    };
    GLantern.prototype.startAnimation = function () {
        if (!this._isInitialized) {
            return;
        }
        this._isRunning = true;
        _util_1._util.requestAnimationFrame(this.__mainLoop.bind(this));
    };
    GLantern.prototype.stopAnimation = function () {
        if (!this._isInitialized) {
            return;
        }
        this._isRunning = false;
    };
    GLantern.prototype.runOneFrame = function () {
        if (!this._isInitialized) {
            return;
        }
        this._stage.update();
        this._stage.render(this._renderer);
        this._renderer.present();
    };
    Object.defineProperty(GLantern.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GLantern.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GLantern.prototype, "view", {
        get: function () {
            return this._isInitialized ? this._renderer.view : null;
        },
        enumerable: true,
        configurable: true
    });
    GLantern.prototype.__mainLoop = function (time) {
        if (!this._isRunning || !this._isInitialized) {
            return;
        }
        this.runOneFrame();
        _util_1._util.requestAnimationFrame(this.__mainLoop.bind(this));
    };
    return GLantern;
})();
exports.GLantern = GLantern;

//# sourceMappingURL=GLantern.js.map
