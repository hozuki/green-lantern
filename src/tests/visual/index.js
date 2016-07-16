/**
 * Created by MIC on 2015/12/4.
 */

/**
 * @type {EngineBase}
 */
var lantern = null;
(function initGLantern() {
    if (GLantern.isSupported()) {
        lantern = new GLantern.EngineBase();
        lantern.initialize(682, 438);
        (function (selector) {
            var elem = document.querySelector(selector);
            elem.appendChild(lantern.view);
        })("#glantern-container");

        window.addEventListener("unload", function () {
            lantern.dispose();
        });
    }
})();

(function initList() {
    var testCases = {
        "Madoka": "raw-madoka-group.js",
        "Shapes and Interaction": "shapes-and-interaction.js",
        "TT Test Case #2": "tt-test-case-2.js",
        "Simple Text": "draw-text.js"
    };

    var caseListElem = document.querySelector("#test-case-selector");
    var checkResult = GLantern.glantern.GLUtil.checkSupportStatus();
    if (checkResult.ok) {
        initNormal();
    } else {
        initNotSupported(checkResult.reasons);
    }

    function onClick(ev) {
        /**
         * @type {HTMLAnchorElement}
         */
        var aElem = this;
        var e;
        e = document.querySelector("#test-case-selector-container");
        e.style.display = "none";
        e = document.querySelector("#test-case-desc");
        e.textContent = aElem.name;
        e = document.querySelector("#glantern-container");
        e.style.display = "block";
        injectAndExecute(aElem.name);
    }

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

    function initNormal() {
        for (var caseName in testCases) {
            if (testCases.hasOwnProperty(caseName)) {
                /**
                 * @type {HTMLLIElement}
                 */
                var liElem = document.createElement("li");
                /**
                 * @type {HTMLAnchorElement}
                 */
                var aElem = document.createElement("a");
                aElem.textContent = caseName;
                aElem.href = "javascript:;";
                aElem.name = "test-scripts/" + testCases[caseName];
                aElem.onclick = onClick.bind(aElem);
                liElem.appendChild(aElem);
                caseListElem.appendChild(liElem);
            }
        }
    }

    /**
     * Init elements when GLantern is not supported.
     * @param reasons {String[]}
     */
    function initNotSupported(reasons) {
        /**
         * @type {HTMLLIElement}
         */
        var liElem = document.createElement("li");
        /**
         * @type {HTMLParagraphElement}
         */
        var mainPara = document.createElement("p");
        mainPara.textContent = "Oops, it seems that GLantern is not support by your browser.";
        /**
         * @type {HTMLUListElement}
         */
        var reasonList = document.createElement("ul");
        /**
         * @type {HTMLParagraphElement}
         */
        var reasonPara = document.createElement("p");
        reasonPara.textContent = "Reason:";

        liElem.appendChild(mainPara);
        liElem.appendChild(reasonPara);
        liElem.appendChild(reasonList);

        for (var i = 0; i < reasons.length; ++i) {
            var li = document.createElement("li");
            li.textContent = reasons[i];
            reasonList.appendChild(li);
        }

        caseListElem.appendChild(liElem);
    }
})();
