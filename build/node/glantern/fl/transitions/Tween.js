/**
 * Created by MIC on 2015/12/26.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("../../flash/events/EventDispatcher");
var NotImplementedError_1 = require("../../../../lib/glantern-utils/src/NotImplementedError");
var Tween = (function (_super) {
    __extends(Tween, _super);
    function Tween(obj, prop, func, begin, finish, duration, useSeconds) {
        if (useSeconds === void 0) { useSeconds = false; }
        _super.call(this);
        this.begin = NaN;
        this.duration = 5;
        this.finish = 5;
        this.FPS = 60;
        this.func = null;
        this.isPlaying = false;
        this.looping = false;
        this.obj = null;
        this.position = 0;
        this.prop = null;
        this.time = 0;
        this.useSeconds = false;
        this.obj = obj;
        this.prop = prop;
        this.func = func;
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.useSeconds = useSeconds;
    }
    Tween.prototype.continueTo = function (finish, duration) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.fforward = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.nextFrame = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.prevFrame = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.resume = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.rewind = function (t) {
        if (t === void 0) { t = 0; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.start = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.stop = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Tween.prototype.yoyo = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return Tween;
})(EventDispatcher_1.EventDispatcher);
exports.Tween = Tween;

//# sourceMappingURL=Tween.js.map
