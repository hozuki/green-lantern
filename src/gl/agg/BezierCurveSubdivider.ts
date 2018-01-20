import MathUtil from "../mic/MathUtil";
import AggUtils from "./AggUtils";
import ApplicationError from "../flash/errors/ApplicationError";

abstract class BezierCurveSubdivider {

    static divide(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number,
                  distanceTolerance: number = BezierCurveSubdivider.distanceTolerance,
                  angleTolerance: number = BezierCurveSubdivider.angleTolerance): number[] {
        const points: number[] = [];
        const distSquared = distanceTolerance * distanceTolerance;

        points.push(x1, y1);
        BezierCurveSubdivider.__recursiveBezier(x1, y1, x2, y2, x3, y3, x4, y4, 0, distSquared, angleTolerance, points);
        points.push(x4, y4);

        return points;
    }

    static get distanceTolerance(): number {
        return 10;
    }

    static get angleTolerance(): number {
        return MathUtil.toRadians(30);
    }

    private static __recursiveBezier(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, level: number,
                                     distanceToleranceSquared: number, angleTolerance: number, points: number[]): void {
        if (level > AggUtils.bezierRecursionLimit) {
            return;
        }

        const x12 = (x1 + x2) / 2;
        const y12 = (y1 + y2) / 2;
        const x23 = (x2 + x3) / 2;
        const y23 = (y2 + y3) / 2;
        const x34 = (x3 + x4) / 2;
        const y34 = (y3 + y4) / 2;
        const x123 = (x12 + x23) / 2;
        const y123 = (y12 + y23) / 2;
        const x234 = (x23 + x34) / 2;
        const y234 = (y23 + y34) / 2;

        const dx = x4 - x1;
        const dy = y4 - y1;

        let d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx);
        let d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx);
        let da1: number, da2: number, k: number;

        const sw = ((d2 > AggUtils.bezierCollinearityEpsilon ? 1 : 0) << 1) | (d3 > AggUtils.bezierCollinearityEpsilon ? 1 : 0);
        switch (sw) {
            case 0: {
                k = dx * dx + dy * dy;
                if (k == 0) {
                    d2 = MathUtil.distanceSquared(x1, y1, x2, y2);
                    d3 = MathUtil.distanceSquared(x4, y4, x3, y3);
                }
                else {
                    k = 1 / k;
                    da1 = x2 - x1;
                    da2 = y2 - y1;
                    d2 = k * (da1 * dx + da2 * dy);
                    da1 = x3 - x1;
                    da2 = y3 - y1;
                    d3 = k * (da1 * dx + da2 * dy);
                    if (d2 > 0 && d2 < 1 && d3 > 0 && d3 < 1) {
                        // Simple collinear case, 1---2---3---4
                        // We can leave just two endpoints
                        return;
                    }
                    if (d2 <= 0) {
                        d2 = MathUtil.distanceSquared(x2, y2, x1, y1);
                    } else if (d2 >= 1) {
                        d2 = MathUtil.distanceSquared(x2, y2, x4, y4);
                    } else {
                        d2 = MathUtil.distanceSquared(x2, y2, x1 + d2 * dx, y1 + d2 * dy);
                    }

                    if (d3 <= 0) {
                        d3 = MathUtil.distanceSquared(x3, y3, x1, y1);
                    } else if (d3 >= 1) {
                        d3 = MathUtil.distanceSquared(x3, y3, x4, y4);
                    } else {
                        d3 = MathUtil.distanceSquared(x3, y3, x1 + d3 * dx, y1 + d3 * dy);
                    }
                }
                if (d2 > d3) {
                    if (d2 < distanceToleranceSquared) {
                        points.push(x2, y2);
                        return;
                    }
                }
                else {
                    if (d3 < distanceToleranceSquared) {
                        points.push(x3, y3);
                        return;
                    }
                }
                break;
            }
            case 1: {
                if (d3 * d3 <= distanceToleranceSquared * (dx * dx + dy * dy)) {
                    if (angleTolerance < AggUtils.bezierAngleToleranceEpsilon) {
                        points.push(x23, y23);
                        return;
                    }

                    // Angle Condition
                    //----------------------
                    da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
                    if (da1 >= Math.PI) {
                        da1 = 2 * Math.PI - da1;
                    }

                    if (da1 < angleTolerance) {
                        points.push(x2, y2);
                        points.push(x3, y3);
                        return;
                    }
                }
                break;
            }
            case 2: {
                if (d2 * d2 <= distanceToleranceSquared * (dx * dx + dy * dy)) {
                    if (angleTolerance < AggUtils.bezierAngleToleranceEpsilon) {
                        points.push(x23, y23);
                        return;
                    }

                    // Angle Condition
                    //----------------------
                    da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                    if (da1 >= Math.PI) {
                        da1 = 2 * Math.PI - da1;
                    }

                    if (da1 < angleTolerance) {
                        points.push(x2, y2);
                        points.push(x3, y3);
                        return;
                    }
                }
                break;
            }
            case 3: {
                if ((d2 + d3) * (d2 + d3) <= distanceToleranceSquared * (dx * dx + dy * dy)) {
                    // If the curvature doesn't exceed the distance_tolerance value
                    // we tend to finish subdivisions.
                    //----------------------
                    if (angleTolerance < AggUtils.bezierAngleToleranceEpsilon) {
                        points.push(x23, y23);
                        return;
                    }

                    // Angle & Cusp Condition
                    //----------------------
                    k = Math.atan2(y3 - y2, x3 - x2);
                    da1 = Math.abs(k - Math.atan2(y2 - y1, x2 - x1));
                    da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - k);
                    if (da1 >= Math.PI) {
                        da1 = 2 * Math.PI - da1;
                    }
                    if (da2 >= Math.PI) {
                        da2 = 2 * Math.PI - da2;
                    }

                    if (da1 + da2 < angleTolerance) {
                        // Finally we can stop the recursion
                        //----------------------
                        points.push(x23, y23);
                        return;
                    }
                }
                break;
            }
            default:
                throw new ApplicationError();
        }

        const x1234 = (x123 + x234) / 2;
        const y1234 = (y123 + y234) / 2;

        BezierCurveSubdivider.__recursiveBezier(x1, y1, x12, y12, x123, y123, x1234, y1234,
            level + 1, distanceToleranceSquared, angleTolerance, points);
        BezierCurveSubdivider.__recursiveBezier(x1234, y1234, x234, y234, x34, y34, x4, y4,
            level + 1, distanceToleranceSquared, angleTolerance, points);
    }

}

export default BezierCurveSubdivider;
