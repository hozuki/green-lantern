/**
 * Created by MIC on 2015/11/18.
 */

import {InteractiveObject} from "./InteractiveObject";
import {Stage} from "./Stage";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {NotImplementedError} from "../../_util/NotImplementedError";
import {DisplayObject} from "./DisplayObject";
import {Point} from "../geom/Point";
import {ShaderManager} from "../../webgl/ShaderManager";
import {ShaderID} from "../../webgl/ShaderID";

export abstract class DisplayObjectContainer extends InteractiveObject {

    constructor(root:Stage, parent:DisplayObjectContainer) {
        super(root, parent);
        this._children = [];
    }

    mouseChildren:boolean = true;

    get numChildren():number {
        return this._children.length;
    }

    tabChildren:boolean = true;

    addChild(child:DisplayObject):DisplayObject {
        if (this._children.indexOf(child) < 0) {
            this._children.push(child);
        }
        child.childIndex = this._children.length - 1;
        return child;
    }

    addChildAt(child:DisplayObject, index:number):DisplayObject {
        if (this._children.indexOf(child) < 0) {
            if (index === 0) {
                this._children.unshift(child);
            } else if (index === this._children.length - 1) {
                this._children.push(child);
            } else {
                this._children = this._children.slice(0, index - 1).concat(child).concat(this._children.slice(index, this._children.length - 1));
            }
        }
        child.childIndex = index;
        return child;
    }

    areInaccessibleObjectsUnderPoint(point:Point):boolean {
        throw new NotImplementedError();
    }

    contains(child:DisplayObject):boolean {
        var result = false;
        for (var i = 0; i < this._children.length; ++i) {
            if (this._children[i] === child) {
                return true;
            }
            if (this._children[i] instanceof DisplayObjectContainer) {
                result = (<DisplayObjectContainer>this._children[i]).contains(child);
                if (result) {
                    return true;
                }
            }
        }
        return false;
    }

    getChildAt(index:number):DisplayObject {
        if (index < 0 || index > this._children.length - 1) {
            return null;
        } else {
            return this._children[index];
        }
    }

    getChildByName(name:string):DisplayObject {
        if (this._children.length === 0) {
            return null;
        }
        var result:DisplayObject = null;
        for (var i = 0; i < this._children.length; ++i) {
            if (this._children[i].name === name) {
                return this._children[i];
            }
            if (this._children[i] instanceof DisplayObjectContainer) {
                result = (<DisplayObjectContainer>this._children[i]).getChildByName(name);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }

    getChildIndex(child:DisplayObject):number {
        return this._children.indexOf(child);
    }

    getObjectsUnderPoint(point:Point):DisplayObject[] {
        throw new NotImplementedError();
    }

    removeChild(child:DisplayObject):DisplayObject {
        if (this._children.indexOf(child) >= 0) {
            var childIndex = child.childIndex;
            return this.removeChildAt(childIndex);
        } else {
            return null;
        }
    }

    removeChildAt(index:number):DisplayObject {
        if (index < 0 || index >= this.numChildren) {
            return null;
        }
        var child = this._children[index];
        for (var i = index + 1; i < this._children.length; i++) {
            this._children[i].childIndex++;
        }
        this._children.splice(index, 1);
        return child;
    }

    setChildIndex(child:DisplayObject, index:number):void {
        throw new NotImplementedError();
    }

    swapChildren(child1:DisplayObject, child2:DisplayObject):void {
        throw new NotImplementedError();
    }

    swapChildrenAt(index1:number, index2:number):void {
        throw new NotImplementedError();
    }

    get width():number {
        throw new NotImplementedError();
    }

    set width(v:number) {
        throw new NotImplementedError();
    }

    get height():number {
        throw new NotImplementedError();
    }

    set height(v:number) {
        throw new NotImplementedError();
    }

    dispatchEvent(event:Event, data?:any):boolean {
        var r = super.dispatchEvent(event, data);
        for (var i = 0; i < this._children.length; i++) {
            this._children[i].dispatchEvent(event, data);
        }
        return r;
    }

    update():void {
        if (this.enabled) {
            super.update();
            for (var i = 0; i < this._children.length; ++i) {
                this._children[i].update();
            }
        }
    }

    render(renderer:WebGLRenderer):void {
        if (this.visible && this.alpha > 0) {
            this.__preprocess(renderer);
            this.__render(renderer);
            for (var i = 0; i < this._children.length; ++i) {
                var child = this._children[i];
                child.render(renderer);
                renderer.copyRenderTargetContent(child.outputRenderTarget, this._rawRenderTarget, false);
            }
            this.__postprocess(renderer);
        } else {
            //this.outputRenderTarget.clear();
        }
    }

    protected __selectShader(shaderManager:ShaderManager):void {
        shaderManager.selectShader(ShaderID.REPLICATE);
    }

    protected _children:DisplayObject[] = null;

}
