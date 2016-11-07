/**
 * Created by MIC on 2015/11/17.
 */

import RgbaColor from "../RgbaColor";
import CommonUtil from "../CommonUtil";

/**
 * The class providing utility functions.
 */
abstract class GLUtil {

    static colorToCssSharp(color: number): string {
        color |= 0;
        return "#" + CommonUtil.padLeft(color.toString(16), 6, "0");
    }

    static colorToCssRgba(color: number): string {
        color |= 0;
        var a = (color >> 24) & 0xff;
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    static rgb(r: number, g: number, b: number): number {
        return GLUtil.rgba(r, g, b, 0xff);
    }

    static rgba(r: number, g: number, b: number, a: number): number {
        return ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
    }

    static decomposeRgb(color: number): RgbaColor {
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return {
            r: r, g: g, b: b, a: 0xff
        };
    }

    static decomposeRgba(color: number): RgbaColor {
        var a = (color >> 24) & 0xff;
        var r = (color >> 16) & 0xff;
        var g = (color >> 8) & 0xff;
        var b = color & 0xff;
        return {
            r: r, g: g, b: b, a: a
        };
    }

}

export default GLUtil;
