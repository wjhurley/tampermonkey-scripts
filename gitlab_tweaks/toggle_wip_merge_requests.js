// ==UserScript==
// @name         GitLab -- Hide [WIP] MR's
// @namespace    GLTweaks
// @version      0.4
// @description  Add button in hide any [WIP] MR's from list
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*/*/merge_requests
// @match        https://<your domain here>/*/*/merge_requests?*
// @grant        none
// @run-at       document-end
// ==/UserScript==

// ==KnownIssues==
// Does not load on mobile
// ==/KnownIssues==

(function() {
    'use strict';

    function constructButton() {
        var linkBar = document.querySelector('ul.nav-links.issues-state-filters');

        if (!linkBar) {
            return false;
        }

        var newButton = document.createElement('BUTTON');
        newButton.className = 'btn btn-default';
        newButton.id = 'toggleWIPMerges';
        newButton.innerHTML = 'Hide [WIP] Merges';
        newButton.setAttribute('data-active', 'false');
        newButton.style.display = 'inline-block';
        newButton.addEventListener('click', function(e) {
            var mergeRequests = Array.prototype.slice.call(document.querySelectorAll('ul.mr-list > li.merge-request'));
            for (var i = 0; i < mergeRequests.length; i++) {
                if (!isWIP(mergeRequests[i])) {
                    continue;
                }
                mergeRequests[i].style.display = (e.target.getAttribute('data-active') === 'false') ? 'none' : 'block';
            }
            e.target.innerHTML = (e.target.getAttribute('data-active') === 'false') ? 'Show [WIP] Merges' : 'Hide [WIP] Merges';
            e.target.setAttribute('data-active', (e.target.getAttribute('data-active') === 'false') ? 'true' : 'false');
        }, true);
        linkBar.appendChild(newButton);
    }

    function isWIP(item) {
        var title = item.getElementsByTagName('A')[0];

        return /^[\[]?WIP[\]:]?/.test(title.innerHTML);
    }

    constructButton();
})();
