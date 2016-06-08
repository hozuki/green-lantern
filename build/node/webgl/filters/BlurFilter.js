/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlurYFilter_1 = require("./BlurYFilter");
var BlurXFilter_1 = require("./BlurXFilter");
var FilterBase_1 = require("../FilterBase");
var GLUtil_1 = require("../../GLUtil");
var BlurFilter = (function (_super) {
    __extends(BlurFilter, _super);
    function BlurFilter(manager) {
        _super.call(this, manager);
        this._tempTarget = null;
        this._strengthX = 5;
        this._strengthY = 5;
        this._pass = 1;
        this._blurXFilter = null;
        this._blurYFilter = null;
    }
    Object.defineProperty(BlurFilter.prototype, "strengthX", {
        get: function () {
            return this._strengthX;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strengthX = v;
            if (this._blurXFilter !== null) {
                this._blurXFilter.strength = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter.prototype, "strengthY", {
        get: function () {
            return this._strengthY;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strengthY = v;
            if (this._blurYFilter !== null) {
                this._blurYFilter.strength = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter.prototype, "pass", {
        get: function () {
            return this._pass;
        },
        set: function (v) {
            v = GLUtil_1.GLUtil.limitInto(v, 1, 3) | 0;
            this._pass = v;
            if (this._blurXFilter !== null) {
                this._blurXFilter.pass = v;
            }
            if (this._blurYFilter !== null) {
                this._blurYFilter.pass = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    BlurFilter.prototype.process = function (renderer, input, output, clearOutput) {
        this._blurXFilter.process(renderer, input, this._tempTarget, true);
        this._blurYFilter.process(renderer, this._tempTarget, output, clearOutput);
    };
    BlurFilter.prototype.__initialize = function () {
        this._blurXFilter = new BlurXFilter_1.BlurXFilter(this.filterManager);
        this._blurYFilter = new BlurYFilter_1.BlurYFilter(this.filterManager);
        this._blurXFilter.initialize();
        this._blurYFilter.initialize();
        this._blurXFilter.strength = this.strengthX;
        this._blurYFilter.strength = this.strengthY;
        this._blurXFilter.pass = this.pass;
        this._blurYFilter.pass = this.pass;
        this._blurXFilter.flipY = false;
        this._tempTarget = this.filterManager.renderer.createRenderTarget();
    };
    BlurFilter.prototype.__dispose = function () {
        this.filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
        this._blurXFilter.dispose();
        this._blurYFilter.dispose();
        this._blurXFilter = this._blurYFilter = null;
    };
    return BlurFilter;
}(FilterBase_1.FilterBase));
exports.BlurFilter = BlurFilter;

//# sourceMappingURL=BlurFilter.js.map
