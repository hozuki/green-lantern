/**
 * Created by MIC on 2016/8/22.
 */

import VirtualDom from "./VirtualDom";
import SupportCheckResult from "./SupportCheckResult";

abstract class CommonUtil {

    static checkSupportStatus(): SupportCheckResult {
        var result: SupportCheckResult = {
            ok: true,
            reasons: []
        };
        var env = <any>VirtualDom.env;
        if (!env) {
            result.ok = false;
            result.reasons.push("'window' object is not found in global scope.");
        }
        var notSupportedPrompt = " is not supported by this browser";
        // GLantern is based on <canvas>, so it should exist.
        if (!CommonUtil.isClassDefinition(env["HTMLCanvasElement"])) {
            result.ok = false;
            result.reasons.push("Canvas element" + notSupportedPrompt);
        }
        // rAF and cAF provide animation support for GLantern.
        if (!CommonUtil.isFunction(VirtualDom.requestAnimationFrame) || !CommonUtil.isFunction(VirtualDom.cancelAnimationFrame)) {
            result.ok = false;
            result.reasons.push("requestAnimationFrame and/or cancelAnimationFrame are not supported by this browser.");
        }
        // GLantern uses WebGL, so there should be a corresponding rendering context.
        if (!CommonUtil.isClassDefinition(env["WebGLRenderingContext"])) {
            result.ok = false;
            result.reasons.push("WebGL" + notSupportedPrompt);
        }
        // Classes related to array buffer.
        var arrayBufferClasses: string[] = ["ArrayBuffer", "DataView", "Uint8Array", "Int8Array", "Uint16Array", "Int16Array", "Uint32Array", "Int32Array", "Float32Array", "Float64Array"];
        for (var i = 0; i < arrayBufferClasses.length; ++i) {
            if (!CommonUtil.isClassDefinition(env[arrayBufferClasses[i]])) {
                result.ok = false;
                result.reasons.push(`'${arrayBufferClasses[i]}' class${notSupportedPrompt}`);
            }
        }
        // GLantern uses Map and Set class, so they should exist.
        // Note: Map and Set are ES6 features, but they are implemented on modern browsers.
        if (!CommonUtil.isClassDefinition(env["Map"])) {
            result.ok = false;
            result.reasons.push("'Map' class" + notSupportedPrompt);
        }
        if (!CommonUtil.isClassDefinition(env["Set"])) {
            result.ok = false;
            result.reasons.push("'Set' class" + notSupportedPrompt);
        }
        // No plans for support of Chrome whose version is under 40, due to a WebGL memory leak problem.
        if (typeof env["chrome"] === "object") {
            var chromeVersionRegExp = /Chrome\/(\d+)(?:\.\d+)*/;
            var chromeVersionInfo = chromeVersionRegExp.exec(VirtualDom.appVersion);
            if (chromeVersionInfo.length < 2 || parseInt(chromeVersionInfo[1]) < 40) {
                result.ok = false;
                result.reasons.push("Chrome under version 40 is not supported due to performance faults.");
            }
        }
        return result;
    }

    /**
     * Check whether a value is {@link undefined} or {@link null}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined} or {@link null}, and false otherwise.
     */
    static isUndefinedOrNull<T>(value: T): boolean {
        return value === void(0) || value === null;
    }

    /**
     * Check whether a value is {@link undefined}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined}, and false otherwise.
     */
    static isUndefined<T>(value: T): boolean {
        return value === void(0);
    }

    static isNull(value: any): boolean {
        return value === null;
    }

    /**
     * Check whether a value is a function.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is a function, and false otherwise.
     */
    static isFunction(value: any): boolean {
        return typeof value === "function";
    }

    static isNumber(value: any): boolean {
        return typeof value === "number";
    }

    static isArray(value: any): boolean {
        //return ({}).toString.apply(value) === "[object Array]";
        return Array.isArray(value);
    }

    static isString(value: any): boolean {
        return typeof value === "string";
    }

    static isObject(value: any): boolean {
        return typeof value === "object";
    }

    /**
     * Check whether a value is logically true.
     * @param value {*} The value to check.
     * @returns {Boolean}
     */
    static ptr<T>(value: T): boolean {
        return !!value;
    }

    /**
     * Check whether a value is a class prototype.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is a class definition, and false otherwise.
     * @remarks IE11 has a non-standard behavior to declare experimental features (e.g. Map) as functions,
     *          and tested features (e.g. WebGLRenderingContext) as objects.
     */
    static isClassDefinition(value: any): boolean {
        var typeCheck: boolean;
        if (typeof value === "function") {
            typeCheck = true;
        } else {
            var isIE11 = VirtualDom.appVersion.indexOf("Trident/7.0") >= 0 && VirtualDom.appVersion.indexOf("rv:11.0") >= 0;
            typeCheck = isIE11 && typeof value === "object";
        }
        var constructorCheck = (value && value.prototype ? value.prototype.constructor === value : false);
        return typeCheck && constructorCheck;
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
    static formatString(format: string, ...replaceWithArray: any[]): string {
        var replaceWithArrayIsNull = !CommonUtil.ptr(replaceWithArray);
        var replaceWithArrayLength = replaceWithArrayIsNull ? -1 : replaceWithArray.length;

        function __stringFormatter(matched: string): string {
            var indexString = matched.substring(1, matched.length - 1);
            var indexValue = parseInt(indexString);
            if (!replaceWithArrayIsNull && (0 <= indexValue && indexValue < replaceWithArrayLength)) {
                if (typeof replaceWithArray[indexValue] === "undefined") {
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
    static deepClone<T>(sourceObject: T): T;
    static deepClone(sourceObject: boolean): boolean;
    static deepClone(sourceObject: string): string;
    static deepClone(sourceObject: number): number;
    static deepClone<T>(sourceObject: T[]): T[];
    static deepClone<T extends Object>(sourceObject: T): T;
    static deepClone<K, V>(sourceObject: Map<K, V>): Map<K, V>;
    static deepClone<T>(sourceObject: Set<T>): Set<T>;
    static deepClone<T extends Function>(sourceObject: T): T;
    static deepClone(sourceObject: any): any {
        if (typeof sourceObject === "undefined" || sourceObject === null || sourceObject === true || sourceObject === false) {
            return sourceObject;
        }
        if (typeof sourceObject === "string" || typeof sourceObject === "number") {
            return sourceObject;
        }
        /* Arrays */
        if (CommonUtil.isArray(sourceObject)) {
            var tmpArray: any[] = [];
            for (var i = 0; i < sourceObject.length; ++i) {
                tmpArray.push(CommonUtil.deepClone(sourceObject[i]));
            }
            return tmpArray;
        }
        var $global = <any>VirtualDom.env;
        /* ES6 classes. Chrome has implemented a part of them so they must be considered. */
        if (typeof $global.Map !== "undefined" && sourceObject instanceof Map) {
            var newMap = new Map<any, any>();
            sourceObject.forEach((v: any, k: any) => {
                newMap.set(CommonUtil.deepClone(k), CommonUtil.deepClone(v));
            });
            return newMap;
        }
        if (typeof $global.Set !== "undefined" && sourceObject instanceof Set) {
            var newSet = new Set<any>();
            sourceObject.forEach((v: any) => {
                newSet.add(CommonUtil.deepClone(v));
            });
            return newSet;
        }
        /* Classic ES5 functions. */
        if (CommonUtil.isFunction(sourceObject)) {
            var sourceFunctionObject = <Function>sourceObject;
            var fn = (function (): Function {
                return function () {
                    return sourceFunctionObject.apply(this, arguments);
                }
            })();
            fn.prototype = sourceFunctionObject.prototype;
            for (var key in sourceFunctionObject) {
                if (sourceFunctionObject.hasOwnProperty(key)) {
                    (<any>fn)[key] = (<any>sourceFunctionObject)[key];
                }
            }
            return fn;
        }
        /* Classic ES5 objects. */
        if (CommonUtil.isObject(sourceObject)) {
            var newObject = Object.create(null);
            if (typeof sourceObject.hasOwnProperty === "function") {
                for (var key in sourceObject) {
                    if (sourceObject.hasOwnProperty(key)) {
                        newObject[key] = CommonUtil.deepClone(sourceObject[key]);
                    }
                }
            } else {
                for (var key in sourceObject) {
                    newObject[key] = CommonUtil.deepClone(sourceObject[key]);
                }
            }
            return newObject;
        }
        return void(0);
    }

    static simpleClone(source: any): any {
        if (CommonUtil.isUndefined(source)) {
            return void(0);
        }
        if (CommonUtil.isNull(source)) {
            return null;
        }
        if (CommonUtil.isArray(source)) {
            return new Array(source);
        }
        if (CommonUtil.isObject(source)) {
            var obj = Object.create(null);
            var keys = Object.keys(source);
            for (var i = 0; i < keys.length; ++i) {
                obj[keys[i]] = source[keys[i]];
            }
            return obj;
        }
        return void(0);
    }

    static shallowClone<T>(value: T): T {
        return value;
    }

    /**
     * Prints out a message with a stack trace.
     * @param message {String} The message to print.
     * @param [extra] {*} Extra information.
     */
    static trace(message: string, extra?: any): void {
        if (CommonUtil.isUndefined(extra)) {
            console.info(message);
        } else {
            console.info(message, extra);
        }
        console.trace();
    }

    static padLeft(str: string, targetLength: number, padWith: string): string {
        while (str.length < targetLength) {
            str = padWith + str;
        }
        if (str.length > targetLength) {
            str = str.substring(str.length - targetLength, str.length - 1);
        }
        return str;
    }

    static remove<T>(array: T[], value: T, equalFunc: (t1: T, t2: T) => boolean = null): boolean {
        if (typeof equalFunc !== "function") {
            var searchIndex = array.indexOf(value);
            if (searchIndex >= 0) {
                array.splice(searchIndex, 1);
                return true;
            } else {
                return false;
            }
        }
        for (var i = 0; i < array.length; ++i) {
            if (equalFunc(value, array[i])) {
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    static removeAll<T>(array: T[], value: T, equalFunc: (t1: T, t2: T) => boolean = null): number {
        var func = typeof equalFunc === "function" ? equalFunc : simpleEquals;
        var counter = 0;
        var arrayLength = array.length;
        for (var i = 0; i < arrayLength; ++i) {
            if (func(value, array[i])) {
                array.splice(i, 1);
                --i;
                --arrayLength;
                ++counter;
            }
        }
        return counter;
    }

    static removeAt<T>(array: T[], index: number): boolean {
        index |= 0;
        if (0 <= index && index < array.length) {
            array.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

}

function simpleEquals<T>(t1: T, t2: T): boolean {
    return t1 === t2;
}

export default CommonUtil;
