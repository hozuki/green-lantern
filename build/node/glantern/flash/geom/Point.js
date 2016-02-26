/**
 * Created by MIC on 2015/11/18.
 */
var GLUtil_1 = require("../../../../lib/glantern-utils/src/GLUtil");
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (v) {
        return new Point(this.x + v.x, this.y + v.y);
    };
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.copyFrom = function (sourcePoint) {
        this.x = sourcePoint.x;
        this.y = sourcePoint.y;
    };
    Point.distance = function (pt1, pt2) {
        return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
    };
    Point.prototype.equals = function (toCompare) {
        return this.x === toCompare.x && this.y === toCompare.y;
    };
    Point.interpolate = function (pt1, pt2, f) {
        f = GLUtil_1.GLUtil.limitInto(f, 0, 1);
        return new Point(pt1.x * f + pt2.x * (1 - f), pt1.y * f + pt2.y * (1 - f));
    };
    Object.defineProperty(Point.prototype, "length", {
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        enumerable: true,
        configurable: true
    });
    Point.prototype.normalize = function (thickness) {
        var len = this.length;
        if (len > 0) {
            this.x *= thickness / len;
            this.y *= thickness / len;
        }
    };
    Point.prototype.offset = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };
    Point.polar = function (len, angle) {
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    };
    Point.prototype.setTo = function (xa, ya) {
        this.x = xa;
        this.y = ya;
    };
    Point.prototype.subtract = function (v) {
        return new Point(this.x - v.x, this.y - v.y);
    };
    Point.prototype.toString = function () {
        return "(X=" + this.x + ", y=" + this.y + ")";
    };
    return Point;
})();
exports.Point = Point;

//# sourceMappingURL=Point.js.map
