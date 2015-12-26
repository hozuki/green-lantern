/**
 * Created by MIC on 2015/11/18.
 */

import {Stage} from "./Stage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Transform} from "../geom/Transform";
import {NotImplementedError} from "../../_util/NotImplementedError";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {Rectangle} from "../geom/Rectangle";
import {IWebGLElement} from "../../webgl/IWebGLElement";
import {IBitmapDrawable} from "./IBitmapDrawable";
import {EventDispatcher} from "../events/EventDispatcher";
import {_util} from "../../_util/_util";
import {BlendMode} from "./BlendMode";
import {RenderTarget2D} from "../../webgl/RenderTarget2D";
import {ShaderID} from "../../webgl/ShaderID";
import {ShaderManager} from "../../webgl/ShaderManager";
import {UniformCache} from "../../webgl/UniformCache";
import {BitmapFilter} from "../filters/BitmapFilter";

export abstract class DisplayObject extends EventDispatcher implements IBitmapDrawable, IWebGLElement {

    constructor(root:Stage, parent:DisplayObjectContainer) {
        super();
        this._root = root;
        this._stage = root;
        this._parent = parent;
        this._filters = [];
        this._transform = new Transform();
        if (root !== null) {
            this._rawRenderTarget = root.worldRenderer.createRenderTarget();
        }
        this._isRoot = root === null;
    }

    get alpha():number {
        return this._alpha;
    }

    set alpha(v:number) {
        this._alpha = _util.limitInto(v, 0, 1);
    }

    blendMode:string = BlendMode.NORMAL;

    get cacheAsBitmap():boolean {
        throw new NotImplementedError();
    }

    set cacheAsBitmap(v:boolean) {
        throw new NotImplementedError();
    }

    get childIndex():number {
        return this._childIndex;
    }

    // DO NOT call manually
    set childIndex(v:number) {
        this._childIndex = v;
    }

    dispose():void {
        super.dispose();
        this._root.worldRenderer.releaseRenderTarget(this._rawRenderTarget);
        this.filters = [];
    }

    enabled:boolean = true;

    get filters():BitmapFilter[] {
        return this._filters.slice();
    }

    set filters(v:BitmapFilter[]) {
        var i:number;
        var hasFiltersBefore = this.__shouldProcessFilters();
        if (hasFiltersBefore) {
            for (i = 0; i < this._filters.length; ++i) {
                this._filters[i].notifyRemoved();
            }
        }
        this._filters = v;
        var hasFiltersNow = this.__shouldProcessFilters();
        if (hasFiltersNow) {
            for (i = 0; i < this._filters.length; ++i) {
                this._filters[i].notifyAdded();
            }
        }
        if (hasFiltersBefore !== hasFiltersNow) {
            // Update filtered RenderTarget2D state.
            if (hasFiltersBefore) {
                this._filteredRenderTarget.dispose();
                this._filteredRenderTarget = null;
            } else if (hasFiltersNow) {
                this._filteredRenderTarget = this._root.worldRenderer.createRenderTarget();
            }
        }
    }

    get height():number {
        return this._height;
    }

    set height(v:number) {
        this._height = v;
    }

    mask:DisplayObject = null;

    get mouseX():number {
        throw new NotImplementedError();
    }

    get mouseY():number {
        throw new NotImplementedError();
    }

    get name():string {
        return this._name;
    }

    set name(v:string) {
        this._name = v;
    }

    get parent():DisplayObjectContainer {
        return this._parent;
    }

    get root():DisplayObject {
        return this._root;
    }

    get rotation():number {
        return this._rotation;
    }

    set rotation(v:number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        this._rotation = v;
    }

    get rotationX():number {
        return this._rotationX;
    }

    set rotationX(v:number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        this._rotationX = v;
    }

    get rotationY():number {
        return this._rotationY;
    }

    set rotationY(v:number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        this._rotationY = v;
    }

    get rotationZ():number {
        return this._rotationZ;
    }

    set rotationZ(v:number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        this._rotationZ = v;
    }

    get stage():Stage {
        return this._stage;
    }

    get transform():Transform {
        return this._transform;
    }

    visible:boolean = true;

    get width():number {
        return this._width;
    }

    set width(v:number) {
        this._width = v;
    }

    get x():number {
        return this._x;
    }

    set x(v:number) {
        this._x = v;
    }

    get y():number {
        return this._y;
    }

    set y(v:number) {
        this._y = v;
    }

    get z():number {
        return this._z;
    }

    set z(v:number) {
        this._z = v;
    }

    getBounds(targetCoordinateSpace:DisplayObject):Rectangle {
        throw new NotImplementedError();
    }

    getRect(targetCoordinateSpace:DisplayObject):Rectangle {
        throw new NotImplementedError();
    }

    update():void {
        if (this.enabled) {
            this.__update();
        }
    }

    render(renderer:WebGLRenderer):void {
        if (this.visible && this.alpha > 0) {
            this.__preprocess(renderer);
            this.__render(renderer);
            this.__postprocess(renderer);
        } else {
            this.outputRenderTarget.clear();
        }
    }

    get outputRenderTarget():RenderTarget2D {
        return this.__shouldProcessFilters() ? this._filteredRenderTarget : this._rawRenderTarget;
    }

    protected abstract __update():void;

    protected abstract __render(renderer:WebGLRenderer):void;

    /**
     * Override this function to select the proper shader.
     * @param shaderManager {ShaderManager} The shader manager.
     * @example
     * protected __selectShader(shaderManager: ShaderManager): void {
     * &nbsp;&nbsp;shaderManager.selectShader(ShaderID.PRIMITIVE);
     * }
     */
    protected abstract __selectShader(shaderManager:ShaderManager):void;

    protected __preprocess(renderer:WebGLRenderer):void {
        var manager = renderer.shaderManager;
        this.__selectShader(manager);
        this.transform.matrix3D.setTransformTo(this.x, this.y, this.z);
        manager.currentShader.changeValue("uTransformMatrix", (u:UniformCache):void => {
            u.value = this.transform.matrix3D.toArray();
        });
        manager.currentShader.changeValue("uAlpha", (u:UniformCache):void => {
            u.value = this.alpha;
        });
        manager.currentShader.syncUniforms();
        renderer.setBlendMode(this.blendMode);
    }

    protected __postprocess(renderer:WebGLRenderer):void {
        if (this.__shouldProcessFilters()) {
            var filterManager = renderer.filterManager;
            filterManager.pushFilterGroup(this.filters);
            filterManager.processFilters(renderer, this._rawRenderTarget, this._filteredRenderTarget, true);
            filterManager.popFilterGroup();
        }
    }

    private __shouldProcessFilters():boolean {
        return this._filters !== null && this._filters.length > 0;
    }

    protected _parent:DisplayObjectContainer = null;
    protected _root:Stage = null;
    protected _name:string = "";
    protected _rotation:number = 0;
    protected _rotationX:number = 0;
    protected _rotationY:number = 0;
    protected _rotationZ:number = 0;
    protected _scaleX:number = 1;
    protected _scaleY:number = 1;
    protected _scaleZ:number = 1;
    protected _stage:Stage = null;
    protected _height:number = 0;
    protected _width:number = 0;
    protected _x:number = 0;
    protected _y:number = 0;
    protected _z:number = 0;
    protected _childIndex:number = -1;
    protected _alpha:number = 1;
    protected _filters:BitmapFilter[] = null;
    protected _transform:Transform = null;
    protected _rawRenderTarget:RenderTarget2D = null;
    private _filteredRenderTarget:RenderTarget2D = null;
    private _isRoot:boolean = false;

}
