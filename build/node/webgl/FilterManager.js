/**
 * Created by MIC on 2015/11/17.
 */
"use strict";
var RenderHelper_1 = require("./RenderHelper");
var FilterManager = (function () {
    function FilterManager(renderer) {
        this._tempTarget = null;
        this._renderer = null;
        this._filterGroups = null;
        this._renderer = renderer;
        this._filterGroups = [];
        this._tempTarget = renderer.createRenderTarget();
    }
    FilterManager.prototype.dispose = function () {
        this._renderer.releaseRenderTarget(this._tempTarget);
        this.clearFilterGroups();
        this._tempTarget = null;
        this._filterGroups = null;
        this._renderer = null;
    };
    FilterManager.prototype.clearFilterGroups = function () {
        var filterGroup;
        var filterGroups = this._filterGroups;
        if (filterGroups.length > 0) {
            for (var i = 0; i < filterGroups.length; ++i) {
                filterGroup = filterGroups[i];
                while (filterGroup.length > 0) {
                    filterGroup.pop();
                }
            }
        }
        while (filterGroups.length > 0) {
            filterGroups.pop();
        }
    };
    FilterManager.prototype.pushFilterGroup = function (group) {
        this._filterGroups.push(group.slice());
    };
    FilterManager.prototype.popFilterGroup = function () {
        return this.hasFilterGroups ? this._filterGroups.pop() : null;
    };
    Object.defineProperty(FilterManager.prototype, "hasFilterGroups", {
        get: function () {
            return this._filterGroups.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterManager.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    FilterManager.prototype.processFilters = function (renderer, input, output, clearOutput) {
        if (input === output) {
            console.warn("Filter alert: input and output are the same, processing aborted.");
            return;
        }
        if (this.hasFilterGroups) {
            var filterGroup = this._filterGroups[this._filterGroups.length - 1];
            var filter;
            var t1 = input, t2 = this._tempTarget;
            t2.clear();
            var t;
            for (var i = 0; i < filterGroup.length; i++) {
                filter = filterGroup[i];
                if (filter !== null) {
                    filter.process(renderer, t1, t2, true);
                    t = t1;
                    t1 = t2;
                    t2 = t;
                }
            }
            // Y-axis should be flipped from element to screen, due to the difference between OpenGL coordinate
            // system and Flash coordinate system.
            RenderHelper_1.RenderHelper.copyTargetContent(renderer, t1, output, false, true, clearOutput);
        }
    };
    return FilterManager;
}());
exports.FilterManager = FilterManager;

//# sourceMappingURL=FilterManager.js.map
