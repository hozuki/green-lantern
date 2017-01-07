/**
 * Created by MIC on 2016/9/14.
 */

import ErrorBase from "../../mic/ErrorBase";

export default class NotSupportedError extends ErrorBase {

    constructor(message: string = "") {
        super(message);
    }

    get name(): string {
        return "NotSupportedError";
    }

}
