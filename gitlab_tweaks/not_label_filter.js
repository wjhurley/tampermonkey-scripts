// ==UserScript==
// @name         GitLab -- Not Label Filter
// @namespace    GLTweaks
// @version      0.1
// @description  Filter specific labels out of Board / Issue List
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>*issues/*
// @match        https://<your domain here>*boards/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

// ==KnownIssues==
// Does not load on mobile
// ==/KnownIssues==

(function() {
    var isIssue = /issues/.test(window.location);

    var labelsToFilter = [
        // List of labels to filter
    ];

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

            issues.forEach(function(issue) {
                var labels = Array.prototype.slice.call(issue.querySelectorAll('.board-card-labels > button'));

                if (labels.some(function(label) { return labelsToFilter.indexOf(label.innerText) > -1; })) {
                    issue.style.display = 'none';
                    decrementBoardCounter(counter);
                }
            });
        });
    };

    var filterIssueList = function filterIssueList() {
        // TODO
    };

    document.querySelector('html').addEventListener('DOMSubtreeModified', function() {
        if (isIssue) {
            filterIssueList();
            return;
        }

        filterBoards();
    }, true);
})();