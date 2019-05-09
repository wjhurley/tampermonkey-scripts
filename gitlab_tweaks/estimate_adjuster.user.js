// ==UserScript==
// @name         GitLab -- Estimate Adjuster
// @namespace    GLTweaks
// @version      2019.5.9
// @description  Add slash-command to edit estimates
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*/issues/*
// @match        https://<your domain here>/*/merge_requests/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const ATTACHED_ATTRIBUTE = 'custom-attached';
    const UNIT_MAP = {
        'm': 1,
        'h': 60,
        'd': 480,
        'w': 2400, // I hope we don't need more 0_o
    };

    function adjustEstimate(target, isAdd) {
        const adjustment = target.value.match(/\/(?:add|subtract)Estimate ([^\r\n]+)/)[1];
        const sigNum = isAdd ? 1 : -1;

        if (typeof adjustment === 'undefined') {
            alert('Unable to locate adjustement');
            return;
        }

        const adjustmentParts = adjustment.match(/([\d.]{1,4})([a-z])/g);

        let adjustmentValue = 0;
        adjustmentParts.forEach(function (estimate) {
            const estimateParts = estimate.match(/([\d.]{1,4})([a-z])/);
            const factor = estimateParts[1];
            const unit = estimateParts[2];

            adjustmentValue += Number(factor) * UNIT_MAP[unit];
        });

        const newValue = (adjustmentValue * sigNum) + parseEstimate();
        target.value = target.value.replace(/\/(?:add|subtract)Estimate[^\r\n]+/, `/estimate ${formatEstimate(newValue)}`);
    }


    function attachListener() {
        const attachFields = Array.prototype.slice.call(document.querySelectorAll(`[data-supports-quick-actions]:not([${ATTACHED_ATTRIBUTE}])`));

        if (attachFields.length === 0) {
            return;
        }

        attachFields.forEach(function(field) {
            field.setAttribute(ATTACHED_ATTRIBUTE, '1');
            field.addEventListener('keyup', function(e) { parseInput(e); }, true);
        });
    }

    function formatEstimate(minutes) {
        const weeks = Math.floor(minutes / UNIT_MAP.w);
        minutes -= weeks * UNIT_MAP.w;
        console.log(minutes);

        const days = Math.floor(minutes / UNIT_MAP.d);
        minutes -= days * UNIT_MAP.d;
        console.log(minutes);

        const hours = Math.floor(minutes / UNIT_MAP.h);
        minutes -= hours * UNIT_MAP.h;
        console.log(minutes);

        const newEstimateParts = [];
        newEstimateParts.push(weeks > 0 ? `${weeks}w ` : '');
        newEstimateParts.push(days > 0 ? `${days}d ` : '');
        newEstimateParts.push(hours > 0 ? `${hours}h ` : '');
        newEstimateParts.push(minutes > 0 ? `${minutes}m` : '');

        return newEstimateParts.join('');
    }

    function parseEstimate() {
        const estimateField = document.querySelector('div.compare-display.estimated.float-right > span.compare-value');

        const currentEstimate = estimateField === null ? '' : estimateField.innerText;

        const estimateParts = currentEstimate.split(' ');

        return estimateParts.reduce(function(prev, curr) {
            const estimateParts = curr.match(/(\d{1,2})([a-z])/);
            const factor = estimateParts[1];
            const unit = estimateParts[2];

            return prev + (Number(factor) * UNIT_MAP[unit]);
        }, 0);
    }

    function parseInput(event) {
        const target = event.currentTarget;
        const value = target.value;

        if (!/\/(?:add|subtract)Estimate/.test(value)) {
            return;
        }

        if (!/\/(?:add|subtract)Estimate[^\r\n]+[\r\n]/.test(value)) {
            return;
        }

        adjustEstimate(target, /\/add/.test(value));
    }

    document.addEventListener('DOMSubtreeModified', attachListener);
})();