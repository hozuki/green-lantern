/**
 * Created by MIC on 2015/12/26.
 */

import {DisplayObjectContainer} from "../../flash/display/DisplayObjectContainer";
import {Stage} from "../../flash/display/Stage";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {NotImplementedError} from "../../../../lib/glantern-utils/src/NotImplementedError";

export class Canvas extends DisplayObjectContainer {

    constructor(root:Stage, parent:DisplayObjectContainer) {
        super(root, parent);
    }

    protected __update():void {
        throw new NotImplementedError();
    }

    protected __render(renderer:WebGLRenderer):void {
        throw new NotImplementedError();
    }

}
