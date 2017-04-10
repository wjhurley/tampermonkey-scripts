// ==UserScript==
// @name         GitLab -- Collapse All Changes
// @namespace    GLTweaks
// @version      0.1
// @description  Add button to collapse all changes
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*/*/merge_requests*
// @grant        none
// @run-at       document-end
// ==/UserScript==

// ==KnownIssues==
// Does not load on mobile
// ==/KnownIssues==

(function() {
    function collapseChildren(parent) {
        var children = Array.prototype.slice.call(parent.querySelectorAll('div.diff-content'));
        children[0].style.display = 'none';
        children[1].style.display = 'block';
    }

    function constructButton() {
        var activeTab = getActiveTab();
        var tabsBar = document.querySelector('ul.merge-request-tabs');

        if (!tabsBar) {
            return false;
        }

        var collapseAllChanges = document.createElement('BUTTON');
        collapseAllChanges.className = 'btn btn-default';
        collapseAllChanges.id = 'collapseAllChanges';
        collapseAllChanges.innerHTML = 'Collapse All Changes';
        collapseAllChanges.setAttribute('data-active', 'false');
        collapseAllChanges.style.display = (activeTab && activeTab.getAttribute('data-action') === 'diffs') ? 'inline-block' : 'none';
        collapseAllChanges.addEventListener('click', function() {
            var carets = Array.prototype.slice.call(document.querySelectorAll('i.fa.diff-toggle-caret.fa-fw.fa-caret-down'));
            for (var i = 0; i < carets.length; i++) {
                var parent = getChangeContainer(carets[i]);
                if (parent !== null && typeof parent !== 'undefined') {
                    collapseChildren(parent);
                }
                carets[i].className = 'fa diff-toggle-caret fa-fw fa-caret-right';
            }
        }, true);
        tabsBar.appendChild(collapseAllChanges);
    }

    function getActiveTab() {
        return document.querySelector('li.diffs-tab.active > a');
    }

    function getChangeContainer(e) {
        var node = e;

        while (!/diff-file/.test(node.className)) {
            console.log([node, node.className]);
            node = node.parentNode;
        }

        return node;
    }

    function toggleButton(show) {
        var button = document.getElementById('collapseAllChanges');
        if (typeof button === 'undefined') {
            return false;
        }
        button.style.display = (show) ? 'inline-block' : 'none';
    }

    document.querySelector('html').addEventListener('DOMSubtreeModified', function() {
        if (document.getElementById('collapseAllChanges')) {
            return false;
        }

        constructButton();

        var tabs = Array.prototype.slice.call(document.querySelectorAll("a[data-toggle='tab']"));
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function(e) {
                toggleButton(e.target.getAttribute('data-action') === 'diffs');
            }, true);
        }
    }, true);
})();