import MathUtil from "../mic/MathUtil";
import AggUtils from "./AggUtils";

abstract class QuadraticBezierCurveSubdivider {

    static divide(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
                  distanceTolerance: number = QuadraticBezierCurveSubdivider.distanceTolerance,
                  angleTolerance: number = QuadraticBezierCurveSubdivider.angleTolerance): number[] {
        const points: number[] = [];
        const distSquared = distanceTolerance * distanceTolerance;

        points.push(x1, y1);
        QuadraticBezierCurveSubdivider.__recursiveBezier(x1, y1, x2, y2, x3, y3, 0, distSquared, angleTolerance, points);
        points.push(x3, y3);

        return points;
    }

    static get distanceTolerance(): number {
        return 10;
    }

    static get angleTolerance(): number {
        return MathUtil.toRadians(30);
    }

    private static __recursiveBezier(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, level: number,
                                     distanceToleranceSquared: number, angleTolerance: number, points: number[]): void {
        if (level > AggUtils.bezierRecursionLimit) {
            return;
        }

        // Calculate all the mid-points of the line segments
        //----------------------
        const x12 = (x1 + x2) / 2;
        const y12 = (y1 + y2) / 2;
        const x23 = (x2 + x3) / 2;
        const y23 = (y2 + y3) / 2;
        const x123 = (x12 + x23) / 2;
        const y123 = (y12 + y23) / 2;

        const dx = x3 - x1;
        const dy = y3 - y1;
        let d = Math.abs((x2 - x3) * dy - (y2 - y3) * dx);
        let da: number;

        if (d > AggUtils.bezierCollinearityEpsilon) {
            // Regular case
            //-----------------
            if (d * d <= distanceToleranceSquared * (dx * dx + dy * dy)) {
                // If the curvature doesn't exceed the distance_tolerance value
                // we tend to finish subdivisions.
                //----------------------
                if (angleTolerance < AggUtils.bezierAngleToleranceEpsilon) {
                    points.push(x123, y123);
                    return;
                }

                // Angle & Cusp Condition
                //----------------------
                da = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                if (da >= Math.PI) {
                    da = 2 * Math.PI - da;
                }

                if (da < angleTolerance) {
                    // Finally we can stop the recursion
                    //----------------------
                    points.push(x123, y123);
                    return;
                }
            }
        }
        else {
            // Collinear case
            //------------------
            da = dx * dx + dy * dy;
            if (da == 0) {
                d = MathUtil.distanceSquared(x1, y1, x2, y2);
            }
            else {
                d = ((x2 - x1) * dx + (y2 - y1) * dy) / da;
                if (d > 0 && d < 1) {
                    // Simple collinear case, 1---2---3
                    // We can leave just two endpoints
                    return;
                }
                if (d <= 0) {
                    d = MathUtil.distanceSquared(x2, y2, x1, y1);
                } else if (d >= 1) {
                    d = MathUtil.distanceSquared(x2, y2, x3, y3);
                } else {
                    d = MathUtil.distanceSquared(x2, y2, x1 + d * dx, y1 + d * dy);
                }
            }
            if (d < distanceToleranceSquared) {
                points.push(x2, y2);
                return;
            }
        }

        // Continue subdivision
        //----------------------
        QuadraticBezierCurveSubdivider.__recursiveBezier(x1, y1, x12, y12, x123, y123,
            level + 1, distanceToleranceSquared, angleTolerance, points);
        QuadraticBezierCurveSubdivider.__recursiveBezier(x123, y123, x23, y23, x3, y3,
            level + 1, distanceToleranceSquared, angleTolerance, points);
    }

}

export default QuadraticBezierCurveSubdivider;
