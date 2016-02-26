/**
 * Created by MIC on 2015/12/26.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FlashEvent_1 = require("../../flash/events/FlashEvent");
var NotImplementedError_1 = require("../../../../lib/glantern-utils/src/NotImplementedError");
var TweenEvent = (function (_super) {
    __extends(TweenEvent, _super);
    function TweenEvent(type, time, position, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
        this._position = NaN;
        this._time = NaN;
        this._position = position;
        this._time = time;
    }
    TweenEvent.prototype.clone = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Object.defineProperty(TweenEvent, "MOTION_CHANGE", {
        get: function () {
            return 'motionChange';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TweenEvent, "MOTION_FINISH", {
        get: function () {
            return 'motionFinish';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TweenEvent, "MOTION_LOOP", {
        get: function () {
            return 'motionLoop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TweenEvent, "MOTION_RESUME", {
        get: function () {
            return 'motionResume';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TweenEvent, "MOTION_START", {
        get: function () {
            return 'motionStart';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TweenEvent, "MOTION_STOP", {
        get: function () {
            return 'motionStop';
        },
        enumerable: true,
        configurable: true
    });
    return TweenEvent;
})(FlashEvent_1.FlashEvent);
exports.TweenEvent = TweenEvent;

//# sourceMappingURL=TweenEvent.js.map
