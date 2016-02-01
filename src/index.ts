/**
 * Created by MIC on 2015/11/20.
 */

import * as _util from "./_util/index";
import * as flash from "./flash/index";
import * as webgl from "./webgl/index";
import * as fl from "./fl/index";
import * as mx from "./mx/index";
import {GLantern} from "./GLantern";

export {_util, flash, webgl, fl, mx, GLantern};

export function injectToGlobal($this:any):void {
    $this["_util"] = _util;
    $this["flash"] = flash;
    $this["webgl"] = webgl;
    $this["fl"] = fl;
    $this["mx"] = mx;
}

export function isSupported():boolean {
    var globalObject = <any>window;
    var util = _util._util;
    
    if (!globalObject) {
        return false;
    }
    // GLantern is based on <canvas>, so it should exist.
    if (!util.isFunction(globalObject["HTMLCanvasElement"])) {
        return false;
    }
    // GLantern uses WebGL, so there should be a corresponding rendering context.
    if (!util.isFunction(globalObject["WebGLRenderingContext"])) {
        return false;
    }
    // GLantern uses Map class, so it should exist.
    // Note: Map is a ES6 feature, but it is a de facto standard on modern browsers.
    if (!util.isFunction(globalObject["Map"])) {
        return false;
    }
    return true;
}
