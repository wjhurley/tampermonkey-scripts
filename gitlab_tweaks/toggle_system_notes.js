// ==UserScript==
// @name         GitLab -- Toggle System Notes
// @namespace    GLTweaks
// @version      0.9
// @description  Add button in GitLab that removes li.system-note elements
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*/*/merge_requests/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

// ==KnownIssues==
// Does not load on mobile
// ==/KnownIssues==

// ==ToDo==
// Implement on Issues
// ==/ToDo==

(function() {
    'use strict';

    function constructButton() {
        var notesActive = getNotesTab();
        var tabsBar = document.querySelector('ul.merge-request-tabs');

        if (!tabsBar) {
            return false;
        }

        var toggleSystemNotes = document.createElement('BUTTON');
        toggleSystemNotes.className = 'btn btn-default';
        toggleSystemNotes.id = 'toggleSystemNotes';
        toggleSystemNotes.innerHTML = 'Hide System Notes';
        toggleSystemNotes.setAttribute('data-active', 'false');
        toggleSystemNotes.style.display = notesActive ? '' : 'none';
        toggleSystemNotes.style.margin = '0.5em 0.5em';
        toggleSystemNotes.addEventListener('click', function(e) {
            var systemNotes = Array.prototype.slice.call(document.querySelectorAll('ul.main-notes-list > li.system-note'));
            for (var i = 0; i < systemNotes.length; i++) {
                systemNotes[ i ].style.display = (e.target.getAttribute('data-active') === 'false') ? 'none' : 'block';
            }
            e.target.innerHTML = (e.target.getAttribute('data-active') === 'false') ? 'Show System Notes' : 'Hide System Notes';
            e.target.setAttribute('data-active', (e.target.getAttribute('data-active') === 'false') ? 'true' : 'false');
        }, true);
        tabsBar.appendChild(toggleSystemNotes);
    }

    function getNotesTab() {
        var tab = document.querySelector('li.notes-tab');

        return tab !== null && typeof tab !== 'undefined';
    }

    function toggleButton(show) {
        var button = document.getElementById('toggleSystemNotes');
        if (typeof button === 'undefined') {
            return false;
        }
        button.style.display = (show) ? 'inline-block' : 'none';
    }

    document.querySelector('html').addEventListener('DOMSubtreeModified', function() {
        if (document.getElementById('toggleSystemNotes')) {
            return false;
        }

        constructButton();

        var tabs = Array.prototype.slice.call(document.querySelectorAll("a[data-toggle='tab']"));
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function(e) {
                toggleButton(e.target.getAttribute('data-target') === 'div#notes');
            }, true);
        }
    }, true);
})();