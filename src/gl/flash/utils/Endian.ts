/**
 * Created by MIC on 2016/5/18.
 */

export abstract class Endian {

    static get BIG_ENDIAN():string {
        return "bigEndian";
    }

    static get LITTLE_ENDIAN():string {
        return "littleEndian";
    }

}
