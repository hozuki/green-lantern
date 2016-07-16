/**
 * Created by MIC on 2016/6/11.
 */

import {ErrorBase} from "../../glantern/ErrorBase";

export class IOError extends ErrorBase {

    constructor(message:string = "") {
        super(message);
    }

    get name():string {
        return "IOError";
    }

}
