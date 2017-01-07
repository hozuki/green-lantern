/**
 * Created by MIC on 2015/12/4.
 */
import * as GLantern from "./index";
import VirtualDom from "./mic/VirtualDom";

/*
 Prepare to run in browsers.
 In browsers, we must find the "window" object as global object in highest priority,
 instead of Node's "global" object.
 */
(($global: any): void => {
    if (!$global) {
        console.error("GLantern must run in a browser.")
    } else {
        ($global).GLantern = GLantern;
    }
})(VirtualDom.env);
