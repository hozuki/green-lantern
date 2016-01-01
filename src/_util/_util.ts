/**
 * Created by MIC on 2015/11/17.
 */

var $global = global || <any>window;

/**
 * The class providing utility functions.
 */
export abstract class _util {

    /**
     * Check whether a value is {@link undefined} or {@link null}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined} or {@link null}, and false otherwise.
     */
    static isUndefinedOrNull(value:any):boolean {
        return value === undefined || value === null;
    }

    /**
     * Check whether a value is {@link undefined}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined}, and false otherwise.
     */
    static isUndefined(value:any):boolean {
        return value === undefined;
    }

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
     * Generate a string based on the template, and provided values. This function acts similarly to the String.Format()
     * function in CLR.
     * @param format {String} The template string.
     * @param replaceWithArray {*[]} The value array to provide values for formatting.
     * @example
     * var person = { name: "John Doe", age: 20 };
     * console.log(_util.formatString("{0}'s age is {1}.", person.name, person.age);
     * @returns {String} The generated string, with valid placeholders replaced by values matched.
     */
    static formatString(format:string, ...replaceWithArray:any[]):string {
        var replaceWithArrayIsNull = _util.isUndefinedOrNull(replaceWithArray);
        var replaceWithArrayLength = replaceWithArrayIsNull ? -1 : replaceWithArray.length;

        function __stringFormatter(matched:string):string {
            var indexString = matched.substring(1, matched.length - 1);
            var indexValue = parseInt(indexString);
            if (!replaceWithArrayIsNull && (0 <= indexValue && indexValue < replaceWithArrayLength)) {
                if (replaceWithArray[indexValue] === undefined) {
                    return "undefined";
                } else if (replaceWithArray[indexValue] === null) {
                    return "null";
                } else {
                    return replaceWithArray[indexValue].toString();
                }
            } else {
                return matched;
            }
        }

        var regex = /{[\d]+}/g;
        return format.replace(regex, __stringFormatter);
    }

    /**
     * Deeply clones an object. The cloned object has the exactly same values but no connection with the original one.
     * @param sourceObject {*} The object to be cloned.
     * @returns {*} The copy of original object.
     */
    static deepClone(sourceObject:any):any {
        if (sourceObject === undefined || sourceObject === null || sourceObject === true || sourceObject === false) {
            return sourceObject;
        }
        if (typeof sourceObject === "string" || typeof sourceObject === "number") {
            return sourceObject;
        }
        /* Arrays */
        if (Array.isArray(sourceObject)) {
            var tmpArray:any[] = [];
            for (var i = 0; i < sourceObject.length; ++i) {
                tmpArray.push(_util.deepClone(sourceObject[i]));
            }
            return tmpArray;
        }
        /* ES6 classes. Chrome has implemented a part of them so they must be considered. */
        if ($global.Map !== undefined && sourceObject instanceof Map) {
            var newMap = new Map<any, any>();
            sourceObject.forEach((v:any, k:any) => {
                newMap.set(k, v);
            });
            return newMap;
        }
        if ($global.Set !== undefined && sourceObject instanceof Set) {
            var newSet = new Set<any>();
            sourceObject.forEach((v:any) => {
                newSet.add(v);
            });
            return newSet;
        }
        /* Classic ES5 functions. */
        if (sourceObject instanceof Function || typeof sourceObject === "function") {
            var fn = (function ():Function {
                return function () {
                    return sourceObject.apply(this, arguments);
                }
            })();
            fn.prototype = sourceObject.prototype;
            for (var key in sourceObject) {
                if (sourceObject.hasOwnProperty(key)) {
                    (<any>fn)[key] = (<any>sourceObject)[key];
                }
            }
            return fn;
        }
        /* Classic ES5 objects. */
        if (sourceObject instanceof Object || typeof sourceObject === "object") {
            var newObject = Object.create(null);
            for (var key in sourceObject) {
                if (sourceObject.hasOwnProperty(key)) {
                    newObject[key] = _util.deepClone(sourceObject[key]);
                }
            }
            return newObject;
        }
        return undefined;
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

    /**
     * Prints out a message with a stack trace.
     * @param message {String} The message to print.
     * @param [extra] {*} Extra information.
     */
    static trace(message:string, extra?:any):void {
        if (extra !== undefined) {
            console.info(message, extra);
        } else {
            console.info(message);
        }
        console.trace();
    }

    static requestAnimationFrame(f:FrameRequestCallback):number {
        return window.requestAnimationFrame(f);
    }

    static cancelAnimationFrame(handle:number):void {
        window.cancelAnimationFrame(handle);
    }

    static colorToCssSharp(color:number):string {
        color |= 0;
        return "#" + _util.padLeft(color.toString(16), 6, "0");
    }

    static colorToCssRgba(color:number):string {
        color |= 0;
        var a = (color >> 24) & 0xff;
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }

    static padLeft(str:string, targetLength:number, padWith:string):string {
        while (str.length < targetLength) {
            str = padWith + str;
        }
        if (str.length > targetLength) {
            str = str.substring(str.length - targetLength, str.length - 1);
        }
        return str;
    }

}