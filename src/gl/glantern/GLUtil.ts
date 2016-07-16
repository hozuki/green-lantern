/**
 * Created by MIC on 2015/11/17.
 */

import {SupportCheckResult} from "./SupportCheckResult";
import {RgbaColor} from "./RgbaColor";

const $global = <any>window;

/**
 * The class providing utility functions.
 */
export abstract class GLUtil {

    static checkSupportStatus():SupportCheckResult {
        var result:SupportCheckResult = {
            ok: true,
            reasons: []
        };
        var globalObject = <any>window;
        if (!globalObject) {
            result.ok = false;
            result.reasons.push("'window' object is not found in global scope.");
        }
        var notSupportedPrompt = " is not supported by this browser";
        // GLantern is based on <canvas>, so it should exist.
        if (!GLUtil.isClassDefinition(globalObject["HTMLCanvasElement"])) {
            result.ok = false;
            result.reasons.push("Canvas element" + notSupportedPrompt);
        }
        // GLantern uses WebGL, so there should be a corresponding rendering context.
        if (!GLUtil.isClassDefinition(globalObject["WebGLRenderingContext"])) {
            result.ok = false;
            result.reasons.push("WebGL" + notSupportedPrompt);
        }
        // Classes related to array buffer.
        var arrayBufferClasses:string[] = ["ArrayBuffer", "DataView", "Uint8Array", "Int8Array", "Uint16Array", "Int16Array", "Uint32Array", "Int32Array", "Float32Array", "Float64Array"];
        for (var i = 0; i < arrayBufferClasses.length; ++i) {
            if (!GLUtil.isClassDefinition(globalObject[arrayBufferClasses[i]])) {
                result.ok = false;
                result.reasons.push(`'${arrayBufferClasses[i]}' class${notSupportedPrompt}`);
            }
        }
        // GLantern uses Map and Set class, so they should exist.
        // Note: Map and Set are ES6 features, but they are implemented on modern browsers.
        if (!GLUtil.isClassDefinition(globalObject["Map"])) {
            result.ok = false;
            result.reasons.push("'Map' class" + notSupportedPrompt);
        }
        if (!GLUtil.isClassDefinition(globalObject["Set"])) {
            result.ok = false;
            result.reasons.push("'Set' class" + notSupportedPrompt);
        }
        // No plans for support of Chrome whose version is under 40, due to a WebGL memory leak problem.
        if (typeof globalObject["chrome"] === "object") {
            var chromeVersionRegExp = /Chrome\/(\d+)(?:\.\d+)*/;
            var chromeVersionInfo = chromeVersionRegExp.exec(window.navigator.appVersion);
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
    static isUndefinedOrNull<T>(value:T):boolean {
        return value === void(0) || value === null;
    }

    /**
     * Check whether a value is {@link undefined}.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is {@link undefined}, and false otherwise.
     */
    static isUndefined<T>(value:T):boolean {
        return value === void(0);
    }

    /**
     * Check whether a value is logically true.
     * @param value {*} The value to check.
     * @returns {Boolean}
     */
    static ptr<T>(value:T):boolean {
        return !!value;
    }

    /**
     * Check whether a value is a function.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is a function, and false otherwise.
     */
    static isFunction(value:any):boolean {
        return typeof value === "function";
    }

    /**
     * Check whether a value is a class prototype.
     * @param value {*} The value to check.
     * @returns {Boolean} True if the value is a class definition, and false otherwise.
     * @remarks IE11 has a non-standard behavior to declare experimental features (e.g. Map) as functions,
     *          and tested features (e.g. WebGLRenderingContext) as objects.
     */
    static isClassDefinition(value:any):boolean {
        var typeCheck:boolean;
        if (typeof value === "function") {
            typeCheck = true;
        } else {
            var isIE11 = window.navigator.appVersion.indexOf("Trident/7.0") >= 0 && window.navigator.appVersion.indexOf("rv:11.0") >= 0;
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
    static formatString(format:string, ...replaceWithArray:any[]):string {
        var replaceWithArrayIsNull = !GLUtil.ptr(replaceWithArray);
        var replaceWithArrayLength = replaceWithArrayIsNull ? -1 : replaceWithArray.length;

        function __stringFormatter(matched:string):string {
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
    static deepClone(sourceObject:boolean):boolean;
    static deepClone(sourceObject:string):string;
    static deepClone(sourceObject:number):number;
    static deepClone<T>(sourceObject:T[]):T[];
    static deepClone<T extends Object>(sourceObject:T):T;
    static deepClone<K, V>(sourceObject:Map<K, V>):Map<K, V>;
    static deepClone<T>(sourceObject:Set<T>):Set<T>;
    static deepClone<T extends Function>(sourceObject:T):T;
    static deepClone(sourceObject:any):any {
        if (typeof sourceObject === "undefined" || sourceObject === null || sourceObject === true || sourceObject === false) {
            return sourceObject;
        }
        if (typeof sourceObject === "string" || typeof sourceObject === "number") {
            return sourceObject;
        }
        /* Arrays */
        if (Array.isArray(sourceObject)) {
            var tmpArray:any[] = [];
            for (var i = 0; i < sourceObject.length; ++i) {
                tmpArray.push(GLUtil.deepClone(sourceObject[i]));
            }
            return tmpArray;
        }
        /* ES6 classes. Chrome has implemented a part of them so they must be considered. */
        if (typeof $global.Map !== "undefined" && sourceObject instanceof Map) {
            var newMap = new Map<any, any>();
            sourceObject.forEach((v:any, k:any) => {
                newMap.set(GLUtil.deepClone(k), GLUtil.deepClone(v));
            });
            return newMap;
        }
        if (typeof $global.Set !== "undefined" && sourceObject instanceof Set) {
            var newSet = new Set<any>();
            sourceObject.forEach((v:any) => {
                newSet.add(GLUtil.deepClone(v));
            });
            return newSet;
        }
        /* Classic ES5 functions. */
        if (sourceObject instanceof Function || typeof sourceObject === "function") {
            var sourceFunctionObject = <Function>sourceObject;
            var fn = (function ():Function {
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
        if (sourceObject instanceof Object || typeof sourceObject === "object") {
            var newObject = Object.create(null);
            if (typeof sourceObject.hasOwnProperty === "function") {
                for (var key in sourceObject) {
                    if (sourceObject.hasOwnProperty(key)) {
                        newObject[key] = GLUtil.deepClone(sourceObject[key]);
                    }
                }
            } else {
                for (var key in sourceObject) {
                    newObject[key] = GLUtil.deepClone(sourceObject[key]);
                }
            }
            return newObject;
        }
        return (void 0);
    }

    /**
     * Prints out a message with a stack trace.
     * @param message {String} The message to print.
     * @param [extra] {*} Extra information.
     */
    static trace(message:string, extra:any = void(0)):void {
        if (GLUtil.isUndefined(extra)) {
            console.info(message);
        } else {
            console.info(message, extra);
        }
        console.trace();
    }

    static colorToCssSharp(color:number):string {
        color |= 0;
        return "#" + GLUtil.padLeft(color.toString(16), 6, "0");
    }

    static colorToCssRgba(color:number):string {
        color |= 0;
        var a = (color >> 24) & 0xff;
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    static rgb(r:number, g:number, b:number):number {
        return GLUtil.rgba(r, g, b, 0xff);
    }

    static rgba(r:number, g:number, b:number, a:number):number {
        return ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
    }

    static decomposeRgb(color:number):RgbaColor {
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return {
            r: r, g: g, b: b, a: 0xff
        };
    }

    static decomposeRgba(color:number):RgbaColor {
        var a = (color >> 24) & 0xff;
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return {
            r: r, g: g, b: b, a: a
        };
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

    static remove<T>(array:T[], value:T, equalFunc:(t1:T, t2:T) => boolean = null):boolean {
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

    static removeAll<T>(array:T[], value:T, equalFunc:(t1:T, t2:T) => boolean = null):number {
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

    static removeAt<T>(array:T[], index:number):boolean {
        index |= 0;
        if (0 <= index && index < array.length) {
            array.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

}

function simpleEquals<T>(t1:T, t2:T):boolean {
    return t1 === t2;
}