/**
 * Created by MIC on 2016/9/13.
 */

import Coerce from "../../mic/Coerce";

export default class URLVariables {

    constructor(source: string = null) {
        this._dictionary = new Map<string, string>();
        source = Coerce.toString(source);
        if (source.length > 0) {
            this.decode(source);
        }
    }

    decode(source: string): void {
        var dictionary = this.dictionary;
        dictionary.clear();
        source = Coerce.toString(source);
        if (source.length === 0) {
            return;
        }
        var charPositions: number[] = [];
        var chars: string[] = ["=", "&"];
        var currentToSearch = 0;
        var lastIndex = source.indexOf(chars[currentToSearch]);
        if (lastIndex <= 0) {
            return;
        }
        while (lastIndex > 0) {
            charPositions.push(lastIndex);
            currentToSearch = Coerce.toNumber(!currentToSearch);
            lastIndex = source.indexOf(chars[currentToSearch], lastIndex + 1);
        }
        var charPositionsLength = charPositions.length;
        if (charPositionsLength === 0) {
            return;
        } else if (charPositionsLength === 1) {
            dictionary.set(source);
        }
        for (var i = 0; i < charPositionsLength; ++i) {
            var key = source.substring(0, charPositions[i] - 1);
            var value: string;
            if (i < charPositionsLength - 1) {
                ++i;
                value = source.substring(charPositions[i - 1] + 1, charPositions[i] - 1);
                dictionary.set(key, value);
            } else {
                var endString = source.substring(charPositions[i] + 1, source.length - 1);
                if (endString.length > 0) {
                    dictionary.set(endString);
                }
                return;
            }
            if (i === charPositionsLength - 1) {
                var endString = source.substring(charPositions[i] + 1, source.length - 1);
                if (endString.length > 0) {
                    dictionary.set(endString);
                }
                return;
            }
        }
    }

    // GLantern
    get dictionary(): Map<string,string> {
        return this._dictionary;
    }

    private _dictionary: Map<string, string> = null;

}
