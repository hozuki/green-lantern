/**
 * Created by MIC on 2016/7/16.
 */

import * as chalk from "chalk";
import * as tests from "./index";
import GLTestHelper from "./GLTestHelper";
import TestEntry from "./TestEntry";
import TestRunner from "./TestRunner";

runTests(tests);

type KV<T, U> = {key: T, value: U};
type TestModule = {path: string, modObj: any};

function runTests(testObject: any): void {
    var searchQueue: KV<string, TestModule>[] = [];
    var testsQueue: TestEntry[] = [];
    searchQueue.push({
        key: null,
        value: {
            path: null,
            modObj: testObject
        }
    });
    while (searchQueue.length > 0) {
        var obj = searchQueue.shift();
        var modPath = obj.value.path;
        var modObj = obj.value.modObj;
        if (GLTestHelper.isTestModule(modObj)) {
            for (var propName in modObj) {
                if (modObj.hasOwnProperty(propName) && typeof modObj[propName] === "object") {
                    var searchItem: KV<string, TestModule> = {
                        key: propName,
                        value: {
                            path: modPath ? modPath + "." + propName : propName,
                            modObj: modObj[propName]
                        }
                    };
                    console.log(`Searching module: ${chalk.green(searchItem.value.path)}`);
                    searchQueue.push(searchItem);
                }
            }
        } else if (GLTestHelper.isTestCollection(modObj)) {
            for (var propName in modObj) {
                if (modObj.hasOwnProperty(propName) && typeof modObj[propName] === "function") {
                    var desc = GLTestHelper.getTestDescription(modObj[propName]);
                    var testItem: TestEntry = {
                        func: modObj[propName],
                        funcName: propName,
                        desc: desc,
                        moduleName: obj.key,
                        path: modPath
                    };
                    console.log(`Adding entry: ${chalk.blue(testItem.funcName)}`);
                    testsQueue.push(testItem);
                }
            }
        }
    }

    console.log("");
    console.log("=== Tests ===");
    var runner = new TestRunner();
    while (testsQueue.length > 0) {
        var o = testsQueue.shift();
        runner.run(o);
    }
}
