/**
 * Created by MIC on 2016/7/16.
 */

export default class Assert {

    static areEqual<T>(v1:T, v2:T, customComparator:(v1:T, v2:T) => boolean = null):boolean {
        if (typeof customComparator !== "function") {
            customComparator = defaultEqualityComparator;
        }
        return customComparator(v1, v2);
    }

}

function defaultEqualityComparator<T>(v1:T, v2:T):boolean {
    return v1 === v2;
}
