// ==UserScript==
// @name         Yahoo! Unsponsored
// @namespace    Unsponsored
// @version      0.2
// @description  Remove "Sponsored" Post on Yahoo! homepage
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://www.yahoo.com/
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function hideAds() {
        var ads = document.querySelectorAll("ul.js-stream-tmpl-items > li.js-stream-ad");

        ads.forEach(function(curr) {
            if (curr.style.display === 'none') {
                return false;
            }

            curr.style.display = 'none';
        });
    }

    document.querySelector('html').addEventListener('DOMSubtreeModified', function() {
        hideAds();
    }, true);
})();