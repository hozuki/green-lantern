/**
 * Created by MIC on 2015/11/20.
 */

import * as flash from "./flash/index";
import * as webgl from "./webgl/index";
import * as fl from "./fl/index";
import * as mx from "./mx/index";
import * as glantern from "./glantern/index";
import {EngineBase} from "./glantern/EngineBase";
import {GLUtil} from "./glantern/GLUtil";

export {flash, webgl, fl, mx, glantern, EngineBase};

export function injectToGlobal($this:any):void {
    $this["flash"] = flash;
    $this["webgl"] = webgl;
    $this["fl"] = fl;
    $this["mx"] = mx;
}

export function isSupported():boolean {
    return GLUtil.checkSupportStatus().ok;
}
