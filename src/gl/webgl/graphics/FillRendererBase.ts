/**
 * Created by MIC on 2015/11/20.
 */

import GraphicsDataRendererBase from "./GraphicsDataRendererBase";
import IFillDataRenderer from "./IFillDataRenderer";
import Graphics from "../../flash/display/Graphics";

abstract class FillRendererBase extends GraphicsDataRendererBase implements IFillDataRenderer {

    constructor(graphics: Graphics, currentX: number, currentY: number) {
        super(graphics, currentX, currentY, currentX, currentY);
        this._contours = [[]];
        this.beginIndex = -1;
        this.endIndex = -1;
        this._startingNewContour = true;
    }

    moveTo(x: number, y: number): void {
        // Consider the code sample:
        // g.beginFill(0xff0000, 1);
        // g.lineStyle(1, 0xffffff);
        // g.moveTo(100, 100);

        // Flash closes the path before each moveTo() call
        this.closePath();
        if (this.hasDrawnAnything) {
            if (this.currentX !== x || this.currentY !== y) {
                this._startingNewContour = true;
            }
        } else {
            this._startingNewContour = true;
        }
        this.currentX = x;
        this.currentY = y;
        this.lastPathStartX = x;
        this.lastPathStartY = y;
    }

    // Use to track the relative rendering order, based on stroke renderers' orders
    beginIndex: number = -1;
    endIndex: number = -1;

    protected _$getContourForClosedShapes(): number[] {
        let currentContour: number[];
        if (this.hasDrawnAnything) {
            currentContour = [];
            this._contours.push(currentContour);
            this._startingNewContour = false;
        } else {
            currentContour = this._contours[0];
        }
        return currentContour;
    }

    protected _$getContourForLines(): number[] {
        let currentContour: number[];
        if (this.hasDrawnAnything) {
            if (this._startingNewContour) {
                currentContour = [];
                this._contours.push(currentContour);
                this._startingNewContour = false;
            } else {
                currentContour = this._contours[this._contours.length - 1];
            }
        } else {
            currentContour = this._contours[0];
        }
        return currentContour;
    }

    // See libtess.js Degenerate Hourglass test.
    protected _contours: number[][] = null;
    protected _startingNewContour: boolean = true;

}

export default FillRendererBase;
