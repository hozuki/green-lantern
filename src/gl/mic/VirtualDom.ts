/**
 * Created by MIC on 2016/8/22.
 */

interface GlobalObject {
    $env: Window | NodeJS.Global,
    $raf: (callback: FrameRequestCallback) => number,
    $caf: (handle: number) => void,
    $setTimeout: (handler: any, timeout?: any, ...args: any[]) => NodeJS.Timer | number,
    $clearTimeout: (handle: NodeJS.Timer | number) => void,
    $openWindow: (url?: string, target?: string, features?: string, replace?: boolean) => Window,
    $assignLocation: (url: string) => void
}

const $g: GlobalObject = Object.create(null);
$g.$env = <any>(window || self || global || {});

init();

abstract class VirtualDom {

    static get env(): Window | NodeJS.Global {
        return $g.$env;
    }

    static createElement<T extends HTMLElement>(tagName: string): T {
        return <T>window.document.createElement(tagName);
    }

    static setStyle(element: HTMLElement, name: string, value: string) {
        (<any>element.style)[name] = value;
    }

    static setInterval(fn: Function, millis: number, ...params: any[]): number {
        return (<Function>$g.$env.setInterval).apply($g.$env, arguments);
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

    static get screenWidth(): number {
        return window.screen.width;
    }

    static get screenHeight(): number {
        return window.screen.height;
    }

    static get setTimeout(): (handler: any, timeout?: any, ...args: any[]) => NodeJS.Timer | number {
        return $g.$setTimeout;
    }

    static get clearTimeout(): (handle: NodeJS.Timer | number) => void {
        return $g.$clearTimeout;
    }

    static get openWindow(): (url?: string, target?: string, features?: string, replace?: boolean) => Window {
        return $g.$openWindow;
    }

    static get assignLocation(): (url: string) => void {
        return $g.$assignLocation;
    }

    /*
     * Do NOT change the definition. Use auto inference well.
     */
    static get WebGLRenderingContext() {
        return windowExists() ? WebGLRenderingContext : null;
    }

    static get isNodeJS(): boolean {
        return globalExists();
    }

    static appendChildToBody(element: HTMLElement): void {
        if ($g.$env === window) {
            window.document.body.appendChild(element);
        }
    }

    static removeChildFromBody(element: HTMLElement): void {
        if ($g.$env === window) {
            window.document.body.removeChild(element);
        }
    }

}

function windowExists(): boolean {
    return $g.$env === window;
}

function globalExists(): boolean {
    return $g.$env === global;
}

function init(): void {
    const we = windowExists();
    const ge = globalExists();
    if (!we) {
        console.warn("Some critical functions need a window to execute.");
        return;
    }
    // We have a preference for the more accurate Node.js timers.
    $g.$setTimeout = ge ? global.setTimeout.bind(global) : (we ? window.setTimeout.bind(window) : null);
    $g.$clearTimeout = ge ? global.clearTimeout.bind(global) : (we ? window.clearTimeout.bind(window) : null);
    if (we) {
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
        $g.$assignLocation = window.location.assign.bind(window.location);
        $g.$openWindow = window.open.bind(window);
    } else {
        $g.$raf = $g.$caf = null;
        $g.$assignLocation = null;
        $g.$openWindow = null;
    }
}

export default VirtualDom;
