/**
 * Created by MIC on 2016/1/7.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FlashEvent_1 = require("./FlashEvent");
var NotImplementedError_1 = require("../../flash/errors/NotImplementedError");
var TimerEvent = (function (_super) {
    __extends(TimerEvent, _super);
    function TimerEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
    }
    Object.defineProperty(TimerEvent, "TIMER", {
        get: function () {
            return 'timer';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimerEvent, "TIMER_COMPLETE", {
        get: function () {
            return 'timerComplete';
        },
        enumerable: true,
        configurable: true
    });
    TimerEvent.prototype.updateAfterEvent = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TimerEvent.prototype.clone = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return TimerEvent;
}(FlashEvent_1.FlashEvent));
exports.TimerEvent = TimerEvent;

//# sourceMappingURL=TimerEvent.js.map
