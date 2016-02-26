/**
 * Created by MIC on 2015/12/26.
 */

import {NotImplementedError} from "../../../../../lib/glantern-utils/src/NotImplementedError";

export abstract class Strong {

    static easeIn(t:number, b:number, c:number, d:number):number {
        throw new NotImplementedError();
    }

    static easeInOut(t:number, b:number, c:number, d:number):number {
        throw new NotImplementedError();
    }

    static easeOut(t:number, b:number, c:number, d:number):number {
        throw new NotImplementedError();
    }

}
