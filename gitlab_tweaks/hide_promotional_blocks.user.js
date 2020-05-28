// ==UserScript==
// @name         GitLab -- Hide Promotional Blocks
// @namespace    GLTweaks
// @version      2020.5.28
// @description  Hide the Promotional "Please upgrade" divs
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var promotions = Array.prototype.slice.call(document.querySelectorAll('.promotion-issue-sidebar'));
    promotions.forEach(function(curr) {
        curr.style.display = 'none';
    });
})();