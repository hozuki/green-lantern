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
        const dictionary = this.dictionary;
        dictionary.clear();
        source = Coerce.toString(source);
        if (source.length === 0) {
            return;
        }
        const charPositions: number[] = [];
        const chars: string[] = ["=", "&"];
        let currentToSearch = 0;
        let lastIndex = source.indexOf(chars[currentToSearch]);
        if (lastIndex <= 0) {
            return;
        }
        while (lastIndex > 0) {
            charPositions.push(lastIndex);
            currentToSearch = Coerce.toNumber(!currentToSearch);
            lastIndex = source.indexOf(chars[currentToSearch], lastIndex + 1);
        }
        const charPositionsLength = charPositions.length;
        if (charPositionsLength === 0) {
            return;
        } else if (charPositionsLength === 1) {
            dictionary.set(source);
        }
        for (let i = 0; i < charPositionsLength; ++i) {
            const key = source.substring(0, charPositions[i] - 1);
            if (i < charPositionsLength - 1) {
                ++i;
                const value = source.substring(charPositions[i - 1] + 1, charPositions[i] - 1);
                dictionary.set(key, value);
            } else {
                const endString = source.substring(charPositions[i] + 1, source.length - 1);
                if (endString.length > 0) {
                    dictionary.set(endString);
                }
                return;
            }
            if (i === charPositionsLength - 1) {
                const endString = source.substring(charPositions[i] + 1, source.length - 1);
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
