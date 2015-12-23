/**
 * Created by MIC on 2015/11/20.
 */

import {DisplayObject} from "./DisplayObject";
import {Stage} from "./Stage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Graphics} from "./Graphics";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {ShaderManager} from "../../webgl/ShaderManager";
import {ShaderID} from "../../webgl/ShaderID";

export class Shape extends DisplayObject {

    constructor(root:Stage, parent:DisplayObjectContainer) {
        super(root, parent);
        this._graphics = new Graphics(this, root.worldRenderer);
    }

    dispose():void {
        super.dispose();
        this._graphics.dispose();
        this._graphics = null;
    }

    get graphics():Graphics {
        return this._graphics;
    }

    protected __update():void {
        this._graphics.update();
    }

    protected __render(renderer:WebGLRenderer):void {
        this._graphics.render(renderer, this._rawRenderTarget, true);
    }

    protected __selectShader(shaderManager:ShaderManager):void {
        shaderManager.selectShader(ShaderID.PRIMITIVE);
    }

    private _graphics:Graphics = null;

}
