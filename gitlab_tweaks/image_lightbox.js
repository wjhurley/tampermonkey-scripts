// ==UserScript==
// @name         GitLab -- [WIP] Image Lightbox
// @namespace    GLTweaks
// @version      0.1-alpha
// @description  Default image click to lightbox
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


// ==Notes==
// This script is currently a work in progress
// ==/Notes==

(function() {
    'use strict';

    function attachEvents() {
        var images = document.querySelectorAll("div.image-container img");

        images.forEach(function(curr) {
            curr.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var image = document.createElement('IMG');
                image.id = 'lighboxImage';
                image.src = curr.getAttribute('src');
                image.style.height = '600px';
                image.style.width = 'auto';

                document.getElementById('lightboxContainer').innerHTML = '';
                document.getElementById('lightboxContainer').appendChild(image);
                toggleLightbox();
            }, true);
        });
    }

    function createBackdrop() {
        var shader = document.createElement('DIV');
        shader.addEventListener('click', function() { toggleLightbox(); }, true);
        shader.id = 'lightboxShader';
        shader.style.alignItems = 'center';
        shader.style.backgroundColor = '#000';
        shader.style.display = 'none';
        shader.style.height = '100%';
        shader.style.justifyContent = 'center';
        shader.style.left = '0';
        shader.style.opacity = '0.8';
        shader.style.position = 'fixed';
        shader.style.top = '0';
        shader.style.width = '100%';
        shader.style.zIndex = '9999';

        document.body.appendChild(shader);
    }

    function createContainer() {
        var container = document.createElement('DIV');
        container.id = 'lightboxContainer';
        container.style.height = '600px';
        container.style.opacity = '1';
        container.style.padding = '0';

        document.getElementById('lightboxShader').appendChild(container);
    }

    function createFullLink(url) {
        var button = document.createElement('BUTTON');
        button.addEventListener('click', function() {
            window.open(url);
        }, true);
        button.innerHTML = 'View Full';

        document.getElementById('lightboxContainer').appendChild(button);
    }

    function toggleLightbox() {
        var shader = document.getElementById('lightboxShader');
        shader.style.display = (shader.style.display === 'none') ? 'flex' : 'none';
    }

    createBackdrop();
    createContainer();
    attachEvents();
})();
