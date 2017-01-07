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

export default class SolidFillRenderer extends FillRendererBase {

    constructor(graphics: Graphics, startX: number, startY: number, color: number, alpha: number) {
        super(graphics, startX, startY);
        this._a = MathUtil.clamp(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8 ) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void {
        const currentContour = this._$getContourForLines();
        if (!this.hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this.currentX, this.currentY, GraphicsConst.Z0);
        }
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
            currentContour.push(xa, ya, GraphicsConst.Z0);
        }
        this.currentX = x;
        this.currentY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    curveTo(cx: number, cy: number, x: number, y: number): void {
        const currentContour = this._$getContourForLines();
        if (!this.hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this.currentX, this.currentY, GraphicsConst.Z0);
        }
        const fromX = this.currentX, fromY = this.currentY;
        for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
            const j = i / GraphicsConst.CurveAccuracy;
            let xa = fromX + (cx - fromX) * j;
            let ya = fromY + (cy - fromY) * j;
            xa = xa + (cx + (x - cx) * j - xa) * j;
            ya = ya + (cy + (y - cy) * j - ya) * j;
            currentContour.push(xa, ya, GraphicsConst.Z0);
        }
        this.currentX = x;
        this.currentY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    drawCircle(x: number, y: number, radius: number): void {
        this.moveTo(x, y);
        const currentContour = this._$getContourForClosedShapes();
        const halfPi = Math.PI / 2;
        currentContour.push(this.currentX + radius, this.currentY, GraphicsConst.Z0);
        let thetaBegin = 0;
        // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
        for (let k = 0; k < 4; k++) {
            for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
                const thetaNext = thetaBegin - i / GraphicsConst.CurveAccuracy * halfPi;
                const x2 = x + radius * Math.cos(thetaNext);
                const y2 = y + radius * Math.sin(thetaNext);
                currentContour.push(x2, y2, GraphicsConst.Z0);
            }
            thetaBegin -= halfPi;
        }
        this.currentX = x + radius;
        this.currentY = y;
        this.lastPathStartX = x + radius;
        this.lastPathStartY = y;
        this.becomeDirty();
        this._startingNewContour = false;
    }

    drawEllipse(x: number, y: number, width: number, height: number): void {
        this.moveTo(x, y + height / 2);
        const currentContour = this._$getContourForClosedShapes();
        const centerX = x + width / 2, centerY = y + height / 2;
        const halfPi = Math.PI / 2;
        currentContour.push(this.currentX, this.currentY, GraphicsConst.Z0);
        let thetaBegin = Math.PI;
        // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
        // Brute, huh? Luckily there are 20 segments per PI/2...
        for (let k = 0; k < 4; k++) {
            for (let i = 1; i <= GraphicsConst.CurveAccuracy; i++) {
                const thetaNext = thetaBegin - i / GraphicsConst.CurveAccuracy * halfPi;
                const x2 = centerX + width / 2 * Math.cos(thetaNext);
                const y2 = centerY + height / 2 * Math.sin(thetaNext);
                currentContour.push(x2, y2, GraphicsConst.Z0);
            }
            thetaBegin -= halfPi;
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
        currentContour.push(x, y, GraphicsConst.Z0);
        currentContour.push(x + width, y, GraphicsConst.Z0);
        currentContour.push(x + width, y + height, GraphicsConst.Z0);
        currentContour.push(x, y + height, GraphicsConst.Z0);
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
            currentContour.push(this.currentX, this.currentY, GraphicsConst.Z0);
        }
        currentContour.push(x, y, GraphicsConst.Z0);
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
                for (let j = 0; j < contour.length; j += 3) {
                    const coords = [contour[j], contour[j + 1], contour[j + 2]];
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
        const vertexCount = vertexNumberCount / 3;

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
