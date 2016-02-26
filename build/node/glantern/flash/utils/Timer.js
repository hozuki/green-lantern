/**
 * Created by MIC on 2016/1/7.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("../events/EventDispatcher");
var TimerEvent_1 = require("../events/TimerEvent");
var Timer = (function (_super) {
    __extends(Timer, _super);
    function Timer(delay, repeatCount) {
        if (repeatCount === void 0) { repeatCount = 0; }
        _super.call(this);
        this.enabled = true;
        this._currentCount = 0;
        this._delay = 1000;
        this._repeatCount = 0;
        this._running = false;
        this._handle = 0;
        this.delay = delay;
        this.repeatCount = repeatCount;
        this.start();
    }
    Object.defineProperty(Timer.prototype, "currentCount", {
        get: function () {
            return this._currentCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "delay", {
        get: function () {
            return this._delay;
        },
        set: function (v) {
            v = Math.floor(v);
            this._delay = v >= 0 ? v : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "repeatCount", {
        get: function () {
            return this._repeatCount;
        },
        set: function (v) {
            v = Math.floor(v);
            this._repeatCount = v >= 0 ? v : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.reset = function () {
        if (this.running) {
            window.clearInterval(this._handle);
            this._handle = 0;
            this._running = false;
            this._currentCount = 0;
        }
    };
    Timer.prototype.start = function () {
        if (!this.running && (this.currentCount < this.repeatCount || this.repeatCount === 0)) {
            this._handle = window.setInterval(this.__timerCallback.bind(this), this.delay);
            this._running = true;
        }
    };
    Timer.prototype.stop = function () {
        if (this.running) {
            window.clearInterval(this._handle);
            this._handle = 0;
            this._running = false;
        }
    };
    Timer.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.reset();
    };
    Timer.prototype.__timerCallback = function () {
        if (this.enabled) {
            this._currentCount++;
            if (this.repeatCount > 0 && this.currentCount > this.repeatCount) {
                this.stop();
                this.__raiseTimerCompleteEvent();
            }
            else {
                this.__raiseTimerEvent();
            }
        }
    };
    Timer.prototype.__raiseTimerEvent = function () {
        var ev = new TimerEvent_1.TimerEvent(TimerEvent_1.TimerEvent.TIMER);
        ev.timeStamp = Date.now();
        this.dispatchEvent(ev);
    };
    Timer.prototype.__raiseTimerCompleteEvent = function () {
        var ev = new TimerEvent_1.TimerEvent(TimerEvent_1.TimerEvent.TIMER_COMPLETE);
        ev.timeStamp = Date.now();
        this.dispatchEvent(ev);
    };
    return Timer;
})(EventDispatcher_1.EventDispatcher);
exports.Timer = Timer;

//# sourceMappingURL=Timer.js.map
