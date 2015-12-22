/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InteractiveObject_1 = require("./InteractiveObject");
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var ShaderID_1 = require("../../webgl/ShaderID");
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer(root, parent) {
        _super.call(this, root, parent);
        this.mouseChildren = true;
        this.tabChildren = true;
        this._children = null;
        this._children = [];
    }
    Object.defineProperty(DisplayObjectContainer.prototype, "numChildren", {
        get: function () {
            return this._children.length;
        },
        enumerable: true,
        configurable: true
    });
    DisplayObjectContainer.prototype.addChild = function (child) {
        if (this._children.indexOf(child) < 0) {
            this._children.push(child);
        }
        child.childIndex = this._children.length - 1;
        return child;
    };
    DisplayObjectContainer.prototype.addChildAt = function (child, index) {
        if (this._children.indexOf(child) < 0) {
            this._children = this._children.slice(0, index - 1).concat(child).concat(this._children.slice(index, this._children.length - 1));
        }
        child.childIndex = index;
        return child;
    };
    DisplayObjectContainer.prototype.areInaccessibleObjectsUnderPoint = function (point) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    DisplayObjectContainer.prototype.contains = function (child) {
        var result = false;
        for (var i = 0; i < this._children.length; ++i) {
            if (this._children[i] === child) {
                return true;
            }
            if (this._children[i] instanceof DisplayObjectContainer) {
                result = this._children[i].contains(child);
                if (result) {
                    return true;
                }
            }
        }
        return false;
    };
    DisplayObjectContainer.prototype.getChildAt = function (index) {
        if (index < 0 || index > this._children.length - 1) {
            return null;
        }
        else {
            return this._children[index];
        }
    };
    DisplayObjectContainer.prototype.getChildByName = function (name) {
        if (this._children.length === 0) {
            return null;
        }
        var result = null;
        for (var i = 0; i < this._children.length; ++i) {
            if (this._children[i].name === name) {
                return this._children[i];
            }
            if (this._children[i] instanceof DisplayObjectContainer) {
                result = this._children[i].getChildByName(name);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    };
    DisplayObjectContainer.prototype.getChildIndex = function (child) {
        return this._children.indexOf(child);
    };
    DisplayObjectContainer.prototype.getObjectsUnderPoint = function (point) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        if (this._children.indexOf(child) >= 0) {
            var childIndex = child.childIndex;
            return this.removeChildAt(childIndex);
        }
        else {
            return null;
        }
    };
    DisplayObjectContainer.prototype.removeChildAt = function (index) {
        if (index < 0 || index >= this.numChildren) {
            return null;
        }
        var child = this._children[index];
        for (var i = index + 1; i < this._children.length; i++) {
            this._children[i].childIndex++;
        }
        this._children.splice(index, 1);
        return child;
    };
    DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    DisplayObjectContainer.prototype.swapChildren = function (child1, child2) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    DisplayObjectContainer.prototype.swapChildrenAt = function (index1, index2) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Object.defineProperty(DisplayObjectContainer.prototype, "width", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        set: function (v) {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayObjectContainer.prototype, "height", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        set: function (v) {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    DisplayObjectContainer.prototype.dispatchEvent = function (event, data) {
        var r = _super.prototype.dispatchEvent.call(this, event, data);
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].dispatchEvent(event, data);
        }
        return r;
    };
    DisplayObjectContainer.prototype.update = function () {
        if (this.enabled) {
            _super.prototype.update.call(this);
            for (var i = 0; i < this._children.length; ++i) {
                this._children[i].update();
            }
        }
    };
    DisplayObjectContainer.prototype.render = function (renderer) {
        if (this.visible && this.alpha > 0) {
            this.__preprocess(renderer);
            this.__render(renderer);
            for (var i = 0; i < this._children.length; ++i) {
                var child = this._children[i];
                child.render(renderer);
                renderer.copyRenderTargetContent(child.outputRenderTarget, this._rawRenderTarget, false);
            }
            this.__postprocess(renderer);
        }
        else {
            this.outputRenderTarget.clear();
        }
    };
    DisplayObjectContainer.prototype.__selectShader = function (shaderManager) {
        shaderManager.selectShader(ShaderID_1.ShaderID.REPLICATE);
    };
    return DisplayObjectContainer;
})(InteractiveObject_1.InteractiveObject);
exports.DisplayObjectContainer = DisplayObjectContainer;

//# sourceMappingURL=DisplayObjectContainer.js.map
