// ==UserScript==
// @name         GitLab -- Not Label Filter
// @namespace    GLTweaks
// @version      2019.5.9-1
// @description  Filter specific labels out of Board / Issue List
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*/issues/*
// @match        https://<your domain here>/*/boards/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

// ==KnownIssues==
// Does not load on mobile
// ==/KnownIssues==

(function() {
    var isIssue = /issues/.test(window.location);

    var addConfigButton = function addConfigButton() {
        if (document.getElementById('labelConfig') !== null) {
            return;
        }

        var navBarSelector = 'ul.nav.navbar-nav';

        var navBarNav = document.querySelector(navBarSelector);
        if (navBarNav === null) {
            console.warn('Can not locate ' + navBarSelector);
            return;
        }

        var li = document.createElement('li');
        li.className = 'header';
        li.id = 'labelConfig';
        li.title = 'Labels To Filter';

        var button = document.createElement('button');
        button.className = 'btn btn-default';
        button.innerText = 'Configure Label Filter';

        button.addEventListener('click', function() {
            configureLabels();
        });

        li.appendChild(button);
        navBarNav.insertBefore(li, navBarNav.children[0]);
    };

    var addIssueButton = function addIssueButton() {
        var issueNavSelector = 'div.nav-controls.issues-nav-controls';

        var issueNavControls = document.querySelector(issueNavSelector);
        if (issueNavControls === null) {
            console.warn('Can not locate ' + issueNavSelector);
            return;
        }

        var button = document.createElement('button');
        button.className = 'btn btn-default append-right-10 js-bulk-update-toggle';
        button.dataset.active = '0';
        button.id = 'labelToggle';
        button.innerText = 'Toggle Filtered Labels';
        button.name = 'button';
        button.title = getLabelsToFilter().join("\r\n");

        button.addEventListener('click', function(e) {
            toggleIssueList(button);
        });

        issueNavControls.insertBefore(button, issueNavControls.children[0]);
    };

    var configureLabels = function configureLabels() {
        GM_setValue('labelsToFilter', prompt('Enter labels to be filtered separated by a comma:', getLabelsToFilter()));
    };

    /**
     * @param counter {Element}
     */
    var decrementBoardCounter = function updateBoardCounter(counter) {
        if (typeof counter.dataset.originalTitle === 'undefined') {
            return;
        }

        var currentCount = counter.dataset.originalTitle.match(/(\d+) issues/)[1];
        var newCount = currentCount - 1;

        counter.dataset.originalTitle = counter.dataset.originalTitle.replace(new RegExp(currentCount), newCount);

        var labelSpan = counter.querySelector('span');

        if (labelSpan === null) {
            return;
        }

        labelSpan.innerText = newCount.toString();
    };

    var getLabelsToFilter = function getLabelsToFilter() {
        return (GM_getValue('labelsToFilter', '') === null ? '' : GM_getValue('labelsToFilter', '')).split(',');
    };

    var initFilterIssueList = function filterIssueList() {
        if (document.getElementById('labelToggle') !== null) {
            return;
        }

        addIssueButton();
    };

    var filterBoards = function filterBoards() {
        var filterAllBoards = false;
        var boards = Array.prototype.slice.call(document.querySelectorAll('.board'));

        if (!filterAllBoards) {
            boards = boards.filter(function(board) {
                var boardList = board.querySelector('.board-list-component > ul');

                return boardList.dataset.boardType === 'backlog';
            });
        }

        boards.forEach(function(board) {
            var counter = board.querySelector('.issue-count-badge');
            var issues = Array.prototype.slice.call(board.querySelectorAll('li'));
            var labelsToFilter = getLabelsToFilter();

            issues.forEach(function(issue) {
                var labels = Array.prototype.slice.call(issue.querySelectorAll('.board-card-labels > button'));

                if (labels.some(function(label) { return labelsToFilter.indexOf(label.innerText) > -1; })) {
                    issue.style.display = 'none';
                    decrementBoardCounter(counter);
                }
            });
        });
    };

    /**
     * @param button {HTMLButtonElement}
     * @param isActive {Boolean}
     */
    var toggleIssueButton = function toggleIssueButton(button, isActive) {
        button.dataset.active = (isActive ? 1 : 0).toString();

        if (isActive) {
            button.classList.remove('btn-default');
            button.classList.add('btn-success');
        }
        else {
            button.classList.remove('btn-success');
            button.classList.add('btn-default');
        }
    };

    /**
     * @param button {HTMLButtonElement}
     */
    var toggleIssueList = function toggleIssueList(button) {
        var isActive = Number(button.dataset.active) === 0;
        toggleIssueButton(button, isActive);

        var display = !isActive ? '' : 'none';
        var issues = Array.prototype.slice.call(document.querySelectorAll('li.issue'));
        var labelsToFilter = getLabelsToFilter();

        issues.forEach(function(issue) {
            var labels = Array.prototype.slice.call(issue.querySelectorAll('a.label-link'));

            if (labels.length === 0) {
                return;
            }


            if (labels.some(function(label) { return labelsToFilter.indexOf(label.innerText) > -1; })) {
                issue.style.display = display;
            }
        });
    };

    document.querySelector('html').addEventListener('DOMSubtreeModified', function() {
        addConfigButton();

        if (isIssue) {
            initFilterIssueList();
            return;
        }

        filterBoards();
    }, true);
})();