/**
 * Created by MIC on 2015/11/30.
 */

abstract class BitmapFilterQuality {

    static get HIGH(): number {
        return 3;
    }

    static get LOW(): number {
        return 1;
    }

    static get MEDIUM(): number {
        return 2;
    }

}

export default BitmapFilterQuality;
