/**
 * Created by MIC on 2016/9/13.
 */

import {NotImplementedError} from "../errors/NotImplementedError";
import {ByteArray} from "../utils/ByteArray";
import {URLVariables} from "./URLVariables";
import {URLRequestMethod} from "./URLRequestMethod";
import {URLRequestHeader} from "./URLRequestHeader";

export class URLRequest {

    constructor(url: string = null) {
        this._url = url;
    }

    get contentType(): string {
        return this._contentType;
    }

    set contentType(v: string) {
        this._contentType = v;
    }

    get data(): string | ByteArray | URLVariables {
        return this._data;
    }

    set data(v: string | ByteArray | URLVariables) {
        this._data = v;
    }

    get digest(): string {
        return this._digest;
    }

    set digest(v: string) {
        this._digest = v;
    }

    get followRedirects(): boolean {
        return this._followRedirects;
    }

    set followRedirects(v: boolean) {
        this._followRedirects = v;
    }

    get method(): string {
        return this._method;
    }

    set method(v: string) {
        v = v.toUpperCase();
        if (!(v === URLRequestMethod.GET || v === URLRequestMethod.POST)) {
            v = URLRequestMethod.GET;
        }
        this._method = v;
    }

    get requestHeaders(): URLRequestHeader[] {
        return this._requestHeaders;
    }

    set requestHeaders(v: URLRequestHeader[]) {
        this._requestHeaders = v;
    }

    get url(): string {
        return this._url;
    }

    set url(v: string) {
        this._url = v;
    }

    get userAgent(): string {
        return this._userAgent;
    }

    set userAgent(v: string) {
        this._userAgent = v;
    }

    useRedirectedURL(sourceRequest: URLRequest, wholeURL: boolean = false, pattern: any = null, replace: string = null): void {
        throw new NotImplementedError();
    }

    private _contentType: string = "application/x-www-form-urlencoded";
    private _data: string | ByteArray | URLVariables = null;
    private _digest: string = null;
    private _followRedirects: boolean = true;
    private _method: string = URLRequestMethod.GET;
    private _requestHeaders: URLRequestHeader[] = null;
    private _url: string = null;
    private _userAgent: string = "User-Agent: Shockwave Flash";

}
