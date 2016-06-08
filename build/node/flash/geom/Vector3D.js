/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var GLUtil_1 = require("../../GLUtil");
var Vector3D = (function () {
    function Vector3D(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        this.w = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Object.defineProperty(Vector3D, "X_AXIS", {
        get: function () {
            return new Vector3D(1, 0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3D, "Y_AXIS", {
        get: function () {
            return new Vector3D(0, 1, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3D, "Z_AXIS", {
        get: function () {
            return new Vector3D(0, 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3D, "ORIGIN", {
        get: function () {
            return new Vector3D(0, 0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3D.prototype, "length", {
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3D.prototype, "lengthSquared", {
        get: function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        enumerable: true,
        configurable: true
    });
    Vector3D.prototype.add = function (a) {
        return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w);
    };
    Vector3D.angleBetween = function (a, b) {
        var mulNom = a.x * b.x + a.y * b.y + a.z * b.z;
        var den = a.length * b.length;
        var val = Math.sqrt(mulNom * mulNom / den);
        return Math.acos(val);
    };
    Vector3D.prototype.clone = function () {
        return new Vector3D(this.x, this.y, this.z, this.w);
    };
    Vector3D.prototype.copyFrom = function (a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        this.w = a.w;
    };
    Vector3D.prototype.crossProduct = function (a) {
        var i = this.y * a.z - this.z * a.y;
        var j = this.z * a.x - this.x * a.z;
        var k = this.x * a.y - this.y * a.x;
        return new Vector3D(i, j, k, this.w);
    };
    Vector3D.prototype.decrementBy = function (a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    };
    Vector3D.distance = function (pt1, pt2) {
        return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) + (pt1.z - pt2.z) * (pt1.z - pt2.z));
    };
    Vector3D.prototype.dotProduct = function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    };
    Vector3D.prototype.equals = function (toCompare, allFour) {
        if (allFour === void 0) { allFour = false; }
        return this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.y && !(allFour && this.w != toCompare.w);
    };
    Vector3D.prototype.incrementBy = function (a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    };
    Vector3D.prototype.nearEquals = function (toCompare, tolerance, allFour) {
        if (allFour === void 0) { allFour = false; }
        return GLUtil_1.GLUtil.isValueBetweenNotEquals(this.x, toCompare.x - tolerance, toCompare.x + tolerance) &&
            GLUtil_1.GLUtil.isValueBetweenNotEquals(this.y, toCompare.y - tolerance, toCompare.y + tolerance) &&
            GLUtil_1.GLUtil.isValueBetweenNotEquals(this.z, toCompare.z - tolerance, toCompare.z + tolerance) && !(allFour && !GLUtil_1.GLUtil.isValueBetweenNotEquals(this.w, toCompare.w - tolerance, toCompare.w + tolerance));
    };
    Vector3D.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    };
    Vector3D.prototype.normalize = function () {
        var len = this.length;
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return len;
    };
    Vector3D.prototype.project = function () {
        if (this.w != null && this.w != 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
        }
    };
    Vector3D.prototype.scaleBy = function (s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    };
    Vector3D.prototype.setTo = function (xa, ya, za) {
        this.x = xa;
        this.y = ya;
        this.z = za;
    };
    Vector3D.prototype.subtract = function (a) {
        return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z, this.w);
    };
    Vector3D.prototype.toString = function () {
        return "[x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", w=" + this.w + "]";
    };
    return Vector3D;
}());
exports.Vector3D = Vector3D;

//# sourceMappingURL=Vector3D.js.map
