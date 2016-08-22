/**
 * Created by MIC on 2016/7/16.
 */

import * as os from "os";
import {TestEntry} from "./TestEntry";
import * as chalk from "chalk";

export default class TestRunner {

    constructor() {
    }

    run(entry: TestEntry): void {
        var result = entry.func();
        var str: string;
        if (result) {
            str = `[${chalk.green("PASSED")}]`;
        } else {
            str = `[${chalk.red("FAILED")}]`;
        }
        str = str + chalk.yellow(` ${entry.funcName} @ ${entry.moduleName}`);
        str = str + os.EOL + `${entry.desc}`;
        console.log(str);
    }

}
