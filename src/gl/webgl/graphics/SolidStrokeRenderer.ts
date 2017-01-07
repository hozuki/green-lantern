/**
 * Created by MIC on 2015/11/20.
 */
import WebGLRenderer from "../WebGLRenderer";
import Graphics from "../../flash/display/Graphics";
import StrokeRendererBase from "./StrokeRendererBase";
import GraphicsConst from "./GraphicsConst";
import RenderHelper from "../RenderHelper";
import NotImplementedError from "../../flash/errors/NotImplementedError";
import MathUtil from "../../mic/MathUtil";

export default class SolidStrokeRenderer extends StrokeRendererBase {

    constructor(graphics: Graphics, lastPathStartX: number, lastPathStartY: number, currentX: number, currentY: number, lineWidth: number, color: number, alpha: number) {
        super(graphics, lastPathStartX, lastPathStartY, currentX, currentY);
        this._a = MathUtil.clamp(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8 ) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
        this._w = lineWidth;
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void {
        if (this._w > 0) {
            const fromX = this.currentX, fromY = this.currentY;
            for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
                const j = i / GraphicsConst.CurveAccuracy;
                const dt1 = 1 - j;
                const dt2 = dt1 * dt1;
                const dt3 = dt2 * dt1;
                const t2 = j * j;
                const t3 = t2 * j;
                const xa = dt3 * fromX + 3 * dt2 * j * cx1 + 3 * dt1 * t2 * cx2 + t3 * x;
                const ya = dt3 * fromY + 3 * dt2 * j * cy1 + 3 * dt1 * t2 * cy2 + t3 * y;
                this.lineTo(xa, ya);
            }
            this.becomeDirty();
        }
        this.currentX = x;
        this.currentY = y;
    }

    curveTo(cx: number, cy: number, x: number, y: number): void {
        if (this._w > 0) {
            const fromX = this.currentX, fromY = this.currentY;
            for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
                const j = i / GraphicsConst.CurveAccuracy;
                let xa = fromX + (cx - fromX) * j;
                let ya = fromY + (cy - fromY) * j;
                xa = xa + (cx + (x - cx) * j - xa) * j;
                ya = ya + (cy + (y - cy) * j - ya) * j;
                this.lineTo(xa, ya);
            }
            this.becomeDirty();
        }
        this.currentX = x;
        this.currentY = y;
    }

    drawCircle(x: number, y: number, radius: number): void {
        this.moveTo(x - radius, y);
        if (this._w > 0) {
            const halfPi = Math.PI / 2;
            let thetaBegin = Math.PI;
            // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
            for (let k = 0; k < 4; k++) {
                for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
                    const thetaNext = thetaBegin - i / GraphicsConst.CurveAccuracy * halfPi;
                    const x2 = x + radius * Math.cos(thetaNext);
                    const y2 = y + radius * Math.sin(thetaNext);
                    this.lineTo(x2, y2);
                }
                thetaBegin -= halfPi;
            }
            this.becomeDirty();
        }
        this.currentX = x + radius;
        this.currentY = y;
        this.lastPathStartX = x + radius;
        this.lastPathStartY = y;
    }

    drawEllipse(x: number, y: number, width: number, height: number): void {
        this.moveTo(x, y + height / 2);
        if (this._w > 0) {
            const centerX = x + width / 2, centerY = y + height / 2;
            const halfPi = Math.PI / 2;
            let thetaBegin = Math.PI;
            // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
            // Brute, huh? Luckily there are 20 segments per PI/2...
            for (let k = 0; k < 4; k++) {
                for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
                    const thetaNext = thetaBegin - i / GraphicsConst.CurveAccuracy * halfPi;
                    const x2 = centerX + width / 2 * Math.cos(thetaNext);
                    const y2 = centerY + height / 2 * Math.sin(thetaNext);
                    this.lineTo(x2, y2);
                }
                thetaBegin -= halfPi;
            }
            this.becomeDirty();
        }
        this.currentX = x + width;
        this.currentY = y + height / 2;
        this.lastPathStartX = x + width;
        this.lastPathStartY = y + height / 2;
    }

    drawRect(x: number, y: number, width: number, height: number): void {
        this.moveTo(x, y);
        this.lineTo(x, y + height);
        this.lineTo(x + width, y + height);
        this.lineTo(x + width, y);
        this.lineTo(x, y);
        this.becomeDirty();
    }

    drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number = NaN): void {
        throw new NotImplementedError();
    }

    lineTo(x: number, y: number): void {
        if (this._w > 0) {
            const vertices = this._$getSimLineVertices(this.currentX, this.currentY, x, y, GraphicsConst.Z0, this._w);
            if (vertices.length > 0) {
                // Generated 4 vertices, matching with 6 indices (2 triangles)
                const cur = this.vertices.length / 3;
                // Count: 12
                Array.prototype.push.apply(this.vertices, vertices);
                const r = this._r, g = this._g, b = this._b, a = this._a;
                const colors: number[] = [
                    r * a, g * a, b * a, a,
                    r * a, g * a, b * a, a,
                    r * a, g * a, b * a, a,
                    r * a, g * a, b * a, a
                ];
                // Faster push()
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
                Array.prototype.push.apply(this.colors, colors);
                this.indices.push(cur, cur + 1, cur + 2, cur + 1, cur + 2, cur + 3);
                this.becomeDirty();
            }
        }
        this.currentX = x;
        this.currentY = y;
    }

    render(renderer: WebGLRenderer): void {
        if (this.vertices.length > 0) {
            const target = renderer.currentRenderTarget;
            RenderHelper.renderPrimitives2(renderer, target, this.vertexBuffer, this.colorBuffer, this.indexBuffer, false, target.isRoot, false);
        }
    }

    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;
    private _a: number = 1;
    private _w: number = 1;

}
