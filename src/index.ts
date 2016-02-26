/**
 * Created by MIC on 2015/11/20.
 */

import * as flash from "./flash/index";
import * as webgl from "./webgl/index";
import * as fl from "./fl/index";
import * as mx from "./mx/index";
import {GLantern} from "./GLantern";
import {GLUtil} from "../lib/glantern-utils/src/GLUtil";

export { flash, webgl, fl, mx, GLantern};

export function injectToGlobal($this:any):void {
    $this["flash"] = flash;
    $this["webgl"] = webgl;
    $this["fl"] = fl;
    $this["mx"] = mx;
}

export function isSupported():boolean {
    var globalObject = <any>window;

    if (!globalObject) {
        return false;
    }
    // GLantern is based on <canvas>, so it should exist.
    if (!GLUtil.isClassDefinition(globalObject["HTMLCanvasElement"])) {
        return false;
    }
    // GLantern uses WebGL, so there should be a corresponding rendering context.
    if (!GLUtil.isClassDefinition(globalObject["WebGLRenderingContext"])) {
        return false;
    }
    // GLantern uses Map and Set class, so they should exist.
    // Note: Map and Set are ES6 features, but they are implemented on modern browsers.
    if (!GLUtil.isClassDefinition(globalObject["Map"])) {
        return false;
    }
    if (!GLUtil.isClassDefinition(globalObject["Set"])) {
        return false;
    }
    // No plans for support of Chrome whose version is under 40, due to a WebGL memory leak problem.
    if (typeof globalObject["chrome"] === "object") {
        var chromeVersionRegExp = /Chrome\/(\d+)(?:\.\d+)*/;
        var chromeVersionInfo = chromeVersionRegExp.exec(window.navigator.appVersion);
        if (chromeVersionInfo.length < 2 || parseInt(chromeVersionInfo[1]) < 40) {
            return false;
        }
    }
    return true;
}
