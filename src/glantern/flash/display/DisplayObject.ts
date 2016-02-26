/**
 * Created by MIC on 2015/11/18.
 */

import {Stage} from "./Stage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {Transform} from "../geom/Transform";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {Rectangle} from "../geom/Rectangle";
import {IWebGLElement} from "../../webgl/IWebGLElement";
import {IBitmapDrawable} from "./IBitmapDrawable";
import {EventDispatcher} from "../events/EventDispatcher";
import {BlendMode} from "./BlendMode";
import {RenderTarget2D} from "../../webgl/RenderTarget2D";
import {ShaderID} from "../../webgl/ShaderID";
import {ShaderManager} from "../../webgl/ShaderManager";
import {UniformCache} from "../../webgl/UniformCache";
import {BitmapFilter} from "../filters/BitmapFilter";
import {Point} from "../geom/Point";
import {Matrix3D} from "../geom/Matrix3D";
import {Vector3D} from "../geom/Vector3D";
import {NotImplementedError} from "../../../../lib/glantern-utils/src/NotImplementedError";
import {GLUtil} from "../../../../lib/glantern-utils/src/GLUtil";

export abstract class DisplayObject extends EventDispatcher implements IBitmapDrawable, IWebGLElement {

    constructor(root:Stage, parent:DisplayObjectContainer) {
        super();
        this._root = root;
        this._stage = root;
        this._parent = parent;
        this._filters = [];
        this._transform = new Transform();
        this._isRoot = root === null;
    }

    get alpha():number {
        return this._alpha;
    }

    set alpha(v:number) {
        this._alpha = GLUtil.limitInto(v, 0, 1);
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
        if (hasFiltersNow !== hasFiltersBefore) {
            if (hasFiltersNow) {
                this.__createFilterTarget(this._root.worldRenderer);
            } else {
                this.__releaseFilterTarget();
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
        var b = this._x !== v;
        this._x = v;
        if (b) {
            this.requestUpdateTransform();
        }
    }

    get y():number {
        return this._y;
    }

    set y(v:number) {
        var b = this._y !== v;
        this._y = v;
        if (b) {
            this.requestUpdateTransform();
        }
    }

    get z():number {
        return this._z;
    }

    set z(v:number) {
        var b = this._z !== v;
        this._z = v;
        if (b) {
            this.requestUpdateTransform();
        }
    }

    getBounds(targetCoordinateSpace:DisplayObject):Rectangle {
        throw new NotImplementedError();
    }

    getRect(targetCoordinateSpace:DisplayObject):Rectangle {
        throw new NotImplementedError();
    }

    update():void {
        if (this._isTransformDirty) {
            this.__updateTransform();
        }
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
            //this.outputRenderTarget.clear();
        }
    }

    requestUpdateTransform():void {
        this._isTransformDirty = true;
    }

    protected __updateTransform():void {
        var matrix3D:Matrix3D;
        if (this._isRoot) {
            matrix3D = new Matrix3D();
        } else {
            matrix3D = this.parent.transform.matrix3D.clone();
        }
        matrix3D.prependTranslation(this.x, this.y, this.z);
        matrix3D.prependRotation(this.rotationX, Vector3D.X_AXIS);
        matrix3D.prependRotation(this.rotationY, Vector3D.Y_AXIS);
        matrix3D.prependRotation(this.rotationZ, Vector3D.Z_AXIS);
        this.transform.matrix3D.copyFrom(matrix3D);
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
        if (this.__shouldProcessFilters()) {
            this._filterTarget.clear();
            renderer.setRenderTarget(this._filterTarget);
        } else {
            renderer.setRenderTarget(null);
        }
        var manager = renderer.shaderManager;
        this.__selectShader(manager);
        var shader = manager.currentShader;
        if (!GLUtil.isUndefinedOrNull(shader)) {
            shader.changeValue("uTransformMatrix", (u:UniformCache):void => {
                u.value = this.transform.matrix3D.toArray();
            });
            shader.changeValue("uAlpha", (u:UniformCache):void => {
                u.value = this.alpha;
            });
        }
        renderer.setBlendMode(this.blendMode);
    }

    protected __postprocess(renderer:WebGLRenderer):void {
        if (this.__shouldProcessFilters()) {
            var filterManager = renderer.filterManager;
            filterManager.pushFilterGroup(this.filters);
            filterManager.processFilters(renderer, this._filterTarget, renderer.screenTarget, false);
            filterManager.popFilterGroup();
        }
    }

    protected __createFilterTarget(renderer:WebGLRenderer):void {
        if (this._filterTarget !== null) {
            return;
        }
        this._filterTarget = renderer.createRenderTarget();
    }

    protected __releaseFilterTarget():void {
        if (this._filterTarget === null) {
            return;
        }
        this._root.worldRenderer.releaseRenderTarget(this._filterTarget);
        this._filterTarget = null;
    }

    private __shouldProcessFilters():boolean {
        return this.filters !== null && this.filters.length > 0;
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
    protected _filterTarget:RenderTarget2D = null;
    protected _transform:Transform = null;
    protected _isTransformDirty:boolean = true;
    private _isRoot:boolean = false;

}
