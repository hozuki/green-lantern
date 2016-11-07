/**
 * Created by MIC on 2015/12/23.
 */

import TextFormatAlign from "./TextFormatAlign";
import EventDispatcher from "../events/EventDispatcher";
import EventBase from "../../mic/EventBase";
import CommonUtil from "../../mic/CommonUtil";
import VirtualDom from "../../mic/VirtualDom";

let defaultFontName: string;
if (VirtualDom.isNodeJS) {
    let os = require("os");
    defaultFontName = os.type().toLowerCase().indexOf("osx") >= 0 ? "Times" : "Times New Roman";
} else {
    defaultFontName = "Times New Roman";
}

export default class TextFormat extends EventDispatcher {

    constructor(font: string = null, size: number = 12, color: number = 0x000000, bold: boolean = false, italic: boolean = false,
                underline: boolean = false, url: string = null, target: string = null, align: string = TextFormatAlign.LEFT,
                leftMargin: number = 0, rightMargin: number = 0, indent: number = 0, leading: number = 0) {
        super();
        this.font = font !== null ? font : defaultFontName;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.url = url;
        this.target = target;
        this.align = align;
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
        this.indent = indent;
        this.leading = leading;
    }

    static get TEXT_FORMAT_CHANGE(): string {
        return "textFormatChange";
    }

    get align(): string {
        return this._align;
    }

    set align(v: string) {
        var b = this._align !== v;
        if (b) {
            this._align = v;
            this.__raiseChange();
        }
    }

    get blockIndent(): number {
        return this._blockIndent;
    }

    set blockIndent(v: number) {
        var b = this._blockIndent !== v;
        if (b) {
            this._blockIndent = v;
            this.__raiseChange();
        }
    }

    get bold(): boolean {
        return this._bold;
    }

    set bold(v: boolean) {
        var b = this._bold !== v;
        if (b) {
            this._bold = v;
            this.__raiseChange();
        }
    }

    get bullet(): boolean {
        return this._bullet;
    }

    set bullet(v: boolean) {
        var b = this._bullet !== v;
        if (b) {
            this._bullet = v;
            this.__raiseChange();
        }
    }

    get color(): number {
        return this._color;
    }

    set color(v: number) {
        var b = this._color !== v;
        if (b) {
            this._color = v;
            this.__raiseChange();
        }
    }

    get font(): string {
        return this._font;
    }

    set font(v: string) {
        var b = this._font !== v;
        if (b) {
            this._font = v;
            this.__raiseChange();
        }
    }

    get indent(): number {
        return this._indent;
    }

    set indent(v: number) {
        var b = this._indent !== v;
        if (b) {
            this._indent = v;
            this.__raiseChange();
        }
    }

    get italic(): boolean {
        return this._italic;
    }

    set italic(v: boolean) {
        var b = this._italic !== v;
        if (b) {
            this._italic = v;
            this.__raiseChange();
        }
    }

    get kerning(): boolean {
        return this._kerning;
    }

    set kerning(v: boolean) {
        var b = this._kerning !== v;
        if (b) {
            this._kerning = v;
            this.__raiseChange();
        }
    }

    get leading(): number {
        return this._indent;
    }

    set leading(v: number) {
        var b = this._leading !== v;
        if (b) {
            this._leading = v;
            this.__raiseChange();
        }
    }

    get leftMargin(): number {
        return this._leftMargin;
    }

    set leftMargin(v: number) {
        var b = this._leftMargin !== v;
        if (b) {
            this._leftMargin = v;
            this.__raiseChange();
        }
    }

    get letterSpacing(): number {
        return this._letterSpacing;
    }

    set letterSpacing(v: number) {
        var b = this._letterSpacing !== v;
        if (b) {
            this._letterSpacing = v;
            this.__raiseChange();
        }
    }

    get rightMargin(): number {
        return this._rightMargin;
    }

    set rightMargin(v: number) {
        var b = this._rightMargin !== v;
        if (b) {
            this._rightMargin = v;
            this.__raiseChange();
        }
    }

    get size(): number {
        return this._size;
    }

    set size(v: number) {
        var b = this._size !== v;
        if (b) {
            this._size = v;
            this.__raiseChange();
        }
    }

    get tabStops(): number[] {
        return this._tabStops;
    }

    set tabStops(v: number[]) {
        if (!CommonUtil.ptr(v)) {
            v = [];
        }
        var b = false;
        if (!b) {
            b = this._tabStops.length !== v.length;
        }
        if (!b) {
            for (var i = 0; i < v.length; ++i) {
                if (this._tabStops[i] !== v[i]) {
                    b = true;
                    break;
                }
            }
        }
        if (b) {
            this._tabStops = v.slice();
            this.__raiseChange();
        }
    }

    get target(): string {
        return this._target;
    }

    set target(v: string) {
        var b = this._target !== v;
        if (b) {
            this._target = v;
            this.__raiseChange();
        }
    }

    get underline(): boolean {
        return this._underline;
    }

    set underline(v: boolean) {
        var b = this._underline !== v;
        if (b) {
            this._underline = v;
            this.__raiseChange();
        }
    }

    get url(): string {
        return this._url;
    }

    set url(v: string) {
        var b = this._url !== v;
        if (b) {
            this._url = v;
            this.__raiseChange();
        }
    }

    private __raiseChange(): void {
        var ev = EventBase.create(TextFormat.TEXT_FORMAT_CHANGE);
        this.dispatchEvent(ev);
    }

    private _align: string = TextFormatAlign.LEFT;
    private _blockIndent: number = 0;
    private _bold: boolean = false;
    private _bullet: boolean = false;
    private _color: number = 0x000000;
    private _font: string = null;
    private _indent: number = 0;
    private _italic: boolean = false;
    private _kerning: boolean = false;
    private _leading: number = 0;
    private _leftMargin: number = 0;
    private _letterSpacing: number = 0;
    private _rightMargin: number = 0;
    private _size: number = 12;
    private _tabStops: number[] = [];
    private _target: string = null;
    private _underline: boolean = false;
    private _url: string = null;

}
