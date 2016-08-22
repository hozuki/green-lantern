/**
 * Created by MIC on 2016/7/16.
 */

import {Rectangle} from "../../../../gl/flash/geom/Rectangle";
import Assert from "../../Assert";

export function shouldIntersect(): boolean {
    /* Rectangle.intersects() - should intersect: (0,0,100,100)-(-10,-10,20,20) */
    var r1 = new Rectangle(0, 0, 100, 100), r2 = new Rectangle(-10, -10, 20, 20);
    var result = r1.intersects(r2);
    return Assert.areEqual(result, true);
}

export function shouldNotIntersect(): boolean {
    /* Rectangle.intersects() - should not intersect: (14.2,13.2,0,4)-(0,0,2,3) */
    var r1 = new Rectangle(14.2, 13.2, 0, 4), r2 = new Rectangle(0, 0, 2, 3);
    var result = r1.intersects(r2);
    return Assert.areEqual(result, false);
}

export function shouldIntersectStrict1(): boolean {
    /* Rectangle.testIntersection() - should intersect when two edges contact: (0,0,10,10)-(5,10,3,3) */
    var r1 = new Rectangle(0, 0, 10, 10), r2 = new Rectangle(5, 10, 3, 3);
    var result = Rectangle.testIntersection(r1, r2, true);
    return Assert.areEqual(result, true);
}

export function shouldIntersectStrict2(): boolean {
    /* Rectangle.testIntersection() - should intersect when two corners contact: (0,0,10,10)-(10,10,3,3) */
    var r1 = new Rectangle(0, 0, 10, 10), r2 = new Rectangle(10, 10, 3, 3);
    var result = Rectangle.testIntersection(r1, r2, true);
    return Assert.areEqual(result, true);
}
