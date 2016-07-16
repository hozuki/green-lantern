/**
 * Created by MIC on 2016/7/16.
 */

import * as tests from "./index";
import GLTestHelper from "./GLTestHelper";
import {TestEntry} from "./TestEntry";
import TestRunner from "./TestRunner";

runTests(tests);

type KV<T, U> = {key:T, value:U};

function runTests(testObject:any):void {
    var searchQueue:KV<string, any>[] = [];
    var testsQueue:TestEntry[] = [];
    searchQueue.push({key: null, value: testObject});
    while (searchQueue.length > 0) {
        var obj = searchQueue.shift();
        if (GLTestHelper.isTestModule(obj.value)) {
            for (var propName in obj.value) {
                if (obj.value.hasOwnProperty(propName) && typeof obj.value[propName] === "object") {
                    searchQueue.push({key: propName, value: obj.value[propName]});
                }
            }
        } else if (GLTestHelper.isTestCollection(obj.value)) {
            for (var propName in obj.value) {
                if (obj.value.hasOwnProperty(propName) && typeof obj.value[propName] === "function") {
                    var desc = GLTestHelper.getTestDescription(obj.value[propName]);
                    testsQueue.push({
                        func: obj.value[propName],
                        funcName: propName,
                        desc: desc,
                        moduleName: obj.key
                    });
                }
            }
        }
    }

    var runner = new TestRunner();
    while (testsQueue.length > 0) {
        var o = testsQueue.shift();
        runner.run(o);
    }
}
