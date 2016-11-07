/**
 * Created by MIC on 2015/11/13.
 */

/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import VirtualDom from "../mic/VirtualDom";
import CommonUtil from "../mic/CommonUtil";

const gl = VirtualDom.WebGLRenderingContext;

const GET_A_WEBGL_BROWSER: string = `This page requires a browser that supports WebGL.<br/><a href="http://get.webgl.org">Click here to upgrade your browser.</a>`;
const OTHER_PROBLEM: string = `It appears your computer may not support WebGL.<br/><a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>`;

abstract class WebGLUtils {

    static setupWebGL(canvas: HTMLCanvasElement, optionalAttributes: any): WebGLRenderingContext {
        if (CommonUtil.isUndefined(gl)) {
            showLink(canvas.parentElement, GET_A_WEBGL_BROWSER);
            return null;
        }
        var context = create3DContext(canvas, optionalAttributes);
        if (!context) {
            showLink(canvas.parentElement, OTHER_PROBLEM);
        }
        return context;
    }

}

function showLink(container: HTMLElement, str: string): void {
    var failHtml = makeFailHtml(str);
    console.error(failHtml);
    if (container) {
        container.innerHTML = failHtml;
    }
}

function makeFailHtml(message: string): string {
    return `
<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>
<td align="center">
<div style="display: table-cell; vertical-align: middle;">
<div>${message}</div>
</div>
</td></tr></table>`;
}

function create3DContext(canvas: HTMLCanvasElement, optionalAttributes: any): WebGLRenderingContext {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context: WebGLRenderingContext = null;
    for (var i = 0; i < names.length; ++i) {
        try {
            context = <WebGLRenderingContext>canvas.getContext(names[i], optionalAttributes);
        } catch (e) {
        }
        if (context) {
            break;
        }
    }
    return context;
}

export default WebGLUtils;
