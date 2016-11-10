/**
 * Created by MIC on 2015/12/26.
 */

import DisplayObjectContainer from "../../flash/display/DisplayObjectContainer";
import Stage from "../../flash/display/Stage";
import WebGLRenderer from "../../webgl/WebGLRenderer";
import TimeInfo from "../../mic/TimeInfo";

export default class Canvas extends DisplayObjectContainer {

    constructor(root: Stage, parent: DisplayObjectContainer) {
        super(root, parent);
    }

    protected _$update(timeInfo: TimeInfo): void {
    }

    protected _$render(renderer: WebGLRenderer): void {
    }

}
