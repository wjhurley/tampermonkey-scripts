// ==UserScript==
// @name         CodiMD -- Vibrant-Ink
// @namespace    CodiMdTweaks
// @version      2019.5.24
// @description  Allow Vibrant-Ink Theme in CodiMD
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<codimd domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // TODO: This should be a selectable option
    var CUSTOM_CLASS = 'cm-s-base16-dark';
    var ONE_DARK_THEME = 'cm-s-one-dark';

    // Add toggle control to DOM
    var appendToggle = function appendButton() {
        var statusIndicators = document.querySelectorAll('.status-indicators');
        if (statusIndicators.length === 0) {
            console.warn('Missing .status-bar...exiting');
            return;
        }
        else if (statusIndicators.length > 1) {
            console.warn('Found more than one .status-indicators...exiting');
            return;
        }

        var insertPoint = statusIndicators[0];

        var toggle = document.createElement('div');
        toggle.dataset.isActive = '1';
        toggle.id = 'toggleTheme';
        toggle.innerText = 'Apply Theme';
        toggle.style.backgroundColor = '#28a745';
        toggle.style.cursor = 'pointer';

        toggle.addEventListener('click', function(e) {
            var target = e.currentTarget;
            toggleStatus(target);
            toggleStyle(target.dataset.isActive === '1');
        });

        insertPoint.appendChild(toggle);
        toggleStyle(true);
    };

    /**
     * Toggle the button data-active attribute
     * @param target {EventTarget}
     */
    var toggleStatus = function toggleStatus(target) {
        var isActive = target.dataset.isActive === '1';
        target.style.backgroundColor = isActive ? 'inherit' : '#28a745';
        target.dataset.isActive = isActive ? '0' : '1';
    };

    /**
     * Toggle Default style and selected theme
     * @param isActive {Boolean}
     */
    var toggleStyle = function toggleStyle(isActive) {
        var currentClass = isActive ? ONE_DARK_THEME : CUSTOM_CLASS;
        var newClass = isActive ? CUSTOM_CLASS : ONE_DARK_THEME;

        var overwrites = Array.prototype.slice.call(document.getElementsByClassName(currentClass));
        overwrites.forEach(function(element) {
            element.classList.remove(currentClass);
            element.classList.add(newClass);
        });
    };

    document.addEventListener('DOMSubtreeModified', function() {
        var toggle = document.getElementById('toggleTheme');
        if (toggle !== null) {
            return;
        }

        appendToggle();
    });
})();