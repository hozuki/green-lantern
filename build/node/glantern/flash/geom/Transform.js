/**
 * Created by MIC on 2015/11/18.
 */
var Matrix3D_1 = require("./Matrix3D");
var ColorTransform_1 = require("./ColorTransform");
var Matrix_1 = require("./Matrix");
var PerspectiveProjection_1 = require("./PerspectiveProjection");
var NotImplementedError_1 = require("../../../../lib/glantern-utils/src/NotImplementedError");
var Transform = (function () {
    function Transform() {
        this.colorTransform = null;
        this.matrix = null;
        this.matrix3D = null;
        this.perspectiveProjection = null;
        this._pixelBounds = null;
        this.matrix = new Matrix_1.Matrix();
        this.matrix3D = new Matrix3D_1.Matrix3D();
        this.colorTransform = new ColorTransform_1.ColorTransform();
        this.perspectiveProjection = new PerspectiveProjection_1.PerspectiveProjection();
    }
    Object.defineProperty(Transform.prototype, "concatenatedColorTransform", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "concatenatedMatrix", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "pixelBounds", {
        get: function () {
            return this._pixelBounds;
        },
        enumerable: true,
        configurable: true
    });
    Transform.prototype.getRelativeMatrix3D = function (relativeTo) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return Transform;
})();
exports.Transform = Transform;

//# sourceMappingURL=Transform.js.map
