/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var Point_1 = require("./Point");
var NotImplementedError_1 = require("../../flash/errors/NotImplementedError");
var Matrix = (function () {
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 1; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this._data = [a, c, tx, b, d, ty, 0, 0, 1];
    }
    Object.defineProperty(Matrix.prototype, "a", {
        get: function () {
            return this._data[0];
        },
        set: function (v) {
            this._data[0] = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "b", {
        get: function () {
            return this._data[3];
        },
        set: function (v) {
            this._data[3] = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "c", {
        get: function () {
            return this._data[1];
        },
        set: function (v) {
            this._data[1] = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "d", {
        get: function () {
            return this._data[4];
        },
        set: function (v) {
            this._data[4] = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "tx", {
        get: function () {
            return this._data[2];
        },
        set: function (v) {
            this._data[2] = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "ty", {
        get: function () {
            return this._data[5];
        },
        set: function (v) {
            this._data[5] = v;
        },
        enumerable: true,
        configurable: true
    });
    Matrix.prototype.clone = function () {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };
    Matrix.prototype.concat = function (m) {
        this._data = Matrix.dotProduct(this._data, m._data);
    };
    Matrix.prototype.copyColumnFrom = function (column, vector3D) {
        if (column < 0 || column > 2) {
            throw new RangeError('Column must be 0, 1, or 2.');
        }
        this._data[column * 3] = vector3D.x;
        this._data[1 + column * 3] = vector3D.y;
        this._data[2 + column * 3] = vector3D.z;
    };
    Matrix.prototype.copyColumnTo = function (column, vector3D) {
        if (column < 0 || column > 2) {
            throw new RangeError('Column must be 0, 1, or 2.');
        }
        vector3D.x = this._data[column * 3];
        vector3D.y = this._data[1 + column * 3];
        vector3D.z = this._data[2 + column * 3];
    };
    Matrix.prototype.copyFrom = function (sourceMatrix) {
        this._data = sourceMatrix._data.slice();
    };
    Matrix.prototype.copyRowFrom = function (row, vector3D) {
        if (row < 0 || row > 2) {
            throw new RangeError('Row must be 0, 1, or 2.');
        }
        this._data[row] = vector3D.x;
        this._data[row + 3] = vector3D.y;
        this._data[row + 6] = vector3D.z;
    };
    Matrix.prototype.copyRowTo = function (row, vector3D) {
        if (row < 0 || row > 2) {
            throw new RangeError('Column must be 0, 1, or 2.');
        }
        vector3D.x = this._data[row];
        vector3D.y = this._data[3 + row];
        vector3D.z = this._data[6 + row];
    };
    Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
        if (rotation === void 0) { rotation = 0; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.identity();
        this.rotate(rotation);
        this.scale(scaleX, scaleY);
        this.translate(tx, ty);
    };
    Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
        if (rotation === void 0) { rotation = 0; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.createBox(width, height, rotation, tx, ty);
    };
    Matrix.prototype.deltaTransformPoint = function (point) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Matrix.prototype.identity = function () {
        this._data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    };
    Matrix.prototype.invert = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Matrix.prototype.rotate = function (angle) {
        this._data = Matrix.dotProduct(this._data, [
            Math.cos(angle), -Math.sin(angle), 0,
            Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1
        ]);
    };
    Matrix.prototype.scale = function (sx, sy) {
        this._data = Matrix.dotProduct(this._data, [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]);
    };
    Matrix.prototype.skew = function (skewX, skewY) {
        this._data = Matrix.dotProduct(this._data, [
            0, Math.tan(skewX), 0,
            Math.tan(skewY), 0, 0,
            0, 0, 1
        ]);
    };
    Matrix.prototype.setTo = function (aa, ba, ca, da, txa, tya) {
        this._data = [aa, ca, txa, ba, da, tya, 0, 0, 1];
    };
    Matrix.prototype.toString = function () {
        return "[" + this.a + " " + this.b + " 0\r\n" + this.c + " " + this.d + " 0\r\n" + this.tx + " " + this.ty + " 1]";
    };
    Matrix.prototype.transformPoint = function (point) {
        // 由于 Flash 所用的矩阵是转置过的，所以这里变成了行×行
        //var pointVector = [point.x, point.y, 1];
        //var x = pointVector[0] * this._data[0] + pointVector[1] * this._data[1] + pointVector[2] * this._data[2];
        //var y = pointVector[0] * this._data[3] + pointVector[1] * this._data[4] + pointVector[2] * this._data[5];
        //return new Point(x, y);
        return new Point_1.Point(point.x * this._data[0] + point.y * this._data[1] + this._data[2], point.x * this._data[3] + point.y * this._data[4] + this._data[5]);
    };
    Matrix.prototype.translate = function (dx, dy) {
        this.tx += dx;
        this.ty += dy;
    };
    Matrix.dotProduct = function (a, b) {
        if (b.length != 9) {
            throw new Error('Matrix dot product requires a 3x3 matrix.');
        }
        var result = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    result[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
                }
            }
        }
        return result;
    };
    return Matrix;
}());
exports.Matrix = Matrix;

//# sourceMappingURL=Matrix.js.map
