/**
 * Created by MIC on 2015/11/18.
 */
var Point_1 = require("./Point");
var NotImplementedError_1 = require("../../../lib/glantern-utils/src/NotImplementedError");
var GLUtil_1 = require("../../../lib/glantern-utils/src/GLUtil");
var PerspectiveProjection = (function () {
    function PerspectiveProjection() {
        this.focalLength = 10;
        this.projectionCenter = null;
        this._fieldOfView = 90;
        this.projectionCenter = new Point_1.Point();
    }
    Object.defineProperty(PerspectiveProjection.prototype, "fieldOfView", {
        get: function () {
            return this._fieldOfView;
        },
        set: function (v) {
            this._fieldOfView = GLUtil_1.GLUtil.limitInto(v, 0, 180);
        },
        enumerable: true,
        configurable: true
    });
    PerspectiveProjection.prototype.toMatrix3D = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return PerspectiveProjection;
})();
exports.PerspectiveProjection = PerspectiveProjection;

//# sourceMappingURL=PerspectiveProjection.js.map
