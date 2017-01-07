/**
 * Created by MIC on 2015/11/18.
 */

abstract class StageQuality {

    static get BEST(): string {
        return 'best';
    }

    static get HIGH(): string {
        return 'high';
    }

    static get LOW(): string {
        return 'low';
    }

    static get MEDIUM(): string {
        return 'medium';
    }

}

export default StageQuality;
