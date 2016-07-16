/**
 * Created by MIC on 2016/5/18.
 */

import * as pako from "pako";
import {NotImplementedError} from "../errors/NotImplementedError";
import {Endian} from "./Endian";
import {ArgumentError} from "../errors/ArgumentError";
import {GLUtil} from "../../glantern/GLUtil";
import {EOFError} from "../errors/EOFError";
import {CompressionAlgorithm} from "./CompressionAlgorithm";
import {ApplicationError} from "../errors/ApplicationError";

export class ByteArray {

    constructor() {
    }

    get bytesAvailable():number {
        var available = this.length - this.position - 1;
        return available < 0 ? 0 : available;
    }

    get endian():string {
        return this._endian;
    }

    set endian(v:string) {
        if (v === Endian.BIG_ENDIAN || v === Endian.LITTLE_ENDIAN) {
            this._endian = v;
        } else {
            throw new ArgumentError("Argument out of range.", "v");
        }
    }

    get length():number {
        return this._length;
    }

    set length(v:number) {
        if (v > 0 && v !== this._length) {
            this.__adjustLength(v);
            this._length = v;
            if (this.position >= v) {
                this._position = v;
            }
        }
    }

    get position():number {
        return this._position;
    }

    set position(v:number) {
        if (v >= this.length) {
            return;
        } else {
            this._position = v;
        }
    }

    clear():void {
        this._dataView = null;
        this._buffer = null;
        this._position = 0;
        this._length = 0;
    }

    compress(algorithm:string = CompressionAlgorithm.ZLIB):void {
        this.__ensureBufferExists();
        var oldDataView = new Uint8Array(this._buffer);
        var newData:Uint8Array;
        switch (algorithm) {
            case CompressionAlgorithm.DEFLATE:
                // Definition hack.
                newData = <Uint8Array><any>pako.deflateRaw(oldDataView);
                break;
            case CompressionAlgorithm.ZLIB:
                // Definition hack.
                newData = <Uint8Array><any>pako.deflate(oldDataView);
                break;
            case CompressionAlgorithm.LZMA:
                throw new NotImplementedError("LZMA compression algorithm is not implemented yet.");
            default:
                throw new ArgumentError("Unknown compression algorithm.");
        }
        this._buffer = newData.buffer;
        this._dataView = new DataView(this._buffer);
        this._length = this._buffer.byteLength;
        this._position = this._length;
    }

    deflate():void {
        this.compress(CompressionAlgorithm.DEFLATE);
    }

    inflate():void {
        this.uncompress(CompressionAlgorithm.DEFLATE);
    }

    readBoolean():boolean {
        return this.readByte() !== 0;
    }

    readByte():number {
        this.__checkPosition(1);
        var value = this._dataView.getInt8(this.position);
        this.position += 1;
        return value;
    }

    readBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
        this.__checkPosition(length);
        bytes.__checkPosition(length);
        if (length > 0) {
            bytes.position = offset;
            var position = this.position;
            for (var i = 0; i < length; ++i) {
                bytes._dataView.setUint8(offset, this._dataView.getUint8(position + i));
            }
            this.position += length;
            bytes.position += length;
        }
    }

    readDouble():number {
        this.__checkPosition(8);
        var value = this._dataView.getFloat64(this.position, this.__isLittleEndian());
        this.position += 8;
        return value;
    }

    readFloat():number {
        this.__checkPosition(4);
        var value = this._dataView.getFloat32(this.position, this.__isLittleEndian());
        this.position += 4;
        return value;
    }

    readInt():number {
        this.__checkPosition(4);
        var value = this._dataView.getInt32(this.position, this.__isLittleEndian());
        this.position += 4;
        return value;
    }

    readShort():number {
        this.__checkPosition(2);
        var value = this._dataView.getInt16(this.position, this.__isLittleEndian());
        this.position += 2;
        return value;
    }

    readUnsignedByte():number {
        this.__checkPosition(1);
        var value = this._dataView.getUint8(this.position);
        this.position += 1;
        return value;
    }

    readUnsignedInt():number {
        this.__checkPosition(4);
        var value = this._dataView.getUint32(this.position, this.__isLittleEndian());
        this.position += 4;
        return value;
    }

    readUnsignedShort():number {
        this.__checkPosition(2);
        var value = this._dataView.getUint16(this.position, this.__isLittleEndian());
        this.position += 2;
        return value;
    }

    uncompress(algorithm:string = CompressionAlgorithm.ZLIB):void {
        this.__ensureBufferExists();
        var oldDataView = new Uint8Array(this._buffer);
        var newData:Uint8Array;
        switch (algorithm) {
            case CompressionAlgorithm.DEFLATE:
                newData = pako.inflateRaw(oldDataView);
                break;
            case CompressionAlgorithm.ZLIB:
                newData = pako.inflate(oldDataView);
                break;
            case CompressionAlgorithm.LZMA:
                throw new NotImplementedError("LZMA compression algorithm is not implemented yet.");
            default:
                throw new ArgumentError("Unknown compression algorithm.");
        }
        this._buffer = newData.buffer;
        this._dataView = new DataView(this._buffer);
        this._length = this._buffer.byteLength;
        this._position = this._length;
    }

    writeBoolean(value:boolean):void {
        this.writeByte(value ? 1 : 0);
    }

    writeByte(value:number):void {
        this.__checkPosition(1);
        this._dataView.setInt8(this.position, value);
        this.position += 1;
    }

    writeBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
        bytes.readBytes(this, offset, length);
    }

    writeDouble(value:number):void {
        this.__checkPosition(8);
        this._dataView.setFloat64(this.position, value, this.__isLittleEndian());
        this.position += 8;
    }

    writeFloat(value:number):void {
        this.__checkPosition(4);
        this._dataView.setFloat64(this.position, value, this.__isLittleEndian());
        this.position += 4;
    }

    writeInt(value:number):void {
        this.__checkPosition(4);
        this._dataView.setInt32(this.position, value, this.__isLittleEndian());
        this.position += 4;
    }

    writeShort(value:number):void {
        this.__checkPosition(2);
        this._dataView.setInt16(this.position, value, this.__isLittleEndian());
        this.position += 2;
    }

    writeUnsignedByte(value:number):void {
        this.__checkPosition(1);
        this._dataView.setUint8(this.position, value);
        this.position += 1;
    }

    writeUnsignedInt(value:number):void {
        this.__checkPosition(4);
        this._dataView.setUint32(this.position, value, this.__isLittleEndian());
        this.position += 4;
    }

    writeUnsignedShort(value:number):void {
        this.__checkPosition(2);
        this._dataView.setUint16(this.position, value, this.__isLittleEndian());
        this.position += 2;
    }

    // MIC
    static from(buffer:ArrayBuffer):ByteArray {
        var arrayBuffer = new ByteArray();
        arrayBuffer._buffer = buffer;
        arrayBuffer._dataView = new DataView(buffer);
        arrayBuffer._length = buffer.byteLength;
        arrayBuffer._position = 0;
        return arrayBuffer;
    }

    // MIC
    flatten():number[] {
        this.__ensureBufferExists();
        var array:number[] = new Array<number>(this.length);
        for (var i = 0; i < array.length; ++i) {
            array[i] = this._dataView.getUint8(i);
        }
        return array;
    }

    get rawBuffer():ArrayBuffer {
        return this._buffer;
    }

    private __adjustLength(targetLength:number):void {
        var oldBuffer = this._buffer;
        var oldDataView = this._dataView;
        var newBuffer = new ArrayBuffer(targetLength);
        var newDataView = new DataView(newBuffer);
        if (GLUtil.ptr(oldBuffer)) {
            var copyLength = targetLength > this.length ? oldBuffer.byteLength : newBuffer.byteLength;
            for (var i = 0; i < copyLength; ++i) {
                newDataView.setUint8(i, oldDataView.getUint8(i));
            }
            for (var i = copyLength; i < newBuffer.byteLength; ++i) {
                newDataView.setUint8(i, 0);
            }
        } else {
            for (var i = 0; i < newBuffer.byteLength; ++i) {
                newDataView.setUint8(i, 0);
            }
        }
        this._buffer = newBuffer;
        this._dataView = newDataView;
    }

    private __ensureBufferExists():void {
        if (this._buffer === null) {
            throw new ApplicationError("Buffer has not been allocated.");
        }
    }

    private __checkPosition(minimumReservedBytes:number):void {
        this.__ensureBufferExists();
        if (this.bytesAvailable < minimumReservedBytes) {
            throw new EOFError("Position is out of buffer range.")
        }
    }

    private __isLittleEndian():boolean {
        return this.endian === Endian.LITTLE_ENDIAN;
    }

    private _length:number = 0;
    private _position:number = -1;
    private _endian:string = Endian.BIG_ENDIAN;
    private _buffer:ArrayBuffer = null;
    private _dataView:DataView = null;

}
