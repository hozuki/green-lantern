/**
 * Created by MIC on 2015/11/20.
 */

import * as flash from "./flash/index";
import * as webgl from "./webgl/index";
import * as fl from "./fl/index";
import * as mx from "./mx/index";
import * as mic from "./mic/index";
import {EngineBase} from "./mic/EngineBase";
import {CommonUtil} from "./mic/CommonUtil";

export {flash, webgl, fl, mx, mic, EngineBase};

/**
 * @param $this {*}
 * @deprecated
 */
export function injectToGlobal($this: any): void {
    if ($this) {
        $this["flash"] = flash;
        $this["webgl"] = webgl;
        $this["fl"] = fl;
        $this["mx"] = mx;
    }
}

export function isSupported(): boolean {
    return CommonUtil.checkSupportStatus().ok;
}

const checkSupportStatus = CommonUtil.checkSupportStatus;
export {checkSupportStatus};
