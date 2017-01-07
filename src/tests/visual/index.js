/**
 * Created by MIC on 2015/12/4.
 */

/**
 * @type {EngineBase}
 */
let lantern = null;
(function initGLantern() {
    if (GLantern.isSupported()) {
        lantern = new GLantern.EngineBase();
        const canvas = document.createElement("canvas");
        canvas.className = "glantern-view";
        lantern.initialize(canvas, 682, 438);
        ((selector) => {
            const elem = document.querySelector(selector);
            elem.appendChild(lantern.view);
        })("#glantern-container");

        window.addEventListener("unload", function () {
            lantern.dispose();
        });
    }
})();

(function initList() {
    const testCases = {
        "Madoka": "raw-madoka-group.js",
        "Shapes and Interaction": "shapes-and-interaction.js",
        "TT Test Case #2": "tt-test-case-2.js",
        "Simple Text": "simple-text.js",
        "Object Masking": "object-masking.js"
    };

    const caseListElem = document.querySelector("#test-case-selector");
    const checkResult = GLantern.checkSupportStatus();
    if (checkResult.ok) {
        initNormal();
    } else {
        initNotSupported(checkResult.reasons);
    }

    function onClick(ev) {
        /**
         * @type {HTMLAnchorElement}
         */
        const aElem = this;
        let e;
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
        const script = document.createElement("script");
        script.src = fileName;
        script.defer = true;
        document.body.appendChild(script);
    }

    function initNormal() {
        for (const caseName in testCases) {
            if (testCases.hasOwnProperty(caseName)) {
                /**
                 * @type {HTMLLIElement}
                 */
                const liElem = document.createElement("li");
                /**
                 * @type {HTMLAnchorElement}
                 */
                const aElem = document.createElement("a");
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
        const liElem = document.createElement("li");
        /**
         * @type {HTMLParagraphElement}
         */
        const mainPara = document.createElement("p");
        mainPara.textContent = "Oops, it seems that GLantern is not support by your browser.";
        /**
         * @type {HTMLUListElement}
         */
        const reasonList = document.createElement("ul");
        /**
         * @type {HTMLParagraphElement}
         */
        const reasonPara = document.createElement("p");
        reasonPara.textContent = "Reason:";

        liElem.appendChild(mainPara);
        liElem.appendChild(reasonPara);
        liElem.appendChild(reasonList);

        for (let i = 0; i < reasons.length; ++i) {
            const li = document.createElement("li");
            li.textContent = reasons[i];
            reasonList.appendChild(li);
        }

        caseListElem.appendChild(liElem);
    }
})();
