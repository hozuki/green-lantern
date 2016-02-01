/**
 * Created by MIC on 2015/11/18.
 */
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var Point_1 = require("./Point");
var _util_1 = require("../../_util/_util");
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
            this._fieldOfView = _util_1._util.limitInto(v, 0, 180);
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
