// ==UserScript==
// @name         GitLab -- Show Datetime
// @namespace    GLTweaks
// @version      2019.5.9
// @description  Convert all the "X <units> ago" to the corresponding datetime
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey/issues
// @match        https://<your domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function convertTimes() {
        window.convertingTime = 1;

        const times =  Array.prototype.slice.call(document.querySelectorAll('time'));
        times.forEach((curr) => {
            if (curr.dataset.timeConverted === '1') {
                return;
            }

            const newTitle = curr.innerHTML;
            curr.innerHTML = curr.dataset.originalTitle;
            curr.dataset.originalTitle = newTitle;
            curr.dataset.timeConverted = '1';
        });

        window.convertingTime = 0;
    }

    document.querySelector('body').addEventListener('DOMSubtreeModified', function() {
        if (window.convertingTime === 1) {
            return;
        }

        convertTimes();
    });
})();
