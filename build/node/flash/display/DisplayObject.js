/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Transform_1 = require("../geom/Transform");
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var EventDispatcher_1 = require("../events/EventDispatcher");
var _util_1 = require("../../_util/_util");
var BlendMode_1 = require("./BlendMode");
var DisplayObject = (function (_super) {
    __extends(DisplayObject, _super);
    function DisplayObject(root, parent) {
        _super.call(this);
        this.blendMode = BlendMode_1.BlendMode.NORMAL;
        this.enabled = true;
        this.mask = null;
        this.visible = true;
        this._parent = null;
        this._root = null;
        this._name = "";
        this._rotation = 0;
        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleZ = 1;
        this._stage = null;
        this._height = 0;
        this._width = 0;
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._childIndex = -1;
        this._alpha = 1;
        this._filters = null;
        this._transform = null;
        this._rawRenderTarget = null;
        this._filteredRenderTarget = null;
        this._renderTargetWithAlpha = null;
        this._isRoot = false;
        this._root = root;
        this._stage = root;
        this._parent = parent;
        this._filters = [];
        this._transform = new Transform_1.Transform();
        if (root !== null) {
            this._rawRenderTarget = root.worldRenderer.createRenderTarget();
            this._renderTargetWithAlpha = root.worldRenderer.createRenderTarget();
        }
        this._isRoot = root === null;
    }
    Object.defineProperty(DisplayObject.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (v) {
            this._alpha = _util_1._util.limitInto(v, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "cacheAsBitmap", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        set: function (v) {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "childIndex", {
        get: function () {
            return this._childIndex;
        },
        // DO NOT call manually
        set: function (v) {
            this._childIndex = v;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype.dispose = function () {
        this._root.worldRenderer.releaseRenderTarget(this._renderTargetWithAlpha);
        this._root.worldRenderer.releaseRenderTarget(this._rawRenderTarget);
        this.filters = [];
    };
    Object.defineProperty(DisplayObject.prototype, "filters", {
        get: function () {
            return this._filters.slice();
        },
        set: function (v) {
            var i;
            var hasFiltersBefore = this.__shouldProcessFilters();
            if (hasFiltersBefore) {
                for (i = 0; i < this._filters.length; ++i) {
                    this._filters[i].notifyRemoved();
                }
            }
            this._filters = v;
            var hasFiltersNow = this.__shouldProcessFilters();
            if (hasFiltersNow) {
                for (i = 0; i < this._filters.length; ++i) {
                    this._filters[i].notifyAdded();
                }
            }
            if (hasFiltersBefore !== hasFiltersNow) {
                // Update filtered RenderTarget2D state.
                if (hasFiltersBefore) {
                    this._filteredRenderTarget.dispose();
                    this._filteredRenderTarget = null;
                }
                else if (hasFiltersNow) {
                    this._filteredRenderTarget = this._root.worldRenderer.createRenderTarget();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (v) {
            this._height = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "mouseX", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "mouseY", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (v) {
            this._name = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "root", {
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (v) {
            while (v < -180) {
                v += 360;
            }
            while (v > 180) {
                v -= 360;
            }
            this._rotation = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotationX", {
        get: function () {
            return this._rotationX;
        },
        set: function (v) {
            while (v < -180) {
                v += 360;
            }
            while (v > 180) {
                v -= 360;
            }
            this._rotationX = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotationY", {
        get: function () {
            return this._rotationY;
        },
        set: function (v) {
            while (v < -180) {
                v += 360;
            }
            while (v > 180) {
                v -= 360;
            }
            this._rotationY = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "rotationZ", {
        get: function () {
            return this._rotationZ;
        },
        set: function (v) {
            while (v < -180) {
                v += 360;
            }
            while (v > 180) {
                v -= 360;
            }
            this._rotationZ = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "transform", {
        get: function () {
            return this._transform;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (v) {
            this._width = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (v) {
            this._x = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            this._y = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "z", {
        get: function () {
            return this._z;
        },
        set: function (v) {
            this._z = v;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype.getBounds = function (targetCoordinateSpace) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    DisplayObject.prototype.getRect = function (targetCoordinateSpace) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    DisplayObject.prototype.update = function () {
        if (this.enabled) {
            this.__update();
        }
    };
    DisplayObject.prototype.render = function (renderer) {
        if (this.visible && this.alpha > 0) {
            this.__preprocess(renderer);
            this.__render(renderer);
            this.__postprocess(renderer);
        }
        else {
            this.outputRenderTarget.clear();
        }
    };
    Object.defineProperty(DisplayObject.prototype, "outputRenderTarget", {
        get: function () {
            return this.__shouldProcessFilters() ? this._filteredRenderTarget : this._rawRenderTarget;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObject.prototype.__preprocess = function (renderer) {
        var _this = this;
        var manager = renderer.shaderManager;
        this.__selectShader(manager);
        this._transform.matrix3D.setTransformTo(this.x, this.y, this.z);
        manager.currentShader.changeValue("uTransformMatrix", function (u) {
            u.value = _this._transform.matrix3D.toArray();
        });
        manager.currentShader.changeValue("uAlpha", function (u) {
            u.value = _this.alpha;
        });
        manager.currentShader.syncUniforms();
        renderer.setBlendMode(this.blendMode);
    };
    DisplayObject.prototype.__postprocess = function (renderer) {
        if (this.__shouldProcessFilters()) {
            var filterManager = renderer.filterManager;
            filterManager.pushFilterGroup(this.filters);
            filterManager.processFilters(renderer, this._rawRenderTarget, this._filteredRenderTarget, true);
            filterManager.popFilterGroup();
        }
    };
    DisplayObject.prototype.__shouldProcessFilters = function () {
        return this._filters !== null && this._filters.length > 0;
    };
    return DisplayObject;
})(EventDispatcher_1.EventDispatcher);
exports.DisplayObject = DisplayObject;

//# sourceMappingURL=DisplayObject.js.map