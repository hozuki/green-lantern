/**
 * Created by MIC on 2016/9/13.
 */

abstract class URLRequestMethod {

    static get GET(): string {
        return "GET";
    }

    static get POST(): string {
        return "POST";
    }

}

export default URLRequestMethod;
