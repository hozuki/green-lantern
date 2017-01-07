/**
 * Created by MIC on 2015/11/18.
 */

abstract class StageDisplayState {

    static get FULL_SCREEN(): string {
        return 'fullScreen';
    }

    static get FULL_SCREEN_INTERACTIVE(): string {
        return 'fullScreenInteractive';
    }

    static get NORMAL(): string {
        return 'normal';
    }

}

export default StageDisplayState;
