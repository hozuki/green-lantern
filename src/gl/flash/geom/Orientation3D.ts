/**
 * Created by MIC on 2015/11/18.
 */

abstract class Orientation3D {

    static get AXIS_ANGLE(): string {
        return "axisAngle";
    }

    static get EULER_ANGLES(): string {
        return "eulerAngles";
    }

    static get QUATERNION(): string {
        return "quaternion";
    }

}

export default Orientation3D;
