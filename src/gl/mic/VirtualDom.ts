/**
 * Created by MIC on 2016/8/22.
 */

const $g: {
    $env: Window | NodeJS.Global,
    $raf: (callback: FrameRequestCallback) => number,
    $caf: (handle: number) => void
} = Object.create(null);
$g.$env = <any>(window || self || global || {});

init();

export abstract class VirtualDom {

    static get env(): Window | NodeJS.Global {
        return $g.$env;
    }

    static createElement<T extends HTMLElement>(tagName: string): T {
        return <T>window.document.createElement(tagName);
    }

    static setStyle(element: HTMLElement, name: string, value: string) {
        element.style[name] = value;
    }

    static setInterval(fn: Function, millis: number, ...params: any[]): number {
        return $g.$env.setInterval.apply($g.$env, arguments);
    }

    static clearInterval(handle: number): void {
        return $g.$env.clearInterval.apply($g.$env, arguments);
    }

    static get appVersion(): string {
        if ($g.$env === window) {
            return window.navigator.appVersion;
        } else {
            return "MIC VDOM 0.1";
        }
    }

    static get requestAnimationFrame(): (f: FrameRequestCallback) => number {
        return $g.$raf;
    }

    static get cancelAnimationFrame(): (handle: number) => void {
        return $g.$caf;
    }

    /*
     * Do NOT change the definition. Use auto inference well.
     */
    static get WebGLRenderingContext() {
        return windowExists() ? WebGLRenderingContext : null;
    }

}

function windowExists(): boolean {
    return $g.$env === window;
}

function init(): void {
    if (!windowExists()) {
        console.warn("requestAnimationFrame and cancelAnimationFrame need a window to execute.");
        return;
    }
    if (windowExists()) {
        const raf = "RequestAnimationFrame",
            caf = "CancelAnimationFrame",
            webkit = "webkit",
            o = "o",
            moz = "moz",
            ms = "ms";
        const win = <any>window;
        $g.$raf = win.requestAnimationFrame;
        if (!$g.$raf) {
            $g.$raf = win[webkit + raf] || win[ms + raf] || win[moz + raf] || win[o + raf];
        }
        if ($g.$raf) {
            $g.$raf = $g.$raf.bind($g.$env);
        }
        $g.$caf = win.cancelAnimationFrame;
        if (!$g.$caf) {
            $g.$raf = win[webkit + caf] || win[ms + caf] || win[moz + caf] || win[o + caf];
        }
        if ($g.$caf) {
            $g.$caf = $g.$caf.bind($g.$env);
        }
    } else {
        $g.$raf = $g.$caf = null;
    }
}
