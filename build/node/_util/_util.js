/**
 * Created by MIC on 2015/11/17.
 */
var $global = global || window;
/**
 * The class providing utility functions.
 */
var _util = (function () {
    function _util() {
    }
    /**
     * Check whether a value is {@link undefined} or {@link null}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined} or {@link null}, and false otherwise.
     */
    _util.isUndefinedOrNull = function (value) {
        return value === undefined || value === null;
    };
    /**
     * Check whether a value is {@link undefined}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined}, and false otherwise.
     */
    _util.isUndefined = function (value) {
        return value === undefined;
    };
    /**
     * Check whether a value is a function.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is a function, and false otherwise.
     */
    _util.isFunction = function (value) {
        return typeof value === "function";
    };
    /**
     * Check whether a value is a class prototype.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is a class definition, and false otherwise.
     * @remarks IE11 has a non-standard behavior to declare experimental features (e.g. Map) as functions,
     *          and tested features (e.g. WebGLRenderingContext) as objects.
     */
    _util.isClassDefinition = function (value) {
        var t = typeof value;
        var typeCheck;
        if (typeof value === "function") {
            typeCheck = true;
        }
        else {
            var isIE11 = navigator.appVersion.indexOf("Trident/7.0") >= 0 && navigator.appVersion.indexOf("rv:11.0") >= 0;
            typeCheck = isIE11 && typeof value === "object";
        }
        var constructorCheck = (value && value.prototype ? value.prototype.constructor === value : false);
        return typeCheck && constructorCheck;
    };
    /**
     * Limit a number inside a range specified by min and max (both are reachable).
     * @param v {Number} The number to limit.
     * @param min {Number} The lower bound. Numbers strictly less than this bound will be set to the value.
     * @param max {Number} The upper bound. Numbers strictly greater than this bound will be set to this value.
     * @returns {Number} The limited value. If the original number is inside the specified range, it will not be
     * altered. Otherwise, it will be either min or max.
     */
    _util.limitInto = function (v, min, max) {
        v < min && (v = min);
        v > max && (v = max);
        return v;
    };
    /**
     * Check whether a number is inside a range specified min a max (both are unreachable).
     * @param v {Number} The number to check.
     * @param min {Number} The lower bound.
     * @param max {Number} The upper bound.
     * @returns {Boolean} True if the number to check is strictly greater than min and strictly less than max, and
     * false otherwise.
     */
    _util.isValueBetweenNotEquals = function (v, min, max) {
        return min < v && v < max;
    };
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
    _util.formatString = function (format) {
        var replaceWithArray = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            replaceWithArray[_i - 1] = arguments[_i];
        }
        var replaceWithArrayIsNull = _util.isUndefinedOrNull(replaceWithArray);
        var replaceWithArrayLength = replaceWithArrayIsNull ? -1 : replaceWithArray.length;
        function __stringFormatter(matched) {
            var indexString = matched.substring(1, matched.length - 1);
            var indexValue = parseInt(indexString);
            if (!replaceWithArrayIsNull && (0 <= indexValue && indexValue < replaceWithArrayLength)) {
                if (replaceWithArray[indexValue] === undefined) {
                    return "undefined";
                }
                else if (replaceWithArray[indexValue] === null) {
                    return "null";
                }
                else {
                    return replaceWithArray[indexValue].toString();
                }
            }
            else {
                return matched;
            }
        }
        var regex = /{[\d]+}/g;
        return format.replace(regex, __stringFormatter);
    };
    /**
     * Deeply clones an object. The cloned object has the exactly same values but no connection with the original one.
     * @param sourceObject {*} The object to be cloned.
     * @returns {*} The copy of original object.
     */
    _util.deepClone = function (sourceObject) {
        if (sourceObject === undefined || sourceObject === null || sourceObject === true || sourceObject === false) {
            return sourceObject;
        }
        if (typeof sourceObject === "string" || typeof sourceObject === "number") {
            return sourceObject;
        }
        /* Arrays */
        if (Array.isArray(sourceObject)) {
            var tmpArray = [];
            for (var i = 0; i < sourceObject.length; ++i) {
                tmpArray.push(_util.deepClone(sourceObject[i]));
            }
            return tmpArray;
        }
        /* ES6 classes. Chrome has implemented a part of them so they must be considered. */
        if ($global.Map !== undefined && sourceObject instanceof Map) {
            var newMap = new Map();
            sourceObject.forEach(function (v, k) {
                newMap.set(k, v);
            });
            return newMap;
        }
        if ($global.Set !== undefined && sourceObject instanceof Set) {
            var newSet = new Set();
            sourceObject.forEach(function (v) {
                newSet.add(v);
            });
            return newSet;
        }
        /* Classic ES5 functions. */
        if (sourceObject instanceof Function || typeof sourceObject === "function") {
            var sourceFunctionObject = sourceObject;
            var fn = (function () {
                return function () {
                    return sourceFunctionObject.apply(this, arguments);
                };
            })();
            fn.prototype = sourceFunctionObject.prototype;
            for (var key in sourceFunctionObject) {
                if (sourceFunctionObject.hasOwnProperty(key)) {
                    fn[key] = sourceFunctionObject[key];
                }
            }
            return fn;
        }
        /* Classic ES5 objects. */
        if (sourceObject instanceof Object || typeof sourceObject === "object") {
            var newObject = Object.create(null);
            if (typeof sourceObject.hasOwnProperty === "function") {
                for (var key in sourceObject) {
                    if (sourceObject.hasOwnProperty(key)) {
                        newObject[key] = _util.deepClone(sourceObject[key]);
                    }
                }
            }
            else {
                for (var key in sourceObject) {
                    newObject[key] = _util.deepClone(sourceObject[key]);
                }
            }
            return newObject;
        }
        return undefined;
    };
    /**
     * Test whether a positive number is a power of 2.
     * @param positiveNumber {Number} The positive number to test.
     * @returns {Boolean} True if the number is a power of 2, and false otherwise.
     */
    _util.isPowerOfTwo = function (positiveNumber) {
        var num = positiveNumber | 0;
        if (num != positiveNumber || isNaN(num) || !isFinite(num)) {
            return false;
        }
        else {
            return num > 0 && (num & (num - 1)) === 0;
        }
    };
    /**
     * Calculate the smallest power of 2 which is greater than or equals the given positive number.
     * @param positiveNumber {Number} The positive number as the basis.
     * @returns {Number} The smallest power of 2 which is greater than or equals the given positive number
     */
    _util.power2Roundup = function (positiveNumber) {
        if (positiveNumber < 0)
            return 0;
        --positiveNumber;
        positiveNumber |= positiveNumber >>> 1;
        positiveNumber |= positiveNumber >>> 2;
        positiveNumber |= positiveNumber >>> 4;
        positiveNumber |= positiveNumber >>> 8;
        positiveNumber |= positiveNumber >>> 16;
        return positiveNumber + 1;
    };
    /**
     * Prints out a message with a stack trace.
     * @param message {String} The message to print.
     * @param [extra] {*} Extra information.
     */
    _util.trace = function (message, extra) {
        if (extra !== undefined) {
            console.info(message, extra);
        }
        else {
            console.info(message);
        }
        console.trace();
    };
    _util.requestAnimationFrame = function (f) {
        return window.requestAnimationFrame(f);
    };
    _util.cancelAnimationFrame = function (handle) {
        window.cancelAnimationFrame(handle);
    };
    _util.colorToCssSharp = function (color) {
        color |= 0;
        return "#" + _util.padLeft(color.toString(16), 6, "0");
    };
    _util.colorToCssRgba = function (color) {
        color |= 0;
        var a = (color >> 24) & 0xff;
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    };
    _util.padLeft = function (str, targetLength, padWith) {
        while (str.length < targetLength) {
            str = padWith + str;
        }
        if (str.length > targetLength) {
            str = str.substring(str.length - targetLength, str.length - 1);
        }
        return str;
    };
    return _util;
})();
exports._util = _util;

//# sourceMappingURL=_util.js.map
