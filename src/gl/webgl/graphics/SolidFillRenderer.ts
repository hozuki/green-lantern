/**
 * Created by MIC on 2015/11/20.
 */
import * as libtess from "libtess";
import FillRendererBase from "./FillRendererBase";
import Graphics from "../../flash/display/Graphics";
import GraphicsConst from "./GraphicsConst";
import WebGLRenderer from "../WebGLRenderer";
import RenderHelper from "../RenderHelper";
import NotImplementedError from "../../flash/errors/NotImplementedError";
import MathUtil from "../../mic/MathUtil";
import BezierCurveSubdivider from "../../agg/BezierCurveSubdivider";
import QuadraticBezierCurveSubdivider from "../../agg/QuadraticBezierCurveSubdivider";

export default class SolidFillRenderer extends FillRendererBase {

    constructor(graphics: Graphics, startX: number, startY: number, color: number, alpha: number) {
        super(graphics, startX, startY);
        this._a = MathUtil.clamp(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void {
        const currentContour = this._$getContourForLines();
        const fromX = this.currentX, fromY = this.currentY;
        if (!this.hasDrawnAnything || this._startingNewContour) {
            currentContour.push(fromX, fromY);
        }

        const segments = BezierCurveSubdivider.divide(fromX, fromY, cx1, cy1, cx2, cy2, x, y);

        for (let i = 2; i < segments.length; i += 2) {
            currentContour.push(segments[i], segments[i + 1]);
        }

        this.currentX = x;
        this.currentY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    curveTo(cx: number, cy: number, x: number, y: number): void {
        const currentContour = this._$getContourForLines();
        const fromX = this.currentX, fromY = this.currentY;

        if (!this.hasDrawnAnything || this._startingNewContour) {
            currentContour.push(fromX, fromY);
        }

        const segments = QuadraticBezierCurveSubdivider.divide(fromX, fromY, cx, cy, x, y);

        for (let i = 2; i < segments.length; i += 2) {
            currentContour.push(segments[i], segments[i + 1]);
        }

        this.currentX = x;
        this.currentY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    drawCircle(x: number, y: number, radius: number): void {
        this.drawEllipse(x - radius, y - radius, radius * 2, radius * 2);
    }

    drawEllipse(x: number, y: number, width: number, height: number): void {
        this.moveTo(x + width, y + height / 2);
        const currentContour = this._$getContourForClosedShapes();
        currentContour.push(this.currentX, this.currentY);

        const approxScale = 1.0;
        // noinspection JSSuspiciousNameCombination
        const ra = (width + height) / 4; // (=(rx+ry)/2)
        const da = Math.acos(ra / (ra + 0.125 / approxScale));
        const steps = Math.round(Math.PI * 2 / da);

        const rx = width / 2, ry = height / 2;
        const centerX = x + width / 2, centerY = y + height / 2;

        for (let i = 1; i <= steps; ++i) {
            const angle = i / steps * Math.PI * 2;
            const x = centerX + Math.cos(angle) * rx;
            const y = centerY + Math.sin(angle) * ry;
            currentContour.push(x, y);
        }

        this.currentX = x + width;
        this.currentY = y + height / 2;
        this.lastPathStartX = x + width;
        this.lastPathStartY = y + height / 2;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    drawRect(x: number, y: number, width: number, height: number): void {
        this.moveTo(x, y);
        // Create a new contour and draw a independent rectangle, should not use lineTo().
        const currentContour = this._$getContourForClosedShapes();
        currentContour.push(x, y);
        currentContour.push(x + width, y);
        currentContour.push(x + width, y + height);
        currentContour.push(x, y + height);
        this.currentX = x;
        this.currentY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number = NaN): void {
        throw new NotImplementedError();
    }

    lineTo(x: number, y: number): void {
        const currentContour = this._$getContourForLines();
        if (!this.hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this.currentX, this.currentY);
        }
        currentContour.push(x, y);
        this.currentX = x;
        this.currentY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    update(): void {
        if (!this.isDirty) {
            return;
        }

        // Triangulate first
        const tess = this.graphics.$renderer.tessellator;
        tess.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_ODD);
        tess.gluTessNormal(0, 0, 1);
        const resultArray: number[][] = [];
        tess.gluTessBeginPolygon(resultArray);
        for (let i = 0; i < this._contours.length; i++) {
            const contour = this._contours[i];
            if (contour.length > 0) {
                tess.gluTessBeginContour();
                for (let j = 0; j < contour.length; j += GraphicsConst.VertexComponentCount) {
                    const coords = [contour[j], contour[j + 1]];
                    tess.gluTessVertex(coords, coords);
                }
                tess.gluTessEndContour();
            }
        }
        tess.gluTessEndPolygon();

        // Number of vertex data numbers.
        let vertexNumberCount = 0;
        for (let i = 0; i < resultArray.length; ++i) {
            vertexNumberCount += resultArray[i].length;
        }
        // Number of vertices.
        const vertexCount = vertexNumberCount / GraphicsConst.VertexComponentCount;

        const vertices = this.vertices = new Array<number>(vertexNumberCount);
        const colors = this.colors = new Array<number>(4 * vertexCount);
        const indices = this.indices = new Array<number>(vertexCount);

        let vertexNumberCounter = 0;
        for (let i = 0; i < resultArray.length; i++) {
            const tempArray = resultArray[i];
            for (let j = 0; j < tempArray.length; j++) {
                vertices[vertexNumberCounter] = tempArray[j];
                ++vertexNumberCounter;
            }
        }
        const r = this._r, g = this._g, b = this._b, a = this._a;
        for (let i = 0; i < vertexCount; ++i) {
            colors[i * 4] = r * a;
            colors[i * 4 + 1] = g * a;
            colors[i * 4 + 2] = b * a;
            colors[i * 4 + 3] = a;
            indices[i] = i;
        }

        // Then $update buffers
        super.update();
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

}
