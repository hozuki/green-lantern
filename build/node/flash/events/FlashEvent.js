/**
 * Created by MIC on 2015/11/21.
 */
"use strict";
var FlashEvent = (function () {
    function FlashEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        this.bubbles = false;
        this.cancelBubble = false;
        this.cancelable = false;
        this.currentTarget = null;
        this.defaultPrevented = false;
        this.eventPhase = -1;
        this.isTrusted = true;
        this.returnValue = false;
        this.srcElement = null;
        this.target = null;
        this.timeStamp = 0;
        this.type = null;
        this.AT_TARGET = 2;
        this.BUBBLING_PHASE = 0;
        this.CAPTURING_PHASE = 1;
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
    }
    FlashEvent.prototype.initEvent = function (eventTypeArg, canBubbleArg, cancelableArg) {
    };
    FlashEvent.prototype.preventDefault = function () {
    };
    FlashEvent.prototype.stopImmediatePropagation = function () {
    };
    FlashEvent.prototype.stopPropagation = function () {
    };
    FlashEvent.create = function (type) {
        var ev = new FlashEvent(type, false, false);
        ev.timeStamp = Date.now();
        return ev;
    };
    Object.defineProperty(FlashEvent, "ENTER_FRAME", {
        get: function () {
            return "enterFrame";
        },
        enumerable: true,
        configurable: true
    });
    return FlashEvent;
}());
exports.FlashEvent = FlashEvent;

//# sourceMappingURL=FlashEvent.js.map
