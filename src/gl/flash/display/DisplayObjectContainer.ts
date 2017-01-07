/**
 * Created by MIC on 2015/11/18.
 */
import InteractiveObject from "./InteractiveObject";
import Stage from "./Stage";
import WebGLRenderer from "../../webgl/WebGLRenderer";
import DisplayObject from "./DisplayObject";
import Point from "../geom/Point";
import ShaderManager from "../../webgl/ShaderManager";
import NotImplementedError from "../errors/NotImplementedError";
import TimeInfo from "../../mic/TimeInfo";
import MathUtil from "../../mic/MathUtil";

abstract class DisplayObjectContainer extends InteractiveObject {

    constructor(root: Stage, parent: DisplayObjectContainer) {
        super(root, parent);
        this._children = [];
    }

    mouseChildren: boolean = true;

    get numChildren(): number {
        return this._children.length;
    }

    tabChildren: boolean = true;

    addChild(child: DisplayObject): DisplayObject {
        const children = this._children;
        if (children.indexOf(child) < 0) {
            children.push(child);
        }
        child.childIndex = children.length - 1;
        return child;
    }

    addChildAt(child: DisplayObject, index: number): DisplayObject {
        const children = this._children;
        if (children.indexOf(child) < 0) {
            if (index === 0) {
                children.unshift(child);
            } else if (index === children.length - 1) {
                children.push(child);
            } else {
                index = MathUtil.clamp(index, 0, children.length);
                children.splice(index, 0, child);
            }
            child.childIndex = index;
        }
        return child;
    }

    areInaccessibleObjectsUnderPoint(point: Point): boolean {
        throw new NotImplementedError();
    }

    contains(child: DisplayObject): boolean {
        const children = this._children;
        if (children.length === 0) {
            return false;
        }
        let result = false;
        for (let i = 0; i < children.length; ++i) {
            if (children[i] === child) {
                return true;
            }
            if (children[i] instanceof DisplayObjectContainer) {
                result = (<DisplayObjectContainer>children[i]).contains(child);
                if (result) {
                    return true;
                }
            }
        }
        return false;
    }

    getChildAt(index: number): DisplayObject {
        const children = this._children;
        if (index < 0 || index > children.length - 1) {
            return null;
        } else {
            return children[index];
        }
    }

    getChildByName(name: string): DisplayObject {
        const children = this._children;
        if (children.length === 0) {
            return null;
        }
        let result: DisplayObject = null;
        for (let i = 0; i < children.length; ++i) {
            if (children[i].name === name) {
                return children[i];
            }
            if (children[i] instanceof DisplayObjectContainer) {
                result = (<DisplayObjectContainer>children[i]).getChildByName(name);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    getChildIndex(child: DisplayObject): number {
        return this._children.indexOf(child);
    }

    getObjectsUnderPoint(point: Point): DisplayObject[] {
        throw new NotImplementedError();
    }

    removeChild(child: DisplayObject): DisplayObject {
        const childIndex = this._children.indexOf(child);
        if (childIndex >= 0) {
            return this.removeChildAt(childIndex);
        } else {
            return null;
        }
    }

    removeChildAt(index: number): DisplayObject {
        const children = this._children;
        if (index < 0 || index >= children.length) {
            return null;
        }
        const child = children[index];
        for (let i = index + 1; i < children.length; i++) {
            children[i].childIndex++;
        }
        children.splice(index, 1);
        return child;
    }

    setChildIndex(child: DisplayObject, index: number): void {
        throw new NotImplementedError();
    }

    swapChildren(child1: DisplayObject, child2: DisplayObject): void {
        throw new NotImplementedError();
    }

    swapChildrenAt(index1: number, index2: number): void {
        throw new NotImplementedError();
    }

    get width(): number {
        throw new NotImplementedError();
    }

    set width(v: number) {
        throw new NotImplementedError();
    }

    get height(): number {
        throw new NotImplementedError();
    }

    set height(v: number) {
        throw new NotImplementedError();
    }

    dispatchEvent(event: Event, data?: any): boolean {
        const r = super.dispatchEvent(event, data);
        const children = this._children;
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                children[i].dispatchEvent(event, data);
            }
        }
        return r;
    }

    $update(timeInfo: TimeInfo): void {
        super.$update(timeInfo);
        const children = this._children;
        if (this.enabled) {
            if (children.length > 0) {
                for (let i = 0; i < children.length; ++i) {
                    children[i].$update(timeInfo);
                }
            }
        }
    }

    $render(renderer: WebGLRenderer): void {
        if (!this.visible || this.alpha <= 0) {
            return;
        }
        this._$beforeRender(renderer);
        this._$render(renderer);
        const children = this._children;
        if (children.length > 0) {
            for (let i = 0; i < children.length; ++i) {
                if (this._$shouldProcessMasking() && !renderer.isStencilTestEnabled) {
                    renderer.beginDrawMaskedObjects();
                }
                children[i].$render(renderer);
            }
        }
        this._$afterRender(renderer);
    }

    $renderRaw(renderer: WebGLRenderer): void {
        if (!this.visible || this.alpha <= 0) {
            return;
        }
        this._$render(renderer);
        const children = this._children;
        if (children.length > 0) {
            for (let i = 0; i < children.length; ++i) {
                children[i].$renderRaw(renderer);
            }
        }
    }

    $requestUpdateTransform(): void {
        this._isTransformDirty = true;
        const children = this._children;
        if (children.length > 0) {
            for (let i = 0; i < children.length; ++i) {
                children[i].$requestUpdateTransform();
            }
        }
    }

    protected _$selectShader(shaderManager: ShaderManager): void {
        // Do nothing
    }

    protected _children: DisplayObject[] = null;

}

export default DisplayObjectContainer;
