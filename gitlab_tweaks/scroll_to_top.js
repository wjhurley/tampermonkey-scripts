// ==UserScript==
// @name         GitLab -- Scroll-To-Top
// @namespace    GLTweaks
// @version      0.4
// @description  Add button to instantly scroll to top of page
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*
// @exclude      https://<your domain here>/users/sign_in
// @grant        none
// @run-at       document-end
// ==/UserScript==

// ==KnownIssues==
// Doensn't Work in Firefox 53
// ==/KnownIssues==

(function() {
    function scrollTo(element, to, duration) {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) return;
            scrollTo(element, to, duration - 10);
        }, 10);
    }

    function createButton() {
        if (document.getElementById('scrollUpButton')) {
            return false;
        }

        var button = document.createElement('DIV');
        button.id =                    'scrollUpButton';
        button.innerHTML =             '&#9651';
        button.style.backgroundColor = 'rgb(50, 50, 50)';
        button.style.borderRadius =    '1em';
        button.style.color =           '#fff';
        button.style.cursor =          'pointer';
        button.style.height =          '75px';
        button.style.fontSize =        '40px';
        button.style.opacity =         '0.75';
        button.style.paddingLeft =     '1px';
        button.style.paddingTop =      '3px';
        button.style.position =        'fixed';
        button.style.textAlign =       'center';
        button.style.right =           '1em';
        button.style.bottom =          '1em';
        button.style.width =           '75px';
        button.style.zIndex =          '20';

        button.addEventListener('click', function () {
            scrollTo(document.body, 0, 750);
        });

        document.querySelector('body').appendChild(button);
    }

    document.querySelector('html').addEventListener('DOMSubtreeModified', function() {
        createButton();
    });
})();
