import {TextLineMetrics} from "../src/flash/text/TextLineMetrics";
/**
 * Created by MIC on 2015/12/26.
 */

///<reference path="../node/node.d.ts"/>
///<reference path="../libtess.js/libtess.js.d.ts"/>

declare module "glantern" {

    module _util {

        abstract class _util {

            static isUndefinedOrNull(value:any):boolean;

            static isUndefined(value:any):boolean

            static isFunction(value:any):boolean

            static isClassDefinition(value:any):boolean

            static limitInto(v:number, min:number, max:number):number;

            static isValueBetweenNotEquals(v:number, min:number, max:number):boolean;

            static isValueBetweenEquals(v:number, min:number, max:number):boolean;

            static formatString(format:string, ...replaceWithArray:any[]):string;

            static deepClone(sourceObject:boolean):boolean;
            static deepClone(sourceObject:string):string;
            static deepClone(sourceObject:number):number;
            static deepClone<T>(sourceObject:T[]):T[];
            static deepClone<T extends Object>(sourceObject:T):T;
            static deepClone<K, V>(sourceObject:Map<K, V>):Map<K, V>;
            static deepClone<T>(sourceObject:Set<T>):Set<T>;
            static deepClone<T extends Function>(sourceObject:T):T;
            static deepClone(sourceObject:any):any;

            static isPowerOfTwo(positiveNumber:number):boolean;

            static power2Roundup(positiveNumber:number):number;

            static trace(message:string, extra?:any):void;

            static requestAnimationFrame(f:FrameRequestCallback):number;

            static cancelAnimationFrame(handle:number):void;

            static colorToCssSharp(color:number):string;

            static colorToCssRgba(color:number):string;

            static padLeft(str:string, targetLength:number, padWith:string):string;

        }

        class ApplicationError implements Error {

            constructor(message?:string);

            message:string;
            name:string;

        }

        class ArgumentError extends ApplicationError {

            constructor(message?:string, argument?:string);

            argument:string;

        }

        class NotImplementedError extends ApplicationError {

            constructor(message?:string);

        }

    }

    module flash {

        module display {

            abstract class DisplayObject extends events.EventDispatcher implements IBitmapDrawable, webgl.IWebGLElement {

                constructor(root:Stage, parent:DisplayObjectContainer);

                alpha:number;
                blendMode:string;
                cacheAsBitmap:boolean;
                childIndex:number;

                dispose():void;

                enabled:boolean;
                filters:filters.BitmapFilter[];
                height:number;
                mask:DisplayObject;
                mouseX:number;
                mouseY:number;
                name:string;
                parent:DisplayObjectContainer;
                root:DisplayObject;
                rotation:number;
                rotationX:number;
                rotationY:number;
                rotationZ:number;
                stage:Stage;
                transform:geom.Transform;
                visible:boolean;
                width:number;
                x:number;
                y:number;
                z:number;

                getBounds(targetCoordinateSpace:DisplayObject):geom.Rectangle;

                getRect(targetCoordinateSpace:DisplayObject):geom.Rectangle;

                update():void;

                render(renderer:webgl.WebGLRenderer):void;

                requestUpdateTransform():void;

            }

            abstract class InteractiveObject extends DisplayObject {

                constructor(root:Stage, parent:DisplayObjectContainer);

                doubleClickEnabled:boolean;
                focusRect:boolean;
                mouseEnabled:boolean;
                needsSoftKeyboard:boolean;
                tabEnabled:boolean;
                tabIndex:number;

            }

            abstract class DisplayObjectContainer extends InteractiveObject {

                constructor(root:Stage, parent:DisplayObjectContainer);

                mouseChildren:boolean;
                numChildren:number;
                tabChildren:boolean;

                addChild(child:DisplayObject):DisplayObject;

                addChildAt(child:DisplayObject, index:number):DisplayObject;

                areInaccessibleObjectsUnderPoint(point:geom.Point):boolean;

                contains(child:DisplayObject):boolean;

                getChildAt(index:number):DisplayObject;

                getChildByName(name:string):DisplayObject;

                getChildIndex(child:DisplayObject):number;

                getObjectsUnderPoint(point:geom.Point):DisplayObject[];

                removeChild(child:DisplayObject):DisplayObject;

                removeChildAt(index:number):DisplayObject;

                setChildIndex(child:DisplayObject, index:number):void;

                swapChildren(child1:DisplayObject, child2:DisplayObject):void;

                swapChildrenAt(index1:number, index2:number):void;

            }

            class Stage extends DisplayObjectContainer {

                constructor(renderer:webgl.WebGLRenderer);

                align:string;
                allowFullScreen:boolean;
                allowFullScreenInteractive:boolean;
                color:number;
                colorCorrection:string;
                colorCorrectionSupport:string;
                displayState:string;
                focus:InteractiveObject;
                frameRate:number;
                fullScreenHeight:number;
                fullScreenSourceRect:geom.Rectangle;
                fullScreenWidth:number;
                mouseChildren:boolean;
                quality:string;
                scaleMode:string;
                showDefaultContextMenu:boolean;
                softKeyboardRect:geom.Rectangle;
                stageHeight:number;
                stageWidth:number;

                invalidate():void;

                isFocusInaccessible():boolean;

                worldRenderer:webgl.WebGLRenderer;

                resize(width:number, height:number):void;

            }

            class Graphics implements ICopyable<Graphics>, IDisposable {

                constructor(attachTo:DisplayObject, renderer:webgl.WebGLRenderer);

                beginBitmapFill(bitmap:BitmapData, matrix?:geom.Matrix, repeat?:boolean, smooth?:boolean):void;

                beginFill(color:number, alpha?:number):void;

                beginGradientFill(type:string, colors:number[], alphas:number[], ratios:number[], matrix?:geom.Matrix,
                                  spreadMethod?:string, interpolationMethod?:string, focalPointRatio?:number):void;

                beginShaderFill(shader:Shader, matrix?:geom.Matrix):void;

                clear():void;

                copyFrom(sourceGraphics:Graphics):void;

                curveTo(controlX:number, controlY:number, anchorX:number, anchorY:number):void;

                drawCircle(x:number, y:number, radius:number):void;

                drawEllipse(x:number, y:number, width:number, height:number):void;

                drawGraphicsData(graphicsData:IGraphicsData[]):void;

                drawPath(commands:number[], data:number[], winding?:string, checkCommands?:boolean):void;

                drawRect(x:number, y:number, width:number, height:number):void;

                drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void;

                drawTriangles(vectors:number[], indices?:number[], uvtData?:number[], culling?:string):void;

                endFill():void;

                lineBitmapStyle(bitmap:BitmapData, matrix?:geom.Matrix, repeat?:boolean, smooth?:boolean):void;

                lineGradientStyle(type:string, colors:number[], alphas:number[], ratios:number[], matrix?:geom.Matrix,
                                  spreadMethod?:string, interpolationMethod?:string, focalPointRatio?:number):void

                lineShaderStyle(shader:Shader, matrix?:geom.Matrix):void;

                lineStyle(thickness?:number, color?:number, alpha?:number, pixelHinting?:boolean, scaleMode?:string,
                          caps?:string, joints?:string, miterLimit?:number):void;

                lineTo(x:number, y:number):void;

                moveTo(x:number, y:number):void;

                update():void;

                render(renderer:webgl.WebGLRenderer, target:webgl.RenderTarget2D, clearOutput:boolean):void;

                dispose():void;

                renderer:webgl.WebGLRenderer;
                isFilling:boolean;

            }

            class Shape extends DisplayObject {

                constructor(root:Stage, parent:DisplayObjectContainer);

                graphics:Graphics;

            }

            abstract class Bitmap extends DisplayObject {

            }

            abstract class BitmapData implements IBitmapDrawable {

            }

            abstract class Shader {

            }

            abstract class BlendMode {

                static ADD:string;
                static ALPHA:string;
                static DARKEN:string;
                static DIFFERENCE:string;
                static ERASE:string;
                static HARDLIGHT:string;
                static INVERT:string;
                static LAYER:string;
                static LIGHTEN:string;
                static MULTIPLY:string;
                static NORMAL:string;
                static OVERLAY:string;
                static SCREEN:string;
                static SHADER:string;
                static SUBTRACT:string;

            }

            abstract class CapsStyle {

                static NONE:string;
                static ROUND:string;
                static SQUARE:string;

            }

            abstract class ColorCorrection {

                static DEFAULT:string;
                static OFF:string;
                static ON:string;

            }

            abstract class ColorCorrectionSupport {

                static DEFAULT_OFF:string;
                static DEFAULT_ON:string;
                static UNSUPPORTED:string;

            }

            abstract class GradientType {

                static LINEAR:string;
                static RADIAL:string;

            }

            abstract class GraphicsPathCommand {

                static CUBIC_CURVE_TO:string;
                static CURVE_TO:string;
                static LINE_TO:string;
                static MOVE_TO:string;
                static NO_OP:string;
                static WIDE_LINE_TO:string;
                static WIDE_MOVE_TO:string;

            }

            abstract class GraphicsPathWinding {

                static EVEN_ODD:string;
                static NON_ZERO:string;

            }

            interface IBitmapDrawable {

            }

            interface IGraphicsData {

            }

            interface IGraphicsPath {

            }

            abstract class InterpolationMethod {

                static LINEAR_RGB:string;
                static RGB:string;

            }

            abstract class JointStyle {

                static BEVEL:string;
                static MITER:string;
                static ROUND:string;

            }

            abstract class LineScaleMode {

                static HORIZONTAL:string;
                static NONE:string;
                static NORMAL:string;
                static VERTICAL:string;

            }

            abstract class SpreadMethod {

                static PAD:string;
                static REFLECT:string;
                static REPEAT:string;

            }

            abstract class StageAlign {

                static BOTTOM:string;
                static BOTTOM_LEFT:string;
                static BOTTOM_RIGHT:string;
                static LEFT:string;
                static RIGHT:string;
                static TOP:string;
                static TOP_LEFT:string;
                static TOP_RIGHT:string;

            }

            abstract class StageDisplayState {

                static FULL_SCREEN:string;
                static FULL_SCREEN_INTERACTIVE:string;
                static NORMAL:string;

            }

            abstract class StageQuality {

                static BEST:string;
                static HIGH:string;
                static LOW:string;
                static MEDIUM:string;

            }

            abstract class StageScaleMode {

                static EXACT_FIT:string;
                static NO_BORDER:string;
                static NO_SCALE:string;
                static SHOW_ALL:string;

            }

            abstract class TriangleCulling {

                static NEGATIVE:string;
                static NONE:string;
                static POSITIVE:string;

            }

        }

        module events {

            abstract class EventDispatcher implements IDisposable {

                constructor();

                addEventListener(type:string, listener:Function, useCapture?:boolean):void;

                dispatchEvent(event:Event, data?:any):boolean

                removeEventListener(type:string, listener:Function, useCapture?:boolean):void

                hasEventListener(type:string):boolean;

                willTrigger(type:string):boolean;

                dispose():void;

            }

            class FlashEvent implements Event {

                bubbles:boolean;
                cancelBubble:boolean;
                cancelable:boolean;
                currentTarget:EventTarget;
                defaultPrevented:boolean;
                eventPhase:number;
                isTrusted:boolean;
                returnValue:boolean;
                srcElement:Element;
                target:EventTarget;
                timeStamp:number;
                type:string;

                AT_TARGET:number;
                BUBBLING_PHASE:number;
                CAPTURING_PHASE:number;

                constructor(type:string, bubbles?:boolean, cancelable?:boolean);

                initEvent(eventTypeArg:string, canBubbleArg:boolean, cancelableArg:boolean):void;

                preventDefault():void;

                stopImmediatePropagation():void;

                stopPropagation():void;

                static create(type:string):FlashEvent;

                static ENTER_FRAME:string;

            }

            class TimerEvent extends FlashEvent implements ICloneable<TimerEvent> {

                constructor(type:string, bubbles?:boolean, cancelable?:boolean);

                static TIMER:string;
                static TIMER_COMPLETE:string;

                updateAfterEvent():void;

                clone():TimerEvent;

            }

        }

        module filters {

            interface BitmapFilter extends webgl.IBitmapFilter, ICloneable<BitmapFilter> {

            }

            abstract class BitmapFilterQuality {

                static HIGH:number;
                static LOW:number;
                static MEDIUM:number;

            }

        }

        module geom {

            class Point implements ICloneable<Point>, ICopyable<Point> {

                constructor(x?:number, y?:number);

                add(v:Point):Point;

                clone():Point;

                copyFrom(sourcePoint:Point):void;

                static distance(pt1:Point, pt2:Point):number;

                equals(toCompare:Point):boolean;

                static interpolate(pt1:Point, pt2:Point, f:number):Point;

                length:number;

                normalize(thickness:number):void;

                offset(dx:number, dy:number):void;

                static polar(len:number, angle:number):Point;

                setTo(xa:number, ya:number):void;

                subtract(v:Point):Point;

                toString():string;

                x:number;
                y:number;

            }

            class Rectangle implements ICloneable<Rectangle>, ICopyable<Rectangle> {

                constructor(x?:number, y?:number, width?:number, height?:number);

                bottom:number;
                bottomRight:Point;

                clone():Rectangle;

                contains(x:number, y:number):boolean;

                containsPoint(point:Point):boolean;

                containsRect(rect:Rectangle):boolean;

                copyFrom(sourceRect:Rectangle):void;

                equals(toCompare:Rectangle):boolean;

                height:number;

                inflate(dx:number, dy:number):void;

                inflatePoint(point:Point):void;

                intersection(toIntersect:Rectangle):Rectangle;

                intersects(toIntersect:Rectangle):boolean;

                isEmpty():boolean;

                left:number;

                offset(dx:number, dy:number):void;

                offsetPoint(point:Point):void;

                right:number;

                setEmpty():void;

                setTo(xa:number, ya:number, widtha:number, heighta:number):void;

                size:Point;
                top:number;
                topLeft:Point;

                toString():string;

                union(toUnion:Rectangle):Rectangle;

                width:number;
                x:number;
                y:number;

            }

            class Vector3D implements ICloneable<Vector3D>, ICopyable<Vector3D> {

                constructor(x?:number, y?:number, z?:number, w?:number);

                static X_AXIS:Vector3D;
                static Y_AXIS:Vector3D;
                static Z_AXIS:Vector3D;
                static ORIGIN:Vector3D;

                w:number;
                x:number;
                y:number;
                z:number;
                length:number;
                lengthSquared:number;

                add(a:Vector3D):Vector3D;

                static angleBetween(a:Vector3D, b:Vector3D):number;

                clone():Vector3D;

                copyFrom(a:Vector3D):void;

                crossProduct(a:Vector3D):Vector3D;

                decrementBy(a:Vector3D):void;

                static distance(pt1:Vector3D, pt2:Vector3D):number;

                dotProduct(a:Vector3D):number;

                equals(toCompare:Vector3D, allFour?:boolean):boolean;

                incrementBy(a:Vector3D):void;

                nearEquals(toCompare:Vector3D, tolerance:number, allFour?:boolean):boolean;

                negate():void;

                normalize():number;

                project():void;

                scaleBy(s:number):void;

                setTo(xa:number, ya:number, za:number):void;

                subtract(a:Vector3D):Vector3D;

                toString():string;

            }

            class Matrix implements ICloneable<Matrix>, ICopyable<Matrix> {

                constructor(a?:number, b?:number, c?:number, d?:number, tx?:number, ty?:number);

                a:number;
                b:number;
                c:number;
                d:number;
                tx:number;
                ty:number;

                clone():Matrix;

                concat(m:Matrix):void;

                copyColumnFrom(column:number, vector3D:Vector3D):void;

                copyColumnTo(column:number, vector3D:Vector3D):void;

                copyFrom(sourceMatrix:Matrix):void;

                copyRowFrom(row:number, vector3D:Vector3D):void;

                copyRowTo(row:number, vector3D:Vector3D):void;

                createBox(scaleX:number, scaleY:number, rotation?:number, tx?:number, ty?:number):void;

                createGradientBox(width:number, height:number, rotation?:number, tx?:number, ty?:number):void;

                deltaTransformPoint(point:Point):Point;

                identity():void;

                invert():boolean;

                rotate(angle:number):void;

                scale(sx:number, sy:number):void;

                skew(skewX:number, skewY:number):void

                setTo(aa:number, ba:number, ca:number, da:number, txa:number, tya:number):void;

                toString():string;

                transformPoint(point:Point):Point;

                translate(dx:number, dy:number):void

            }

            class Matrix3D implements ICloneable<Matrix3D>, ICopyable<Matrix3D> {

                constructor(v?:number[]);

                determinant:number;
                rawData:number[];

                append(lhs:Matrix3D):void;

                appendRotation(degrees:number, axis:Vector3D, pivotPoint?:Vector3D):void;

                appendScale(xScale:number, yScale:number, zScale:number):void;

                appendTranslation(x:number, y:number, z:number):void;

                clone():Matrix3D;

                copyColumnFrom(column:number, vector3D:Vector3D):void;

                copyColumnTo(column:number, vector3D:Vector3D):void;

                copyFrom(sourceMatrix3D:Matrix3D):void;

                copyRawDataFrom(vector:number[], index?:number, transpose?:boolean):void;

                copyRawDataTo(vector:number[], index?:number, transpose?:boolean):void;

                copyRowFrom(row:number, vector3D:Vector3D):void;

                copyRowTo(row:number, vector3D:Vector3D):void;

                copyToMatrix3D(dest:Matrix3D):void;

                decompose(orientationStyle?:string):Vector3D[];

                deltaTransformVector(v:Vector3D):Vector3D;

                identity():void;

                static interpolate(thisMat:Matrix3D, toMat:Matrix3D, percent:number):Matrix3D;

                interpolateTo(toMat:Matrix3D, percent:number):Matrix3D;

                invert():boolean;

                pointAt(pos:Vector3D, at?:Vector3D, up?:Vector3D):void;

                prepend(rhs:Matrix3D):void;

                prependRotation(degrees:number, axis:Vector3D, pivotPoint?:Vector3D):void;

                prependScale(xScale:number, yScale:number, zScale:number):void;

                prependTranslation(x:number, y:number, z:number):void;

                recompose(components:Vector3D[], orientationStyle?:string):boolean;

                transformVector(v:Vector3D):Vector3D;

                transformVectors(vin:number[], vout:number[]):void;

                transpose():void;

                toArray():Float32Array;

                setOrthographicProjection(left:number, right:number, top:number, bottom:number, near:number, far:number):void;

                setPerspectiveProjection(fov:number, aspect:number, near:number, far:number):void;

                position:Vector3D;

            }

            class ColorTransform {

                constructor(redMultiplier?:number, greenMultiplier?:number, blueMultiplier?:number, alphaMultiplier?:number,
                            redOffset?:number, greenOffset?:number, blueOffset?:number, alphaOffset?:number);

                alphaMultiplier:number;
                alphaOffset:number;
                redMultiplier:number;
                redOffset:number;
                greenMultiplier:number;
                greenOffset:number;
                blueMultiplier:number;
                blueOffset:number;

                concat(second:ColorTransform):void;

            }

            class PerspectiveProjection {

                constructor();

                fieldOfView:number;
                focalLength:number;
                projectionCenter:Point;

                toMatrix3D():Matrix3D;

            }

            class Transform {

                constructor();

                colorTransform:ColorTransform;
                concatenatedColorTransform:ColorTransform;
                concatenatedMatrix:Matrix;
                matrix:Matrix;
                matrix3D:Matrix3D;
                perspectiveProjection:PerspectiveProjection;
                pixelBounds:Rectangle;

                getRelativeMatrix3D(relativeTo:flash.display.DisplayObject):Matrix3D;

            }

            abstract class Orientation3D {

                static AXIS_ANGLE:string;
                static EULER_ANGLES:string;
                static QUATERNION:string;

            }

        }

        module text {

            class TextLineMetrics {

                constructor(x:number, width:number, height:number, ascent:number, descent:number, leading:number);

                ascent:number;
                descent:number;
                height:number;
                leading:number;
                width:number;
                x:number;

            }

            class TextFormat extends events.EventDispatcher {

                constructor(font?:string, size?:number, color?:number, bold?:boolean, italic?:boolean,
                            underline?:boolean, url?:string, target?:string, align?:string,
                            leftMargin?:number, rightMargin?:number, indent?:number, leading?:number);

                static TEXT_FORMAT_CHANGE:string;

                align:string;
                bold:boolean;
                color:number;
                font:string;
                indent:number;
                italic:boolean;
                leading:number;
                leftMargin:number;
                rightMargin:number;
                size:number;
                target:string;
                underline:boolean;
                url:string;

            }

            class StyleSheet extends events.EventDispatcher {

                constructor();

                clear():void;

                getStyle(styleName:string):any;

                parseCSS(cssText:string):void;

                setStyle(styleName:string, styleObject:any):void;

                transform(formatObject:any):TextFormat;

                styleNames:string[];

            }

            class TextField extends display.InteractiveObject {

                constructor(root:display.Stage, parent:display.DisplayObjectContainer);

                appendText(newText:string):void;

                alwaysShowSelection:boolean;
                antiAliasType:string;
                autoSize:string;
                background:boolean;
                backgroundColor:number;
                border:boolean;
                borderColor:number;
                bottomScrollV:number;
                caretIndex:number;
                condenseWhite:boolean;
                defaultTextFormat:TextFormat;
                displayAsPassword:boolean;
                embedFonts:boolean;

                getCharBoundaries():geom.Rectangle;

                getCharIndexAtPoint(x:number, y:number):number;

                getFirstCharInParagraph(charIndex:number):number;

                getImageReference(id:string):display.DisplayObject;

                getLineIndexAtPoint(x:number, y:number):number;

                getLineIndexOfChar(charIndex:number):number;

                getLineLength(lineIndex:number):number;

                getLineMetrics(lineIndex:number):TextLineMetrics;

                getLineOffset(lineIndex:number):number;

                getLineText(lineIndex:number):string;

                getParagraphLength(charIndex:number):number;

                getTextFormat(beginIndex?:number, endIndex?:number):TextFormat;

                isFontCompatible(fontName:string, fontStyle:number):boolean;

                replaceSelectedText(value:string):void;

                replaceText(beginIndex:number, endIndex:number, newText:string):void;

                setSelection(beginIndex:number, endIndex:number):void;

                setTextFormat(format:TextFormat, beginIndex?:number, endIndex?:number):void;

                gridFitType:string;
                htmlText:string;
                length:number;
                maxChars:number;
                maxScrollH:number;
                maxScrollV:number;
                mouseWheelEnabled:boolean;
                multiline:boolean;
                numLines:number;
                restrict:string;
                scrollH:number;
                scrollV:number;
                selectable:boolean;
                selectionBeginIndex:number;
                selectionEndIndex:number;
                sharpness:number;
                styleSheet:StyleSheet;
                text:string;
                textColor:number;
                textOutlineColor:number;
                customOutlineEnabled:boolean;
                textHeight:number;
                textInteractionMode:string;
                textWidth:number;
                thickness:number;
                type:string;
                useRichTextClipboard:boolean;
                wordWrap:boolean;

            }

            abstract class AntiAliasType {

                static ADVANCED:string;
                static NORMAL:string;

            }

            abstract class GridFitType {

                static NONE:string;
                static PIXEL:string;
                static SUBPIXEL:string;

            }


            abstract class TextFieldAutoSize {

                static CENTER:string;
                static LEFT:string;
                static NONE:string;
                static RIGHT:string;

            }

            abstract class TextFieldType {

                static DYNAMIC:string;
                static INPUT:string;

            }

            abstract class TextFormatAlign {

                static CENTER:string;
                static END:string;
                static JUSTIFY:string;
                static LEFT:string;
                static RIGHT:string;
                static START:string;

            }

            abstract class TextInteractionMode {

                static NORMAL:string;
                static SELECTION:string;

            }

        }

        module utils {

            class Timer extends events.EventDispatcher {

                constructor(delay:number, repeatCount?:number);

                currentCount:number;
                delay:number;
                enabled:boolean;
                repeatCount:number;
                running:boolean;

                reset():void;

                start():void;

                stop():void;

            }

        }

    }

    module webgl {

        module filters {

            class BlurXFilter extends FilterBase {

                constructor(manager:FilterManager);

                strength:number;
                pass:number;

                process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            }

            class BlurYFilter extends FilterBase {

                constructor(manager:FilterManager);

                strength:number;
                pass:number;

                process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            }

            class BlurFilter extends FilterBase {

                constructor(manager:FilterManager);

                strengthX:number;
                strengthY:number;
                pass:number;

                process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            }

            class Blur2Filter extends FilterBase {

                constructor(manager:FilterManager);

                strengthX:number;
                strengthY:number;
                pass:number;

                process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            }

            class ColorTransformFilter extends FilterBase {

                constructor(manager:FilterManager);

                setColorMatrix(r4c5:number[]):void;

                process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            }

            class GlowFilter extends FilterBase {

                constructor(manager:FilterManager);

                strengthX:number;
                strengthY:number;
                pass:number;

                setColorMatrix(r4c5:number[]):void;

                process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            }

        }

        module graphics {

            enum BrushType {
                SOLID,
                GRADIENT,
                BITMAP,
                SHADER
            }

            class GraphicsDataRendererBase implements IGraphicsDataRenderer {

                bezierCurveTo(cx1:number, cy1:number, cx2:number, cy2:number, x:number, y:number):void;

                closePath():void;

                curveTo(cx:number, cy:number, x:number, y:number):void;

                drawCircle(x:number, y:number, radius:number):void;

                drawEllipse(x:number, y:number, width:number, height:number):void;

                drawRect(x:number, y:number, width:number, height:number):void;

                drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void;

                lineTo(x:number, y:number):void;

                moveTo(x:number, y:number):void;

                update():void;

                render(renderer:WebGLRenderer):void;

                dispose():void;

                becomeDirty():void;

            }

            abstract class FillRendererBase extends GraphicsDataRendererBase implements IFillDataRenderer {

                constructor(graphics:flash.display.Graphics, currentX:number, currentY:number);

                beginIndex:number;
                endIndex:number

            }

            abstract class StrokeRendererBase extends GraphicsDataRendererBase implements IStrokeDataRenderer {

                constructor(graphics:flash.display.Graphics, lastPathStartX:number, lastPathStartY:number, currentX:number, currentY:number);

            }

            class SolidFillRenderer extends FillRendererBase {

                constructor(graphics:flash.display.Graphics, startX:number, startY:number, color:number, alpha:number);

            }

            class SolidStrokeRenderer extends StrokeRendererBase {

                constructor(graphics:flash.display.Graphics, lastPathStartX:number, lastPathStartY:number, currentX:number, currentY:number, lineWidth:number, color:number, alpha?:number);

            }

            interface IGraphicsDataRenderer extends IDisposable {

                bezierCurveTo(cx1:number, cy1:number, cx2:number, cy2:number, x:number, y:number):void;
                closePath():void;
                curveTo(cx:number, cy:number, x:number, y:number):void;
                drawCircle(x:number, y:number, radius:number):void;
                drawEllipse(x:number, y:number, width:number, height:number):void;
                drawRect(x:number, y:number, width:number, height:number):void;
                drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void;
                lineTo(x:number, y:number):void;
                moveTo(x:number, y:number):void;
                update():void;
                render(renderer:WebGLRenderer):void;

            }

            interface IFillDataRenderer extends IGraphicsDataRenderer {

                beginIndex:number;
                endIndex:number;

            }

            interface IStrokeDataRenderer extends IGraphicsDataRenderer {

            }

            const CURVE_ACCURACY:number;
            const STD_Z:number;

        }

        module shaders {

            class PrimitiveShader extends ShaderBase {

                constructor(manager:ShaderManager);

                setProjection(matrix:flash.geom.Matrix3D):void;

                setTransform(matrix:flash.geom.Matrix3D):void;

                setAlpha(alpha:number):void;

            }

            class BufferedShader extends ShaderBase {

                constructor(manager:ShaderManager, vertexSource:string, fragmentSource:string);

                setTexture(texture:WebGLTexture):void;

            }

            class ReplicateShader extends BufferedShader {

                constructor(manager:ShaderManager);

                setFlipX(flip:boolean):void;

                setFlipY(flip:boolean):void;

                setOriginalSize(xy:number[]):void;

                setFitSize(xy:number[]):void;

            }

            class BlurXShader extends BufferedShader {

                constructor(manager:ShaderManager);

                setStrength(strength:number):void;

                getStrength():number;

            }

            class BlurYShader extends BufferedShader {

                constructor(manager:ShaderManager);

                setStrength(strength:number):void;

                getStrength():number;

            }

            class Blur2Shader extends BufferedShader {

                constructor(manager:ShaderManager);

                setStrength(strength:number):void;

                getStrength():number;

                setResolution(resolution:number):void;

                setBlurDirection(direction:number[]):void;

            }

            class CopyImageShader extends BufferedShader {

                constructor(manager:ShaderManager);

                setFlipX(flip:boolean):void;

                setFlipY(flip:boolean):void;

                setOriginalSize(xy:number[]):void;

                setFitSize(xy:number[]):void;

                setAlpha(alpha:number):void;

                setTransform(matrix:flash.geom.Matrix3D):void;

            }

            class ColorTransformShader extends BufferedShader {

                constructor(manager:ShaderManager);

                setColorMatrix(r4c5:number[]):void;

            }

            class FxaaShader extends BufferedShader {

                constructor(manager:ShaderManager);

                setResolutionXY(xy:number[]):void;

            }

            class Primitive2Shader extends ShaderBase {

                constructor(manager:ShaderManager);

                setProjection(matrix:flash.geom.Matrix3D):void;

                setTransform(matrix:flash.geom.Matrix3D):void;

                setAlpha(alpha:number):void;

                setFlipX(flip:boolean):void;

                setFlipY(flip:boolean):void;

                setOriginalSize(xy:number[]):void

            }

        }

        class AttributeCache {

            constructor();

            name:string;
            value:any;
            location:number;

        }

        class UniformCache {

            name:string;
            type:WebGLDataType;
            location:WebGLUniformLocation;
            value:any;
            transpose:boolean;
            array:Float32Array;
            texture:WebGLTexture;

        }

        enum WebGLDataType {

            UUnknown,
            UBool,
            U1I,
            U1F,
            U2F, U3F, U4F,
            UV2, UV3, UV4,
            U1IV, U2IV, U3IV, U4IV,
            U1FV, U2FV, U3FV, U4FV,
            UMat2, UMat3, UMat4,
            UIV,
            UFV,
            UV2V, UV3V, UV4V,
            USampler2D

        }

        abstract class FilterBase implements IBitmapFilter {

            constructor(manager:FilterManager);

            abstract process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

            notifyAdded():void;

            notifyRemoved():void;

            dispose():void;

            initialize():void;

            filterManager:FilterManager;
            flipX:boolean;
            flipY:boolean;

        }

        class FilterManager implements IDisposable {

            constructor(renderer:WebGLRenderer);

            dispose():void;

            clearFilterGroups():void;

            pushFilterGroup(group:IBitmapFilter[]):void;

            popFilterGroup():IBitmapFilter[];

            hasFilterGroups:boolean;
            renderer:WebGLRenderer;

            processFilters(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

        }

        class ShaderManager implements IDisposable {

            constructor(renderer:WebGLRenderer);

            dispose():void;

            getNextAvailableID():number;

            loadShader(shaderName:string, uniforms:Map<string, UniformCache>, attributes:Map<string, AttributeCache>):number;

            selectShader(id:number):void;

            currentShader:ShaderBase;
            context:WebGLRenderingContext;
            renderer:WebGLRenderer;

        }

        interface IBitmapFilter extends IDisposable {

            initialize():void;
            process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;
            notifyAdded():void;
            notifyRemoved():void;

        }

        class ShaderBase implements IDisposable {

            constructor(manager:ShaderManager, vertexSource:string, fragmentSource:string,
                        uniforms:Map<string, UniformCache>, attributes:Map<string, AttributeCache>)

            id:number;

            dispose():void;

            syncUniforms():void;

            changeValue(name:string, callback:(uniform:UniformCache) => void):void

            select():void;

            getUniformLocation(name:string):WebGLUniformLocation;

            getAttributeLocation(name:string):number;

            vertexSource:string;
            fragmentSource:string;

            static SHADER_CLASS_NAME:string;
            static FRAGMENT_SOURCE:string;
            static VERTEX_SOURCE:string;

        }

        class RenderTarget2D implements IDisposable {

            constructor(renderer:WebGLRenderer, image?:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement, isRoot?:boolean);

            dispose():void;

            originalWidth:number;
            originalHeight:number;
            fitWidth:number;
            fitHeight:number;
            texture:WebGLTexture;
            image:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement;
            isRoot:boolean;

            activate():void;

            clear():void;

            resize(newWidth:number, newHeight:number):void;

            updateImageContent():void;

            updateImageSize():void;

        }

        class WebGLRenderer implements IDisposable {

            constructor(width:number, height:number, options:RendererOptions);

            clear():void;

            dispose():void;

            setRenderTarget(target?:RenderTarget2D):void;

            currentRenderTarget:RenderTarget2D;
            view:HTMLCanvasElement;
            context:WebGLRenderingContext;
            shaderManager:ShaderManager;
            filterManager:FilterManager;
            tessellator:libtess.GluTesselator;
            screenTarget:RenderTarget2D;

            createRenderTarget(image?:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement):RenderTarget2D;

            createRootRenderTarget(image?:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement):RenderTarget2D;

            releaseRenderTarget(target:RenderTarget2D):void;

            copyRenderTargetContent(source:RenderTarget2D, destination:RenderTarget2D, clearOutput:boolean):void;

            copyRenderTargetContentEx(source:RenderTarget2D, destination:RenderTarget2D, flipX:boolean, flipY:boolean, clearOutput:boolean):void;

            setBlendMode(blendMode:string):void;

            static DEFAULT_OPTIONS:RendererOptions;

        }

        abstract class RenderHelper {

            static renderPrimitives(renderer:WebGLRenderer, renderTo:RenderTarget2D, vertices:PackedArrayBuffer, colors:PackedArrayBuffer, indices:PackedArrayBuffer, clearOutput:boolean):void;

            static renderPrimitives2(renderer:WebGLRenderer, renderTo:RenderTarget2D, vertices:PackedArrayBuffer, colors:PackedArrayBuffer, indices:PackedArrayBuffer, flipX:boolean, flipY:boolean, clearOutput:boolean):void

            static copyTargetContent(renderer:WebGLRenderer, source:RenderTarget2D, destination:RenderTarget2D, flipX:boolean, flipY:boolean, clearOutput:boolean):void;

            static copyImageContent(renderer:WebGLRenderer, source:RenderTarget2D, destination:RenderTarget2D, flipX:boolean, flipY:boolean, transform:flash.geom.Matrix3D, alpha:number, clearOutput:boolean):void;

            static renderImage(renderer:WebGLRenderer, source:RenderTarget2D, destination:RenderTarget2D, clearOutput:boolean):void;

            static renderBuffered(renderer:WebGLRenderer, source:RenderTarget2D, destination:RenderTarget2D, shaderID:number, clearOutput:boolean, shaderInit:(r:WebGLRenderer) => void):void;

        }

        abstract class ShaderID {

            static PRIMITIVE:number;
            static BLUR_X:number;
            static BLUR_Y:number;
            static REPLICATE:number;
            static COLOR_TRANSFORM:number;
            static FXAA:number;
            static BLUR2:number;
            static COPY_IMAGE:number;
            static PRIMITIVE2:number;

        }

        abstract class FragmentShaders {

            static buffered:string;
            static blur:string;
            static primitive:string;
            static colorTransform:string;
            static fxaa:string;
            static blur2:string;
            static copyImage:string;

        }

        abstract class VertexShaders {

            static buffered:string;
            static blurX:string;
            static blurY:string;
            static primitive:string;
            static replicate:string;
            static fxaa:string;
            static blur2:string;
            static copyImage:string;
            static primitive2:string;

        }

        class PackedArrayBuffer implements IDisposable {

            constructor();

            static create(context:WebGLRenderingContext, data:number[], elementGLType:number, bufferType:number):PackedArrayBuffer;

            webglBuffer:WebGLBuffer;
            elementSize:number;
            elementCount:number;
            elementGLType:number;

            setNewData(data:number[]):void;

            becomeDirty():void;

            syncBufferData():void;

            dispose():void;

            static getTypedArrayType(glType:number):Function;

        }

        interface RendererOptions {

            antialias?:boolean;
            depth?:boolean;
            transparent?:boolean;

        }

        interface IWebGLElement {

            update():void;
            render(renderer:WebGLRenderer):void;

        }

        abstract class WebGLUtils {

            static setupWebGL(canvas:HTMLCanvasElement, optionalAttributes:any):WebGLRenderingContext;

        }

    }

    module fl {

        module easing {

            abstract class Back {

                static easeIn(t:number, b:number, c:number, d:number, s?:number):number;

                static easeInOut(t:number, b:number, c:number, d:number, s?:number):number;

                static easeOut(t:number, b:number, c:number, d:number, s?:number):number;

            }

            abstract class Bounce {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Circular {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Cubic {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Elastic {

                static easeIn(t:number, b:number, c:number, d:number, a?:number, p?:number):number;

                static easeInOut(t:number, b:number, c:number, d:number, a?:number, p?:number):number;

                static easeOut(t:number, b:number, c:number, d:number, a?:number, p?:number):number;

            }

            abstract class Exponential {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class None {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

                static easeNone(t:number, b:number, c:number, d:number):number;

            }

            abstract class Quadratic {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Quartic {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Quintic {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Regular {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Sine {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

            abstract class Strong {

                static easeIn(t:number, b:number, c:number, d:number):number;

                static easeInOut(t:number, b:number, c:number, d:number):number;

                static easeOut(t:number, b:number, c:number, d:number):number;

            }

        }

        class Tween extends flash.events.EventDispatcher {

            constructor(obj:Object, prop:string, func:Function, begin:number, finish:number, duration:number, useSeconds?:boolean);

            begin:number;
            duration:number;
            finish:number;
            FPS:number;
            func:Function;
            isPlaying:boolean;
            looping:boolean;
            obj:Object;
            position:number;
            prop:string;
            time:number;
            useSeconds:boolean;

            continueTo(finish:number, duration:number):void;

            fforward():void;

            nextFrame():void;

            prevFrame():void;

            resume():void;

            rewind(t?:number):void ;

            start():void ;

            stop():void;

            yoyo():void;

        }

        class TweenEvent extends flash.events.FlashEvent implements ICloneable<TweenEvent> {

            constructor(type:string, time:number, position:number, bubbles?:boolean, cancelable?:boolean);

            clone():TweenEvent;

            static MOTION_CHANGE:string;
            static MOTION_FINISH:string;
            static MOTION_LOOP:string;
            static MOTION_RESUME:string;
            static MOTION_START:string;
            static MOTION_STOP:string;

        }

    }

    module mx {

        module containers {

            class Canvas extends flash.display.DisplayObjectContainer {

                constructor(root:flash.display.Stage, parent:flash.display.DisplayObjectContainer);

            }

        }

    }

    class GLantern {

        constructor();

        initialize(width:number, height:number, options?:webgl.RendererOptions):void;

        uninitialize():void;

        startAnimation():void

        stopAnimation():void;

        clear():void;

        runOneFrame():void;

        attachUpdateFunction(func:() => void):void;

        stage:flash.display.Stage;
        renderer:webgl.WebGLRenderer;
        view:HTMLCanvasElement;

    }

    interface ICloneable<T> {

        clone():T;

    }

    interface ICopyable<T> {

        copyFrom(source:T):void;

    }

    interface IDisposable {

        dispose():void;

    }

    function injectToGlobal($this:any):void;

    function isSupported():boolean;

}
