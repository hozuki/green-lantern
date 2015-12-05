/**
 * Created by MIC on 2015/11/18.
 */

import {DisplayObject} from "./DisplayObject";
import {Stage} from "./Stage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";

export abstract class InteractiveObject extends DisplayObject {

    constructor(root:Stage, parent:DisplayObjectContainer) {
        super(root, parent);
    }

    doubleClickEnabled:boolean = true;
    focusRect:boolean = true;
    mouseEnabled:boolean = true;
    needsSoftKeyboard:boolean = false;
    tabEnabled:boolean = true;
    tabIndex:number = -1;

}
