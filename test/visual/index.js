/**
 * Created by MIC on 2015/12/4.
 */

/**
 * @type {GLantern}
 */
var lantern = new GLantern.GLantern();
lantern.initialize(682, 438);
document.body.appendChild(lantern.view);

window.addEventListener("unload", function () {
    lantern.uninitialize();
});

//GLantern.injectToGlobal(window);

/**
 * Execute a single script by injecting the script into the window.
 * @param fileName {String} Full JavaScript file name.
 */
function injectAndExecute(fileName) {
    /**
     * @type {HTMLScriptElement}
     */
    var script = document.createElement("script");
    script.src = fileName;
    document.body.appendChild(script);
}

injectAndExecute("test-scripts/raw-madoka-group.js");