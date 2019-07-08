// ==UserScript==
// @name         GitLab -- Hide [WIP] MR's
// @namespace    GLTweaks
// @version      2019.7.8
// @description  Add button in hide any [WIP] MR's from list
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey/issues
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
        var linkBar = document.querySelector('.nav-controls');

        if (linkBar === null) {
            return false;
        }

        var newButton = document.createElement('BUTTON');
        newButton.className = 'btn btn-default';
        newButton.id = 'toggleWIPMerges';
        newButton.innerHTML = 'Hide [WIP] Merges';
        newButton.setAttribute('data-active', 'false');
        newButton.addEventListener('click', function(e) {
            var isActive = e.target.getAttribute('data-active') !== 'false';
            var mergeRequests = Array.prototype.slice.call(document.querySelectorAll('ul.mr-list > li.merge-request'));
            var target = e.target;
            for (var i = 0; i < mergeRequests.length; i++) {
                if (!isWIP(mergeRequests[i])) {
                    continue;
                }
                mergeRequests[i].style.display = !isActive ? 'none' : 'flex';
            }

            target.classList.toggle('btn-default');
            target.classList.toggle('btn-success');
            target.innerHTML = [
                !isActive ? 'Show' : 'Hide',
                '[WIP] Merges',
            ].join(' ');
            target.setAttribute('data-active', !isActive ? 'true' : 'false');
        }, true);
        linkBar.insertBefore(newButton, linkBar.children[0]);
    }

    function isWIP(item) {
        var title = item.getElementsByTagName('A')[0];

        return /^[\[]?WIP[\]:]?/.test(title.innerHTML);
    }

    constructButton();
})();
