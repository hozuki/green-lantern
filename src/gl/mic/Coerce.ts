/**
 * Created by MIC on 2016/9/13.
 */

abstract class Coerce {

    static toString<T>(value: T): string {
        return String(value);
    }

    static toNumber<T>(value: T): number {
        return Number(value);
    }

    static toBoolean<T>(value: T): boolean {
        return Boolean(value);
    }

}

export default Coerce;
