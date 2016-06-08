/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Transform_1 = require("../geom/Transform");
var EventDispatcher_1 = require("../events/EventDispatcher");
var BlendMode_1 = require("./BlendMode");
var Matrix3D_1 = require("../geom/Matrix3D");
var Vector3D_1 = require("../geom/Vector3D");
var NotImplementedError_1 = require("../../flash/errors/NotImplementedError");
var GLUtil_1 = require("../../GLUtil");
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
        this._filterTarget = null;
        this._transform = null;
        this._isTransformDirty = true;
        this._isRoot = false;
        this._root = root;
        this._stage = root;
        this._parent = parent;
        this._filters = [];
        this._transform = new Transform_1.Transform();
        this._isRoot = root === null;
    }
    Object.defineProperty(DisplayObject.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (v) {
            this._alpha = GLUtil_1.GLUtil.limitInto(v, 0, 1);
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
        _super.prototype.dispose.call(this);
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
            if (hasFiltersNow !== hasFiltersBefore) {
                if (hasFiltersNow) {
                    this.__createFilterTarget(this._root.worldRenderer);
                }
                else {
                    this.__releaseFilterTarget();
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
            var b = this._x !== v;
            this._x = v;
            if (b) {
                this.requestUpdateTransform();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            var b = this._y !== v;
            this._y = v;
            if (b) {
                this.requestUpdateTransform();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObject.prototype, "z", {
        get: function () {
            return this._z;
        },
        set: function (v) {
            var b = this._z !== v;
            this._z = v;
            if (b) {
                this.requestUpdateTransform();
            }
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
        if (this._isTransformDirty) {
            this.__updateTransform();
        }
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
        }
    };
    DisplayObject.prototype.requestUpdateTransform = function () {
        this._isTransformDirty = true;
    };
    DisplayObject.prototype.__updateTransform = function () {
        var matrix3D;
        if (this._isRoot) {
            matrix3D = new Matrix3D_1.Matrix3D();
        }
        else {
            matrix3D = this.parent.transform.matrix3D.clone();
        }
        matrix3D.prependTranslation(this.x, this.y, this.z);
        matrix3D.prependRotation(this.rotationX, Vector3D_1.Vector3D.X_AXIS);
        matrix3D.prependRotation(this.rotationY, Vector3D_1.Vector3D.Y_AXIS);
        matrix3D.prependRotation(this.rotationZ, Vector3D_1.Vector3D.Z_AXIS);
        this.transform.matrix3D.copyFrom(matrix3D);
    };
    DisplayObject.prototype.__preprocess = function (renderer) {
        var _this = this;
        if (this.__shouldProcessFilters()) {
            this._filterTarget.clear();
            renderer.setRenderTarget(this._filterTarget);
        }
        else {
            renderer.setRenderTarget(null);
        }
        var manager = renderer.shaderManager;
        this.__selectShader(manager);
        var shader = manager.currentShader;
        if (!GLUtil_1.GLUtil.isUndefinedOrNull(shader)) {
            shader.changeValue("uTransformMatrix", function (u) {
                u.value = _this.transform.matrix3D.toArray();
            });
            shader.changeValue("uAlpha", function (u) {
                u.value = _this.alpha;
            });
        }
        renderer.setBlendMode(this.blendMode);
    };
    DisplayObject.prototype.__postprocess = function (renderer) {
        if (this.__shouldProcessFilters()) {
            var filterManager = renderer.filterManager;
            filterManager.pushFilterGroup(this.filters);
            filterManager.processFilters(renderer, this._filterTarget, renderer.screenTarget, false);
            filterManager.popFilterGroup();
        }
    };
    DisplayObject.prototype.__createFilterTarget = function (renderer) {
        if (this._filterTarget !== null) {
            return;
        }
        this._filterTarget = renderer.createRenderTarget();
    };
    DisplayObject.prototype.__releaseFilterTarget = function () {
        if (this._filterTarget === null) {
            return;
        }
        this._root.worldRenderer.releaseRenderTarget(this._filterTarget);
        this._filterTarget = null;
    };
    DisplayObject.prototype.__shouldProcessFilters = function () {
        return this.filters !== null && this.filters.length > 0;
    };
    return DisplayObject;
}(EventDispatcher_1.EventDispatcher));
exports.DisplayObject = DisplayObject;

//# sourceMappingURL=DisplayObject.js.map
