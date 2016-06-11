/**
 * Created by MIC on 2016/6/8.
 */
import {ErrorBase} from "../../glantern/ErrorBase";

export class ApplicationError extends ErrorBase {

    constructor(message:string = "") {
        super(message);
    }

    get name():string {
        return "ApplicationError";
    }

}
