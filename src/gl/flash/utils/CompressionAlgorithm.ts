/**
 * Created by MIC on 2016/6/11.
 */

abstract class CompressionAlgorithm {

    static get DEFLATE(): string {
        return "deflate";
    }

    static get LZMA(): string {
        return "lzma";
    }

    static get ZLIB(): string {
        return "zlib";
    }

}

export default CompressionAlgorithm;
