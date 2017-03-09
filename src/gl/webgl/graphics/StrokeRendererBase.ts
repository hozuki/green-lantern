/**
 * Created by MIC on 2015/11/20.
 */
import GraphicsDataRendererBase from "./GraphicsDataRendererBase";
import Graphics from "../../flash/display/Graphics";
import IStrokeDataRenderer from "./IStrokeDataRenderer";

abstract class StrokeRendererBase extends GraphicsDataRendererBase implements IStrokeDataRenderer {

    constructor(graphics: Graphics, lastPathStartX: number, lastPathStartY: number, currentX: number, currentY: number) {
        super(graphics, lastPathStartX, lastPathStartY, currentX, currentY);
        this._lineVerticesStorage = [[0, 0], [0, 0], [0, 0], [0, 0]];
    }

    moveTo(x: number, y: number): void {
        // This action seems weird...
        if (this.graphics.$isFilling) {
            this.closePath();
        }
        this.currentX = x;
        this.currentY = y;
        this.lastPathStartX = x;
        this.lastPathStartY = y;
    }

    protected _$getSimLineVertices(x1: number, y1: number, x2: number, y2: number, width: number): number[] {
        if (width < 0) {
            return [];
        }
        const halfWidth = width / 2;
        const lineVerticesStorage = this._lineVerticesStorage;
        const vert1 = lineVerticesStorage[0],
            vert2 = lineVerticesStorage[1],
            vert3 = lineVerticesStorage[2],
            vert4 = lineVerticesStorage[3];
        if (x1 === x2) {
            vert1[0] = x1 - halfWidth;
            vert1[1] = y1 > y2 ? y1 + halfWidth : y1 - halfWidth;
            vert2[0] = x1 + halfWidth;
            vert2[1] = y1 > y2 ? y1 + halfWidth : y1 - halfWidth;
            vert3[0] = x2 - halfWidth;
            vert3[1] = y1 > y2 ? y2 - halfWidth : y2 + halfWidth;
            vert4[0] = x2 + halfWidth;
            vert4[1] = y1 > y2 ? y2 - halfWidth : y2 + halfWidth;
        } else {
            const slope = (y2 - y1) / (x2 - x1);
            const ct = 1 / Math.sqrt(1 + slope * slope);
            const st = Math.sqrt(1 - ct * ct);
            // dx/dy: additional length considering the line width perpendicular to the line itself
            const dx = halfWidth * st;
            const dy = halfWidth * ct;
            // dtx/dty: additional length considering the line width at end points
            const dtx = dy;
            const dty = dx;
            // move the line to their new end points
            if (x1 > x2) {
                x1 += dtx;
                x2 -= dtx;
            } else {
                x1 -= dtx;
                x2 += dtx;
            }
            if (y1 > y2) {
                y1 += dty;
                y2 -= dty;
            } else {
                y1 -= dty;
                y2 += dty;
            }
            // and calculate simulating rectangle
            vert1[0] = x1 - dx;
            vert2[0] = x1 + dx;
            vert3[0] = x2 - dx;
            vert4[0] = x2 + dx;
            if (slope >= 0) {
                vert1[1] = y1 + dy;
                vert2[1] = y1 - dy;
                vert3[1] = y2 + dy;
                vert4[1] = y2 - dy;
            } else {
                vert1[1] = y1 - dy;
                vert2[1] = y1 + dy;
                vert3[1] = y2 - dy;
                vert4[1] = y2 + dy;
            }
        }
        return [
            vert1[0], vert1[1], vert2[0], vert2[1],
            vert3[0], vert3[1], vert4[0], vert4[1]
        ];
    }

    private _lineVerticesStorage: number[][] = null;

}

export default StrokeRendererBase;
