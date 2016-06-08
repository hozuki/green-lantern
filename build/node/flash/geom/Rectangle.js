/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
var Point_1 = require("./Point");
var Rectangle = (function () {
    function Rectangle(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this._x = 0;
        this._y = 0;
        this._w = 0;
        this._h = 0;
        this._x = x >= 0 ? x : 0;
        this._y = y >= 0 ? y : 0;
        this._w = width >= 0 ? width : 0;
        this._h = height >= 0 ? height : 0;
    }
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: function () {
            return this._y + this._h;
        },
        set: function (v) {
            if (v < this._y) {
                v = this._y;
            }
            this._h = v - this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        get: function () {
            return new Point_1.Point(this._x + this._w, this._y + this._h);
        },
        set: function (v) {
            this.right = v.x;
            this.bottom = v.y;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.clone = function () {
        return new Rectangle(this._x, this._y, this._w, this._h);
    };
    Rectangle.prototype.contains = function (x, y) {
        return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
    };
    Rectangle.prototype.containsPoint = function (point) {
        return this.contains(point.x, point.y);
    };
    Rectangle.prototype.containsRect = function (rect) {
        return this.containsPoint(rect.topLeft) && this.containsPoint(rect.bottomRight);
    };
    Rectangle.prototype.copyFrom = function (sourceRect) {
        this._x = sourceRect._x;
        this._y = sourceRect._y;
        this._w = sourceRect._w;
        this._h = sourceRect._h;
    };
    Rectangle.prototype.equals = function (toCompare) {
        return this._x == toCompare._x && this._y == toCompare._y && this._w == toCompare._w && this._h == toCompare._h;
    };
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return this._h;
        },
        set: function (v) {
            this._h = v >= 0 ? v : 0;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.inflate = function (dx, dy) {
        // TODO: bug when dx or dy is less than 0
        this.x -= dx;
        this.width += dx + dx;
        this.y -= dy;
        this.height += dy + dy;
    };
    Rectangle.prototype.inflatePoint = function (point) {
        this.inflate(point.x, point.y);
    };
    Rectangle.prototype.intersection = function (toIntersect) {
        var x;
        var y;
        var w;
        var h;
        var rect1;
        var rect2;
        if (this.left < toIntersect.left) {
            rect1 = this;
            rect2 = toIntersect;
        }
        else {
            rect1 = toIntersect;
            rect2 = this;
        }
        if (rect1.right < rect2.left) {
            return new Rectangle(); // Does not intersect
        }
        else {
            x = rect2.left;
            w = Math.min(rect1.right, rect2.right) - x;
        }
        if (this.top < toIntersect.top) {
            rect1 = this;
            rect2 = toIntersect;
        }
        else {
            rect1 = toIntersect;
            rect2 = this;
        }
        if (rect1.bottom < rect2.top) {
            return new Rectangle(); // Does not intersect
        }
        else {
            y = rect2.top;
            h = Math.min(rect1.bottom, rect2.bottom) - y;
        }
        return new Rectangle(x, y, w, h);
    };
    Rectangle.prototype.intersects = function (toIntersect) {
        var rect1;
        var rect2;
        if (this.left < toIntersect.left) {
            rect1 = this;
            rect2 = toIntersect;
        }
        else {
            rect1 = toIntersect;
            rect2 = this;
        }
        if (rect1.right < rect2.left) {
            return false;
        }
        if (this.top < toIntersect.top) {
            rect1 = this;
            rect2 = toIntersect;
        }
        else {
            rect1 = toIntersect;
            rect2 = this;
        }
        return rect1.bottom >= rect2.top;
    };
    Rectangle.prototype.isEmpty = function () {
        return this._w <= 0 || this._h <= 0;
    };
    Object.defineProperty(Rectangle.prototype, "left", {
        get: function () {
            return this._x;
        },
        set: function (v) {
            this._x = v >= 0 ? v : 0;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.offset = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };
    Rectangle.prototype.offsetPoint = function (point) {
        this.offset(point.x, point.y);
    };
    Object.defineProperty(Rectangle.prototype, "right", {
        get: function () {
            return this._x + this._w;
        },
        set: function (v) {
            if (v < this._x) {
                v = this._x;
            }
            this._w = v - this._x;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.setEmpty = function () {
        this._x = this._y = this._w = this._h = 0;
    };
    Rectangle.prototype.setTo = function (xa, ya, widtha, heighta) {
        this.x = xa;
        this.y = ya;
        this.width = widtha;
        this.height = heighta;
    };
    Object.defineProperty(Rectangle.prototype, "size", {
        get: function () {
            return new Point_1.Point(this._w, this._h);
        },
        set: function (v) {
            this._w = v.x;
            this._h = v.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "top", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            if (v > this._y + this._h) {
                v = this._y + this._h;
            }
            this._h = this._y + this._h - v;
            this._y = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        get: function () {
            return new Point_1.Point(this._x, this._y);
        },
        set: function (v) {
            this.left = v.x;
            this.top = v.y;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.toString = function () {
        return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
    };
    Rectangle.prototype.union = function (toUnion) {
        var x = Math.min(this.x, toUnion.x);
        var y = Math.min(this.y, toUnion.y);
        var r = Math.max(this.right, toUnion.right);
        var b = Math.max(this.bottom, toUnion.bottom);
        return new Rectangle(x, y, r - x, b - y);
    };
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return this._w;
        },
        set: function (v) {
            this._w = v >= 0 ? v : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (v) {
            this._x = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (v) {
            this._y = v;
        },
        enumerable: true,
        configurable: true
    });
    return Rectangle;
}());
exports.Rectangle = Rectangle;

//# sourceMappingURL=Rectangle.js.map
