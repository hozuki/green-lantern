/**
 * Created by MIC on 2015/11/18.
 */
var GLUtil_1 = require("../../../../lib/glantern-utils/src/GLUtil");
var EventDispatcher = (function () {
    function EventDispatcher() {
        this._listeners = null;
        this._listeners = new Map();
    }
    EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        // jabbany
        if (!this._listeners.has(type)) {
            this._listeners.set(type, []);
        }
        this._listeners.get(type).push(listener);
    };
    EventDispatcher.prototype.dispatchEvent = function (event, data) {
        // jabbany
        if (this._listeners.has(event.type) && this._listeners.get(event.type) !== null) {
            var arr = this._listeners.get(event.type);
            for (var i = 0; i < arr.length; ++i) {
                try {
                    arr[i].call(null, data);
                }
                catch (ex) {
                    if (ex.hasOwnProperty("stack")) {
                        GLUtil_1.GLUtil.trace(ex.stack.toString(), "dispatchEvent: error");
                    }
                    else {
                        GLUtil_1.GLUtil.trace(ex.toString(), "dispatchEvent: error");
                    }
                }
            }
            return true;
        }
        else {
            return false;
        }
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        // jabbany
        if (!this._listeners.has(type) || this._listeners.get(type).length === 0) {
            return;
        }
        var index = this._listeners.get(type).indexOf(listener);
        if (index >= 0) {
            this._listeners.get(type).splice(index, 1);
        }
    };
    EventDispatcher.prototype.hasEventListener = function (type) {
        return this._listeners.has(type);
    };
    EventDispatcher.prototype.willTrigger = function (type) {
        return this.hasEventListener(type) && this._listeners.get(type).length > 0;
    };
    EventDispatcher.prototype.dispose = function () {
        this._listeners.forEach(function (listeners) {
            while (listeners.length > 0) {
                listeners.pop();
            }
        });
        this._listeners.clear();
    };
    return EventDispatcher;
})();
exports.EventDispatcher = EventDispatcher;

//# sourceMappingURL=EventDispatcher.js.map
