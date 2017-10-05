// ==UserScript==
// @name         GitLab -- Show Datetime
// @namespace    GLTweaks
// @version      0.1
// @description  Convert all the "X <units> ago" to the corresponding datetime
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey/issues
// @match        https://<your domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const times =  Array.prototype.slice.call(document.querySelectorAll('time'));

    times.forEach((curr) => curr.innerHTML = curr.dataset.originalTitle );
})();