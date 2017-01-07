/**
 * Created by MIC on 2015/11/18.
 */
import Stage from "./Stage";
import DisplayObjectContainer from "./DisplayObjectContainer";
import Transform from "../geom/Transform";
import WebGLRenderer from "../../webgl/WebGLRenderer";
import Rectangle from "../geom/Rectangle";
import IWebGLElement from "../../webgl/IWebGLElement";
import IBitmapDrawable from "./IBitmapDrawable";
import EventDispatcher from "../events/EventDispatcher";
import BlendMode from "./BlendMode";
import RenderTarget2D from "../../webgl/targets/RenderTarget2D";
import ShaderManager from "../../webgl/ShaderManager";
import UniformCache from "../../webgl/UniformCache";
import BitmapFilter from "../filters/BitmapFilter";
import Matrix3D from "../geom/Matrix3D";
import Vector3D from "../geom/Vector3D";
import NotImplementedError from "../errors/NotImplementedError";
import MathUtil from "../../mic/MathUtil";
import TimeInfo from "../../mic/TimeInfo";
import RenderHelper from "../../webgl/RenderHelper";

abstract class DisplayObject extends EventDispatcher implements IBitmapDrawable, IWebGLElement {

    constructor(root: Stage, parent: DisplayObjectContainer) {
        super();
        this._root = root;
        this._stage = root;
        this._parent = parent;
        this._filters = [];
        this._transform = new Transform();
        this._isRoot = root === null;
    }

    get alpha(): number {
        return this._alpha;
    }

    set alpha(v: number) {
        const alpha = MathUtil.clamp(v, 0, 1);
        const b = alpha !== this._alpha;
        this._alpha = alpha;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get blendMode(): string {
        return this._blendMode;
    }

    set blendMode(v: string) {
        const b = v !== this._blendMode;
        this._blendMode = v;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get cacheAsBitmap(): boolean {
        throw new NotImplementedError();
    }

    set cacheAsBitmap(v: boolean) {
        throw new NotImplementedError();
    }

    get childIndex(): number {
        return this._childIndex;
    }

    // DO NOT call manually
    set childIndex(v: number) {
        this._childIndex = v;
    }

    dispose(): void {
        super.dispose();
        this.filters = [];
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(v: boolean) {
        const b = v !== this.enabled;
        this._enabled = v;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get filters(): BitmapFilter[] {
        return this._filters.slice();
    }

    set filters(v: BitmapFilter[]) {
        let hasFiltersBefore = this.__shouldProcessFilters();
        let filters = this._filters;
        if (hasFiltersBefore) {
            for (let i = 0; i < filters.length; ++i) {
                filters[i].notifyRemoved();
            }
        }
        filters = this._filters = v || [];
        let hasFiltersNow = this.__shouldProcessFilters();
        if (hasFiltersNow) {
            for (let i = 0; i < filters.length; ++i) {
                filters[i].notifyAdded();
            }
        }
        this.__updateBufferTargetStatus();
    }

    get height(): number {
        return this._height;
    }

    set height(v: number) {
        this._height = v;
    }

    get mask(): DisplayObject {
        return this._mask;
    }

    set mask(v: DisplayObject) {
        this._mask = v;
        this.__updateBufferTargetStatus();
    }

    get mouseX(): number {
        throw new NotImplementedError();
    }

    get mouseY(): number {
        throw new NotImplementedError();
    }

    get name(): string {
        return this._name;
    }

    set name(v: string) {
        this._name = v;
    }

    get parent(): DisplayObjectContainer {
        return this._parent;
    }

    get root(): DisplayObject {
        return this._root;
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(v: number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        const b = v !== this._rotation;
        this._rotation = v;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get rotationX(): number {
        return this._rotationX;
    }

    set rotationX(v: number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        const b = v != this._rotationX;
        this._rotationX = v;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get rotationY(): number {
        return this._rotationY;
    }

    set rotationY(v: number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        const b = v !== this._rotationY;
        this._rotationY = v;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get rotationZ(): number {
        return this._rotationZ;
    }

    set rotationZ(v: number) {
        while (v < -180) {
            v += 360;
        }
        while (v > 180) {
            v -= 360;
        }
        const b = v != this._rotationZ;
        this._rotationZ = v;
        if (b) {
            this._isRedrawSuggested = true;
        }
    }

    get stage(): Stage {
        return this._stage;
    }

    // In current version there is still no way to inform a Transform object change. So setting values in 'transform'
    // property does not suggest to redraw.
    get transform(): Transform {
        return this._transform;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(v: boolean) {
        this._visible = v;
    }

    get width(): number {
        return this._width;
    }

    set width(v: number) {
        this._width = v;
    }

    get x(): number {
        return this._x;
    }

    set x(v: number) {
        let b = this._x !== v;
        this._x = v;
        if (b) {
            this.$requestUpdateTransform();
        }
    }

    get y(): number {
        return this._y;
    }

    set y(v: number) {
        let b = this._y !== v;
        this._y = v;
        if (b) {
            this.$requestUpdateTransform();
        }
    }

    get z(): number {
        return this._z;
    }

    set z(v: number) {
        let b = this._z !== v;
        this._z = v;
        if (b) {
            this.$requestUpdateTransform();
        }
    }

    getBounds(targetCoordinateSpace: DisplayObject): Rectangle {
        throw new NotImplementedError();
    }

    getRect(targetCoordinateSpace: DisplayObject): Rectangle {
        throw new NotImplementedError();
    }

    $update(timeInfo: TimeInfo): void {
        if (this._isTransformDirty) {
            this._$updateTransform();
        }
        if (this.enabled) {
            this._$update(timeInfo);
        }
    }

    $render(renderer: WebGLRenderer): void {
        if (!this.visible || this.alpha <= 0) {
            return;
        }
        this._$beforeRender(renderer);
        this._$render(renderer);
        this._$afterRender(renderer);
    }

    /**
     * The raw $render function. It is used to $render the original shape of the {@link DisplayObject} when rendering
     * current stencil buffer.
     * @param renderer {WebGLRenderer}
     */
    $renderRaw(renderer: WebGLRenderer): void {
        if (this.visible && this.alpha > 0) {
            this._$render(renderer);
        }
    }

    $requestUpdateTransform(): void {
        this._isTransformDirty = true;
    }

    get $rawRoot(): Stage {
        return this._root;
    }

    get $isRoot(): boolean {
        return this._isRoot;
    }

    get $bufferTarget(): RenderTarget2D {
        return this._bufferTarget;
    }

    protected _$updateTransform(): void {
        let matrix3D: Matrix3D;
        if (this.$isRoot) {
            matrix3D = new Matrix3D();
        } else {
            matrix3D = this.parent.transform.matrix3D.clone();
        }
        matrix3D.prependTranslation(this.x, this.y, this.z);
        matrix3D.prependRotation(this.rotationX, Vector3D.X_AXIS);
        matrix3D.prependRotation(this.rotationY, Vector3D.Y_AXIS);
        matrix3D.prependRotation(this.rotationZ, Vector3D.Z_AXIS);
        this.transform.matrix3D.copyFrom(matrix3D);
        this._transformArray = matrix3D.toArray();
        this._isRedrawSuggested = true;
    }

    protected abstract _$update(timeInfo: TimeInfo): void;

    protected abstract _$render(renderer: WebGLRenderer): void;

    /**
     * Override this function to select the proper shader.
     * @param shaderManager {ShaderManager} The shader manager.
     * @example
     * protected _$selectShader(shaderManager: ShaderManager): void {
     * &nbsp;&nbsp;shaderManager.selectShader(ShaderID.PRIMITIVE);
     * }
     */
    protected abstract _$selectShader(shaderManager: ShaderManager): void;

    protected _$beforeRender(renderer: WebGLRenderer): void {
        if (this.__shouldHaveBufferTarget()) {
            const bufferTarget = this.$bufferTarget;
            renderer.currentRenderTarget = bufferTarget;
            bufferTarget.clear();
            if (this._$shouldProcessMasking()) {
                renderer.beginDrawMaskObject();
                this.mask.$renderRaw(renderer);
                renderer.beginDrawMaskedObjects();
            }
        } else {
            renderer.currentRenderTarget = null;
        }
        const shaderManager = renderer.shaderManager;
        this._$selectShader(shaderManager);
        const shader = shaderManager.currentShader;
        if (shader) {
            shader.changeValue("uTransformMatrix", (u: UniformCache): void => {
                u.value = this._transformArray;
            });
            shader.changeValue("uAlpha", (u: UniformCache): void => {
                u.value = this.alpha;
            });
        }
        renderer.blendMode = this.blendMode;
    }

    protected _$afterRender(renderer: WebGLRenderer): void {
        const hasMask = this._$shouldProcessMasking();
        if (hasMask) {
            renderer.beginDrawNormalObjects();
        }
        if (this.__shouldProcessFilters()) {
            let filterManager = renderer.filterManager;
            filterManager.pushFilterGroup(this.filters);
            filterManager.processFilters(renderer, this.$bufferTarget, renderer.screenRenderTarget, false);
            filterManager.popFilterGroup();
        } else if (hasMask) {
            RenderHelper.copyTargetContent(renderer, this.$bufferTarget, renderer.screenRenderTarget, false, true, false);
        }
        this._isRedrawSuggested = false;
    }

    protected _$shouldProcessMasking(): boolean {
        return this.mask !== null;
    }

    private __createBufferTarget(): RenderTarget2D {
        if (!this.__shouldHaveBufferTarget()) {
            return;
        }
        const t = this.$bufferTarget;
        if (t) {
            t.dispose();
        }
        return this._bufferTarget = this.$rawRoot.$worldRenderer.createRenderTarget();
    }

    private __releaseBufferTarget(): void {
        if (this.__shouldHaveBufferTarget()) {
            return;
        }
        this.$rawRoot.$worldRenderer.releaseRenderTarget(this.$bufferTarget);
        this._bufferTarget = null;
    }

    private __shouldProcessFilters(): boolean {
        // Don't use `filter` property, it clones an array and lowers performance.
        const filters = this._filters;
        return filters !== null && filters.length > 0;
    }

    private __shouldHaveBufferTarget(): boolean {
        return this.__shouldProcessFilters() || this._$shouldProcessMasking();
    }

    private __updateBufferTargetStatus(): void {
        const expected = this.__shouldHaveBufferTarget();
        const actual = this.$bufferTarget !== null;
        const hasMask = this._$shouldProcessMasking();
        if (actual) {
            this.$bufferTarget.isStencil = hasMask;
        }
        if (actual === expected) {
            return;
        }
        if (expected) {
            this.__createBufferTarget();
            this.$bufferTarget.isStencil = hasMask;
        } else {
            this.__releaseBufferTarget();
        }
        this._isRedrawSuggested = true;
    }

    protected _parent: DisplayObjectContainer = null;
    protected _root: Stage = null;
    protected _height: number = 0;
    protected _width: number = 0;
    protected _childIndex: number = -1;
    protected _isTransformDirty: boolean = true;
    protected _isRedrawSuggested = true;
    private _isRoot: boolean = false;
    private _alpha: number = 1;
    private _filters: BitmapFilter[] = null;
    private _bufferTarget: RenderTarget2D = null;
    private _transform: Transform = null;
    private _transformArray: Float32Array = null;
    private _name: string = "";
    private _rotation: number = 0;
    private _rotationX: number = 0;
    private _rotationY: number = 0;
    private _rotationZ: number = 0;
    private _scaleX: number = 1;
    private _scaleY: number = 1;
    private _scaleZ: number = 1;
    private _stage: Stage = null;
    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;
    private _blendMode: string = BlendMode.NORMAL;
    private _enabled: boolean = true;
    private _visible: boolean = true;
    private _mask: DisplayObject = null;

}

export default DisplayObject;
