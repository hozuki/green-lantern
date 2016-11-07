/**
 * Created by MIC on 2015/11/20.
 */

abstract class GraphicsPathCommand {

    public static get CUBIC_CURVE_TO(): number {
        return 6;
    }

    public static get CURVE_TO(): number {
        return 3;
    }

    public static get LINE_TO(): number {
        return 2;
    }

    public static get MOVE_TO(): number {
        return 1;
    }

    public static get NO_OP(): number {
        return 0;
    }

    public static get WIDE_LINE_TO(): number {
        return 5;
    }

    public static get WIDE_MOVE_TO(): number {
        return 4;
    }

}

export default GraphicsPathCommand;
