/**
 * Created by MIC on 2015/11/20.
 */

import * as _util from "./_util/index";
import * as flash from "./flash/index";
import * as webgl from "./webgl/index";
import {GLantern} from "./GLantern";

export {_util, flash, webgl, GLantern};

export function injectToGlobal($this:any):void {
    $this["_util"] = _util;
    $this["flash"] = flash;
    $this["webgl"] = webgl;
}
