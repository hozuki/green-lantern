/**
 * Created by MIC on 2016/9/13.
 */

abstract class Coerce {

    static toString<T>(value: T): string {
        return "" + value;
    }

    static toNumber<T>(value: T): number {
        return Number(value);
    }

}

export default Coerce;
