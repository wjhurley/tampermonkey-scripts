// ==UserScript==
// @name         GitLab -- Estimate Adjuster
// @namespace    GLTweaks
// @version      2019.8.9
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
        'w': 2400,
    };

    function addHints() {
        const hintContainer = document.querySelector('#at-view-commands');

        [
            {
                action: 'add',
                command: '/addEstimate',
                description: 'Add provided arguments to current estimate',
            },
            {
                action: 'subtract',
                command: '/subtractEstimate',
                description: 'Subtract provided arguments from current estimate',
            },
        ].forEach(action => {
            const div = document.createElement('div');
            div.dataset.command = action.command;
            div.setAttribute(ATTACHED_ATTRIBUTE, '1');
            div.style.height = '40px';

            const span = document.createElement('span');
            span.className = 'name';
            span.innerText = action.command;

            div.appendChild(span);

            const smallParams = document.createElement('small');
            smallParams.className = 'params';
            smallParams.innerText = '<1w 3d 2h 14m>';

            div.appendChild(smallParams);

            const smallDescription = document.createElement('small');
            smallDescription.className = 'description';
            smallDescription.innerText = action.description;

            div.addEventListener('click', (e) => {
                const target = e.currentTarget;

                const noteBody = document.querySelector('#note-body');
                if (noteBody === null) {
                    return;
                }

                // https://stackoverflow.com/a/11077016
                //IE support
                if (document.selection) {
                    noteBody.focus();
                    const sel = document.selection.createRange();
                    sel.text = target.dataset.command;
                }
                //MOZILLA and others
                else if (noteBody.selectionStart || noteBody.selectionStart === '0') {
                    const startPos = noteBody.selectionStart;
                    const endPos = noteBody.selectionEnd;
                    noteBody.value = [
                        noteBody.value.substring(0, startPos - 1),
                        target.dataset.command,
                        noteBody.value.substring(endPos, noteBody.value.length),
                    ].join('');
                    noteBody.selectionStart = startPos + target.dataset.command.length;
                    noteBody.selectionEnd = startPos + target.dataset.command.length;
                } else {
                    noteBody.value += target.dataset.command;
                }

                noteBody.focus();
            });

            div.addEventListener('mouseover', () => {
                const currentCur = document.querySelector('.cur');
                if (currentCur === null) {
                    return;
                }

                currentCur.classList.remove('cur');
            });

            div.appendChild(smallDescription);
            hintContainer.appendChild(div);
        });

        const hackyCss = `
            #at-view-commands div[${ATTACHED_ATTRIBUTE}] {
                padding: 8px 15px;
            }
            
            #at-view-commands div[${ATTACHED_ATTRIBUTE}]:hover {
                background-color: rgb(29, 31, 32);
                color: rgb(215, 213, 207);
                cursor: pointer;
            }`;
        const style = document.createElement('style');

        style.appendChild(document.createTextNode(hackyCss));

        document.getElementsByTagName('head')[0].appendChild(style);
    }

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

        const customHints = document.querySelector(`#at-view-commands div[${ATTACHED_ATTRIBUTE}]`);
        if (customHints === null) {
            addHints();
        }

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