/**
 * Created by MIC on 2015/12/23.
 */

export class TextLineMetrics {

    constructor(x: number, width: number, height: number, ascent: number, descent: number, leading: number) {
        this.x = x;
        this.width = width;
        this.height = height;
        this.ascent = ascent;
        this.descent = descent;
        this.leading = leading;
    }

    ascent: number = 0;
    descent: number = 0;
    height: number = 0;
    leading: number = 0;
    width: number = 0;
    x: number = 0;

}
