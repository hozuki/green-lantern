abstract class AggUtils {

    static get bezierCollinearityEpsilon(): number {
        return 1e-30;
    }

    static get bezierAngleToleranceEpsilon(): number {
        return 0.01;
    }

    static get bezierRecursionLimit(): number {
        return 32;
    }

}

export default AggUtils;
