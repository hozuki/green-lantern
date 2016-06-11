/**
 * Created by MIC on 2016/6/11.
 */

import {MathUtil} from "./MathUtil";

const arrayBuffer = new ArrayBuffer(8);
const views = {
    uint8View: new Uint8Array(arrayBuffer),
    int8View: new Int8Array(arrayBuffer),
    uint16View: new Uint16Array(arrayBuffer),
    int16View: new Int16Array(arrayBuffer),
    uint32View: new Uint32Array(arrayBuffer),
    int32View: new Int32Array(arrayBuffer),
    float32View: new Float32Array(arrayBuffer),
    float64View: new Float64Array(arrayBuffer)
};

var isSystemLittleEndian:boolean;
(function ():void {
    var buffer = new ArrayBuffer(2);
    var dataView = new DataView(buffer);
    dataView.setInt16(0, 256, true);
    var newBuffer = new Int16Array(buffer);
    isSystemLittleEndian = newBuffer[0] === 256;
})();

function getBufferArray(length:number):number[] {
    var array = new Array<number>(length);
    for (var i = 0; i < length; ++i) {
        array[i] = views.uint8View[i];
    }
    return array;
}

function setBufferArray(data:number[], dataStartIndex:number, length:number):void {
    for (var i = dataStartIndex; i < dataStartIndex + length; ++i) {
        views.uint8View[i - dataStartIndex] = data[i];
    }
}

export abstract class BitConverter {

    static get isLittleEndian():boolean {
        return isSystemLittleEndian;
    }

    static float32ToBytes(value:number):number[] {
        views.float32View[0] = value;
        return getBufferArray(4);
    }

    static float64ToBytes(value:number):number[] {
        views.float64View[0] = value;
        return getBufferArray(8);
    }

    static bytesToFloat32(bytes:number[], startIndex:number = 0):number {
        setBufferArray(bytes, startIndex, 4);
        return views.float32View[0];
    }

    static bytesToFloat64(bytes:number[], startIndex:number = 0):number {
        setBufferArray(bytes, startIndex, 8);
        return views.float64View[0];
    }

    static int16ToBytes(value:number):number[] {
        views.int16View[0] = value;
        return getBufferArray(2);
    }

    static uint16ToBytes(value:number):number[] {
        views.uint16View[0] = value;
        return getBufferArray(2);
    }

    static int32ToBytes(value:number):number[] {
        views.int32View[0] = value;
        return getBufferArray(4);
    }

    static uint32ToBytes(value:number):number[] {
        views.uint32View[0] = value;
        return getBufferArray(4);
    }

    static int64ToBytes(value:number):number[] {
        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var index = byteArray.length - 1; index >= 0; index--) {
            var byte = value & 0xff;
            byteArray [index] = byte;
            value = (value - byte) / 256;
        }
        return byteArray;
    }

    static uint64ToBytes(value:number):number[] {
        return BitConverter.int64ToBytes(value >= 0 ? value : -value);
    }

    static bytesToInt64(bytes:number[], startIndex:number = 0):number {
        var value = BitConverter.bytesToUint64(bytes, startIndex);
        var isNegative = BitConverter.__isComplement(bytes, startIndex, 8);
        if (isNegative) {
            value = MathUtil.complementToNegative(value);
        }
        return value;
    }

    static bytesToUint64(bytes:number[], startIndex:number = 0):number {
        var value = 0;
        for (var i = startIndex; i < startIndex + 8; i++) {
            value = (value << 8) + bytes[i];
        }
        return value;
    }

    static bytesToInt32(bytes:number[], startIndex:number = 0):number {
        setBufferArray(bytes, startIndex, 4);
        return views.int32View[0];
    }

    static bytesToUint32(bytes:number[], startIndex:number = 0):number {
        setBufferArray(bytes, startIndex, 4);
        return views.uint32View[0];
    }

    static bytesToInt16(bytes:number[], startIndex:number = 0):number {
        setBufferArray(bytes, startIndex, 2);
        return views.int16View[0];
    }

    static bytesToUint16(bytes:number[], startIndex:number = 0):number {
        setBufferArray(bytes, startIndex, 2);
        return views.uint16View[0];
    }

    static swapEndian(bytes:ArrayLike<number>, startIndex:number = 0, length:number = bytes.length):number[] {
        var result = new Array<number>(length);
        var endIndex = startIndex + length - 1;
        var halfIndex = startIndex + (((length + 1) / 2) | 0);
        for (var i = startIndex; i < halfIndex; i++) {
            result[i - startIndex] = bytes[endIndex - i];
        }
        return result;
    }

    static float64ToInt64Bits(value:number):number {
        // Be careful! Only 6-7 digits are significant!
        views.float64View[0] = value;
        var bytes = getBufferArray(8);
        return BitConverter.bytesToInt64(bytes);
    }

    static int64ToFloat64Bits(value:number):number {
        // Be careful! Only 6-7 digits are significant!
        var bytes = BitConverter.int64ToBytes(value);
        setBufferArray(bytes, 0, bytes.length);
        return views.float64View[0];
    }

    static float32ToInt32Bits(value:number):number {
        views.float32View[0] = value;
        return views.int32View[0];
    }

    static int32ToFloat32Bits(value:number):number {
        views.int32View[0] = value;
        return views.float32View[0];
    }

    private static __isComplement(bytes:number[], startIndex:number, length:number):boolean {
        return MathUtil.isByteComplement(bytes[startIndex + length - 1]);
    }

}
