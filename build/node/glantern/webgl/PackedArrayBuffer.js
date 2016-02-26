/**
 * Created by MIC on 2015/11/18.
 */
var GLUtil_1 = require("../../../lib/glantern-utils/src/GLUtil");
var gl = this.WebGLRenderingContext || window.WebGLRenderingContext;
var PackedArrayBuffer = (function () {
    function PackedArrayBuffer() {
        this._glc = null;
        this._isDirty = true;
        this._bufferType = 0;
        this._elementGLType = 0;
        this._webglBuffer = null;
        this._array = null;
        this._arrayType = null;
        this._typedArray = null;
    }
    PackedArrayBuffer.create = function (context, data, elementGLType, bufferType) {
        var T = PackedArrayBuffer.getTypedArrayType(elementGLType);
        if (T === null) {
            console.warn("Failed to create typed array whose elements are of WebGL type 0x" + elementGLType.toString(16));
            return null;
        }
        var wab = new PackedArrayBuffer();
        wab._glc = context;
        wab._elementGLType = elementGLType;
        wab._webglBuffer = context.createBuffer();
        if (wab._webglBuffer == null) {
            console.warn("Failed to create WebGL buffer.");
            return null;
        }
        wab._arrayType = T;
        wab._bufferType = bufferType;
        wab.setNewData(data);
        wab.becomeDirty();
        wab.syncBufferData();
        return wab;
    };
    Object.defineProperty(PackedArrayBuffer.prototype, "webglBuffer", {
        get: function () {
            return this._webglBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedArrayBuffer.prototype, "elementSize", {
        get: function () {
            return this._typedArray.BYTES_PER_ELEMENT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedArrayBuffer.prototype, "elementCount", {
        get: function () {
            return this._typedArray.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedArrayBuffer.prototype, "elementGLType", {
        get: function () {
            return this._elementGLType;
        },
        enumerable: true,
        configurable: true
    });
    PackedArrayBuffer.prototype.setNewData = function (data) {
        if (GLUtil_1.GLUtil.isUndefinedOrNull(data)) {
            this._array = [];
        }
        else {
            this._array = data.slice();
        }
    };
    PackedArrayBuffer.prototype.becomeDirty = function () {
        this._isDirty = true;
    };
    PackedArrayBuffer.prototype.syncBufferData = function () {
        if (this._isDirty) {
            var T = this._arrayType;
            this._typedArray = new T(this._array);
            this._isDirty = false;
        }
        this._glc.bindBuffer(this._bufferType, this._webglBuffer);
        // DANGER! In complex scenes, bufferData() transfers large amount of data.
        // Improper optimization does harm on performance.
        this._glc.bufferData(this._bufferType, this._typedArray, gl.DYNAMIC_DRAW);
    };
    PackedArrayBuffer.prototype.dispose = function () {
        this._glc.deleteBuffer(this._webglBuffer);
        this._array = null;
        this._typedArray = null;
        this._webglBuffer = null;
        this._glc = null;
    };
    PackedArrayBuffer.getTypedArrayType = function (glType) {
        switch (glType) {
            case gl.FLOAT:
                return Float32Array;
            case gl.UNSIGNED_SHORT:
                return Uint16Array;
            case gl.UNSIGNED_INT:
                return Uint32Array;
            case gl.UNSIGNED_BYTE:
                return Uint8Array;
            case gl.INT:
                return Int32Array;
            case gl.SHORT:
                return Int16Array;
            case gl.BYTE:
                return Int8Array;
            default:
                return null;
        }
    };
    return PackedArrayBuffer;
})();
exports.PackedArrayBuffer = PackedArrayBuffer;

//# sourceMappingURL=PackedArrayBuffer.js.map
