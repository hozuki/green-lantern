/**
 * Created by MIC on 2015/11/21.
 */
var FlashEvent = (function () {
    function FlashEvent() {
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
        var ev = new FlashEvent();
        ev.type = type;
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
})();
exports.FlashEvent = FlashEvent;

//# sourceMappingURL=FlashEvent.js.map
