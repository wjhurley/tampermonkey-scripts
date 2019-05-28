// ==UserScript==
// @name         CodiMD -- Custom Themes
// @namespace    CodiMdTweaks
// @version      2019.5.28
// @description  Allow Custom Themes in CodiMD
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<codimd domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var Theme = Object.freeze({
        Base16Dark: 'cm-s-base16-dark',
        Darcula: 'cm-s-darcula',
        OneDark: 'cm-s-one-dark',
        Seti: 'cm-s-seti'
    });

    var currentClass = Theme.OneDark;
    var DEFAULT_CUSTOM = Theme.Base16Dark;
    var ONE_DARK_THEME = Theme.OneDark;

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
        toggle.classList.add('dropup');
        toggle.classList.add('toggle-dropdown');
        toggle.dataset.isActive = '1';
        toggle.id = 'toggleTheme';
        toggle.innerText = 'Apply Theme';
        toggle.style.backgroundColor = '#28a745';
        toggle.style.cursor = 'pointer';

        var list = document.createElement('ul');
        list.className = 'dropdown-menu';

        Object.keys(Theme).forEach(function(theme) {
            if (
                !Theme.hasOwnProperty(theme)
                || theme === 'OneDark'
            ) {
                return;
            }

            var line = document.createElement('li');
            var anchor = document.createElement('a');

            var isBase16Dark = theme === 'Base16Dark';
            anchor.dataset.className = Theme[theme];
            anchor.dataset.customTheme = '1';
            anchor.dataset.isActive = isBase16Dark ? '1' : '0';
            anchor.innerText = theme;
            anchor.style.backgroundColor = isBase16Dark ? '#28a745' : 'inherit';

            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                var target = e.target;
                toggleStatus(target);
                toggleStyle(target.dataset.isActive === '1', target.dataset.className);
            });

            line.appendChild(anchor);
            list.appendChild(line);
        });

        toggle.addEventListener('click', function(e) {
            var target = e.currentTarget;
            target.classList.toggle('open');
        });

        toggle.appendChild(list);
        insertPoint.appendChild(toggle);
        toggleStyle(true, DEFAULT_CUSTOM);
    };

    /**
     * Toggle the button data-active attribute
     * @param target {EventTarget}
     */
    var toggleStatus = function toggleStatus(target) {
        var isActive = target.dataset.isActive === '1';

        Array.prototype.slice.call(document.querySelectorAll('[data-custom-theme]')).forEach(function(theme) {
            if (theme.dataset.isActive === '1') {
                currentClass = theme.dataset.className;
            }
            theme.dataset.isActive = '0';
            theme.style.backgroundColor = 'inherit';
        });

        target.dataset.isActive = isActive ? '0' : '1';
        target.style.backgroundColor = isActive ? 'inherit' : '#28a745';
    };

    /**
     * Toggle Default style and selected theme
     * @param isActive {Boolean}
     * @param applyClass {String}
     */
    var toggleStyle = function toggleStyle(isActive, applyClass) {
        var newClass = isActive ? applyClass : ONE_DARK_THEME;

        var overwrites = Array.prototype.slice.call(document.getElementsByClassName(currentClass));
        overwrites.forEach(function(element) {
            element.classList.remove(currentClass);
            element.classList.add(newClass);
        });

        currentClass = newClass;

        var toggleTheme = document.getElementById('toggleTheme');
        if (currentClass === Theme.OneDark) {
            toggleTheme.style.backgroundColor = 'inherit';
        }
        else {
            toggleTheme.style.backgroundColor = '#28a745';
        }
    };

    document.addEventListener('DOMSubtreeModified', function() {
        var toggle = document.getElementById('toggleTheme');
        if (toggle !== null) {
            return;
        }

        appendToggle();
    });
})();