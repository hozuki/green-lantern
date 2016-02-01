/**
 * Created by MIC on 2015/11/18.
 */
var FilterBase = (function () {
    function FilterBase(manager) {
        this._filterManager = null;
        this._flipY = false;
        this._flipX = false;
        this._referenceCount = 0;
        this._filterManager = manager;
    }
    /**
     * Called when it is added to a {@link DisplayObject.filters} array.
     * Notice that it may be called multiple times, but a filter should only be initialized once
     * if its output buffer is null.
     */
    FilterBase.prototype.notifyAdded = function () {
        if (this._referenceCount <= 0) {
            this.__initialize();
        }
        this._referenceCount++;
    };
    /**
     * Called when it is removed from a {@link DisplayObject.filters} array.
     * Notice that it may be called multiple times, but should do nothing if its output is already null.
     */
    FilterBase.prototype.notifyRemoved = function () {
        this._referenceCount--;
        if (this._referenceCount <= 0) {
            this.__dispose();
        }
    };
    FilterBase.prototype.dispose = function () {
        this.__dispose();
    };
    FilterBase.prototype.initialize = function () {
        this.__initialize();
    };
    Object.defineProperty(FilterBase.prototype, "filterManager", {
        get: function () {
            return this._filterManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterBase.prototype, "flipX", {
        get: function () {
            return this._flipX;
        },
        set: function (v) {
            this._flipX = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterBase.prototype, "flipY", {
        get: function () {
            return this._flipY;
        },
        set: function (v) {
            this._flipY = v;
        },
        enumerable: true,
        configurable: true
    });
    FilterBase.prototype.__initialize = function () {
    };
    FilterBase.prototype.__dispose = function () {
    };
    return FilterBase;
})();
exports.FilterBase = FilterBase;

//# sourceMappingURL=FilterBase.js.map
