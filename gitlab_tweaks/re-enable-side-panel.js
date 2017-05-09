// ==UserScript==
// @name         GitLab -- Side-Panel
// @namespace    GLTweaks
// @version      0.1
// @description  Add side-panel menu that was removed
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

// ==Requires==
// Custom CSS: https://github.com/jccrofty30/tampermonkey-scripts/blob/master/gitlab_tweaks/re-enable-side-panel.css
// ==/Requires==

(function() {
    'use strict';

    var mainDiv = document.querySelector('div.page-with-sidebar');
    var mainNav = document.querySelector('header.navbar.navbar-gitlab');

    if (typeof mainDiv === 'undefined' || mainDiv === null || typeof mainNav === 'undefined' || mainNav === null) {
        return false;
    }

    document.querySelector('div.dropdown.global-dropdown').className += ' open';
    document.querySelector('button.global-dropdown-toggle').style.display = 'none';
    mainDiv.style.marginLeft = '200px';
    mainNav.style.marginLeft = '230px';
})();