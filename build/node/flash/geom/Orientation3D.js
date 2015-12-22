/**
 * Created by MIC on 2015/11/18.
 */
var Orientation3D = (function () {
    function Orientation3D() {
    }
    Object.defineProperty(Orientation3D, "AXIS_ANGLE", {
        get: function () {
            return "axisAngle";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Orientation3D, "EULER_ANGLES", {
        get: function () {
            return "eulerAngles";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Orientation3D, "QUATERNION", {
        get: function () {
            return "quaternion";
        },
        enumerable: true,
        configurable: true
    });
    return Orientation3D;
})();
exports.Orientation3D = Orientation3D;

//# sourceMappingURL=Orientation3D.js.map
