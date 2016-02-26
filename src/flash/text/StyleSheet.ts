/**
 * Created by MIC on 2015/12/23.
 */

import {EventDispatcher} from "../events/EventDispatcher";
import {TextFormat} from "./TextFormat";
import {NotImplementedError} from "../../../lib/glantern-utils/src/NotImplementedError";

export class StyleSheet extends EventDispatcher {

    constructor() {
        super();
        throw new NotImplementedError();
    }

    clear():void {
        throw new NotImplementedError();
    }

    getStyle(styleName:string):any {
        throw new NotImplementedError();
    }

    parseCSS(cssText:string):void {
        throw new NotImplementedError();
    }

    setStyle(styleName:string, styleObject:any):void {
        throw new NotImplementedError();
    }

    transform(formatObject:any):TextFormat {
        throw new NotImplementedError();
    }

    dispose():void {
        super.dispose();
        throw new NotImplementedError();
    }

    get styleNames():string[] {
        throw new NotImplementedError();
    }

}
