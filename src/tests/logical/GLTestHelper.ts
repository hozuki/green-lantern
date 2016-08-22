/**
 * Created by MIC on 2016/7/16.
 */

export default class GLTestHelper {

    static define(object: any, propertyName: string, propertyValue: any): void {
        object[propertyName] = propertyValue;
    }

    static defineTestModule(m: any): void {
        GLTestHelper.define(m, "isTestModule", true);
    }

    static defineTestCollection(m: any): void {
        GLTestHelper.define(m, "isTestCollection", true);
    }

    static isTestModule(m: any): boolean {
        return !!m["isTestModule"];
    }

    static isTestCollection(m: any): boolean {
        return !!m["isTestCollection"];
    }

    static getTestDescription(testFunction: Function): string {
        var code = testFunction.toString();
        var commentRegexp = /\/\*([^*]+)\*\//;
        var result = commentRegexp.exec(code);
        if (result && result.length > 1) {
            return result[1].trim();
        } else {
            return defaultTestDescription;
        }
    }

}

const defaultTestDescription = "Unnamed test";
