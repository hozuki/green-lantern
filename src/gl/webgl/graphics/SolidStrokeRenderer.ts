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
import BezierCurveSubdivider from "../../agg/BezierCurveSubdivider";
import QuadraticBezierCurveSubdivider from "../../agg/QuadraticBezierCurveSubdivider";

export default class SolidStrokeRenderer extends StrokeRendererBase {

    constructor(graphics: Graphics, lastPathStartX: number, lastPathStartY: number, currentX: number, currentY: number, lineWidth: number, color: number, alpha: number) {
        super(graphics, lastPathStartX, lastPathStartY, currentX, currentY);
        this._a = MathUtil.clamp(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
        this._w = lineWidth;
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void {
        if (this._w > 0) {
            const fromX = this.currentX, fromY = this.currentY;

            const segments = BezierCurveSubdivider.divide(fromX, fromY, cx1, cy1, cx2, cy2, x, y);

            for (let i = 2; i < segments.length; i += 2) {
                this.lineTo(segments[i], segments[i + 1]);
            }

            this.becomeDirty();
        }
        this.currentX = x;
        this.currentY = y;
    }

    curveTo(cx: number, cy: number, x: number, y: number): void {
        if (this._w > 0) {
            const fromX = this.currentX, fromY = this.currentY;

            const segments = QuadraticBezierCurveSubdivider.divide(fromX, fromY, cx, cy, x, y);

            for (let i = 2; i < segments.length; i += 2) {
                this.lineTo(segments[i], segments[i + 1]);
            }

            this.becomeDirty();
        }
        this.currentX = x;
        this.currentY = y;
    }

    drawCircle(x: number, y: number, radius: number): void {
        this.drawEllipse(x - radius, y - radius, radius * 2, radius * 2);
    }

    drawEllipse(x: number, y: number, width: number, height: number): void {
        this.moveTo(x + width, y + height / 2);

        if (this._w > 0) {
            const approxScale = 1.0;
            // noinspection JSSuspiciousNameCombination
            const ra = (width + height) / 4; // (=(rx+ry)/2)
            const da = Math.acos(ra / (ra + 0.125 / approxScale));
            const steps = Math.round(Math.PI * 2 / da);

            const rx = width / 2, ry = height / 2;
            const centerX = x + rx, centerY = y + ry;

            for (let i = 1; i <= steps; ++i) {
                const angle = i / steps * Math.PI * 2;
                const x = centerX + Math.cos(angle) * rx;
                const y = centerY + Math.sin(angle) * ry;
                this.lineTo(x, y);
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
            const vertices = this._$getSimLineVertices(this.currentX, this.currentY, x, y, this._w);
            if (vertices.length > 0) {
                // Generated 4 vertices, matching with 6 indices (2 triangles)
                const curIndex = this.vertices.length / GraphicsConst.VertexComponentCount;
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
                this.indices.push(curIndex, curIndex + 1, curIndex + 2, curIndex + 1, curIndex + 2, curIndex + 3);
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
