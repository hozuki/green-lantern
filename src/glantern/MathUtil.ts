/**
 * Created by MIC on 2016/6/11.
 */

export abstract class MathUtil {

    /**
     * Limit a number inside a range specified by min and max (both are reachable).
     * @param v {Number} The number to limit.
     * @param min {Number} The lower bound. Numbers strictly less than this bound will be set to the value.
     * @param max {Number} The upper bound. Numbers strictly greater than this bound will be set to this value.
     * @returns {Number} The limited value. If the original number is inside the specified range, it will not be
     * altered. Otherwise, it will be either min or max.
     */
    static limitInto(v:number, min:number, max:number):number {
        v < min && (v = min);
        v > max && (v = max);
        return v;
    }

    /**
     * Check whether a number is inside a range specified min a max (both are unreachable).
     * @param v {Number} The number to check.
     * @param min {Number} The lower bound.
     * @param max {Number} The upper bound.
     * @returns {Boolean} True if the number to check is strictly greater than min and strictly less than max, and
     * false otherwise.
     */
    static isValueBetweenNotEquals(v:number, min:number, max:number):boolean {
        return min < v && v < max;
    }

    /**
     * Check whether a number is inside a range specified min a max (both are reachable).
     * @param v {Number} The number to check.
     * @param min {Number} The lower bound.
     * @param max {Number} The upper bound.
     * @returns {Boolean} True if the number to check is not less than min and not greater than max, and
     * false otherwise.
     */
    static isValueBetweenEquals(v:number, min:number, max:number):boolean {
        return min <= v && v <= max;
    }

    /**
     * Test whether a positive number is a power of 2.
     * @param positiveNumber {Number} The positive number to test.
     * @returns {Boolean} True if the number is a power of 2, and false otherwise.
     */
    static isPowerOfTwo(positiveNumber:number):boolean {
        var num = positiveNumber | 0;
        if (num != positiveNumber || isNaN(num) || !isFinite(num)) {
            return false;
        } else {
            return num > 0 && (num & (num - 1)) === 0;
        }
    }

    /**
     * Calculate the smallest power of 2 which is greater than or equals the given positive number.
     * @param positiveNumber {Number} The positive number as the basis.
     * @returns {Number} The smallest power of 2 which is greater than or equals the given positive number
     */
    static power2Roundup(positiveNumber:number):number {
        if (positiveNumber < 0)
            return 0;
        --positiveNumber;
        positiveNumber |= positiveNumber >>> 1;
        positiveNumber |= positiveNumber >>> 2;
        positiveNumber |= positiveNumber >>> 4;
        positiveNumber |= positiveNumber >>> 8;
        positiveNumber |= positiveNumber >>> 16;
        return positiveNumber + 1;
    }

    static complementToNegative(complement:number):number {
        return -((~complement) + 1);
    }

    static isByteComplement(value:number) {
        return ((value & 0xff) & 0x80) !== 0;
    }

    static isInt32Complement(value:number) {
        return ((value & 0xffffffff) & 0x80000000) !== 0;
    }

}
