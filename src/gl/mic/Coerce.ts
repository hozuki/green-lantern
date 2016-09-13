/**
 * Created by MIC on 2016/9/13.
 */

export abstract class Coerce {

    static toString<T>(value: T): string {
        return "" + value;
    }

    static toNumber<T>(value: T): number {
        return Number(value);
    }

}
