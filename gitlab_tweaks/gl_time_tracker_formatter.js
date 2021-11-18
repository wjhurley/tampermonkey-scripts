// ==UserScript==
// @name         GitLab Time Tracker Formatter
// @namespace    GitLab
// @version      2021.11.18
// @description  Format spent time to hours and minutes and add daily and weekly total rows
// @author       Will Hurley
// @supportURL   https://github.com/wjhurley/tampermonkey-scripts/issues
// @match        https://<your GitLab domain here>/time/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to format the times to a more readable format
    function convertDecimalToHoursAndMinutes(timeSpent) {
        const isTimeSpentNegative = timeSpent < 0;
        let hours = 0;
        let minutes = Math.abs(Math.ceil(timeSpent * 60));

        while (minutes >= 60) {
            hours = Math.floor(minutes / 60);
            minutes -= hours * 60;
        }

        return `${isTimeSpentNegative ? '-' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm' : ''}`;
    }

    function createDailyTotalRow(day, dailyTotal) {
        const dailyTotalRow = document.createElement('tr');
        dailyTotalRow.style.color = dailyTotal >= 8 ? 'green' : 'red';

        for (let i = 0; i < 5; i += 1) {
            const newCell = document.createElement('td');

            if (i === 0) {
                newCell.innerText = `Total for ${day}`;
            }

            if (i === 1) {
                newCell.innerText = convertDecimalToHoursAndMinutes(dailyTotal);
            }

            dailyTotalRow.append(newCell);
        }

        return dailyTotalRow;
    }

    function createWeeklyTotalRow(day, weeklyTotal) {
        const weeklyTotalRow = document.createElement('tr');
        weeklyTotalRow.style.color = weeklyTotal >= 40 ? 'green' : 'red';

        for (let i = 0; i < 5; i += 1) {
            const newCell = document.createElement('td');

            if (i === 0) {
                newCell.innerText = `Total for week ending ${day}`;
            }

            if (i === 1) {
                newCell.innerText = convertDecimalToHoursAndMinutes(weeklyTotal);
            }

            weeklyTotalRow.append(newCell);
        }

        return weeklyTotalRow;
    }

    function formatRowsAndAddSummaries(rows) {
        // Tracking variables for reduce()
        let day = '';
        let dayOfWeek = 0;
        let dailyTotal = 0;
        let weeklyTotal = 0;

        return rows.reduce((days, row, index) => {
            const [
                dateCell,
                timeSpentCell,
                ...otherCells
            ] = row.children;
            const currentDay = dateCell.innerText.substring(0, 10);
            const currentDayOfWeek = (new Date(dateCell.innerText)).getDay();
            const currentTimeSpent = Number(timeSpentCell.innerText);
            const previousDay = index !== 0
                ? rows[index - 1].children[0].innerText.substring(0, 10)
                : '';

            // If we're just starting out, set the day and day of week to the first index's values
            if (index === 0) {
                day = currentDay;
                dayOfWeek = currentDayOfWeek;
            }

            // If we're still on the same day, add time spent to the daily running total
            if (currentDay === day) {
                dailyTotal += currentTimeSpent;
            } else {
                // If we're not on the same day, we need to append a new row to display the daily total
                const dailyTotalRow = createDailyTotalRow(day, dailyTotal);
                days.push(dailyTotalRow);
                // 'Reset' our tracking variables now that we've created the daily total row
                day = currentDay;
                dailyTotal = currentTimeSpent;
            }

            // If we're still in the same week, add time spent to the weekly running total
            if (currentDayOfWeek >= dayOfWeek) {
                weeklyTotal += currentTimeSpent;
            } else {
                // If we're not in the same week, we need to append a new row to display the weekly total
                const weeklyTotalRow = createWeeklyTotalRow(previousDay, weeklyTotal);
                days.push(weeklyTotalRow);
                // 'Reset' this tracking variable now that we've created the weekly total row
                weeklyTotal = currentTimeSpent;
            }

            // 'Reset' this tracking variable now that we've handled weekly totals/rows
            dayOfWeek = currentDayOfWeek;
            timeSpentCell.innerText = convertDecimalToHoursAndMinutes(currentTimeSpent);
            days.push(row);
            // Remove existing row so we can just append this array of elements when we're done without having to determine where to place the daily and weekly rows
            tableBody.removeChild(row);

            // If we're on the last entry, we need to add rows to display the day and week totals
            if (index === rows.length - 1) {
                const dayTotalRow = createDailyTotalRow(day, dailyTotal);
                days.push(dayTotalRow);

                const weekTotalRow = createWeeklyTotalRow(day, weeklyTotal);
                days.push(weekTotalRow);
            }

            return days;
        }, []);
    }

    // Add some spacing around the entire table
    const table = document.querySelector('table');
    table.cellPadding = 5;
    table.cellSpacing = 5;
    const tableBody = document.querySelector('tbody');
    // Make an array of all rows in the table
    const rows = Array.prototype.slice.call(document.querySelectorAll('tr'));
    // Remove the "header" row so we don't include it in the array passed to formatRowsAndAddSummaries()
    const tableHeaderRow = rows.shift();

    const formattedDays = formatRowsAndAddSummaries(rows);

    tableBody.innerHTML += formattedDays.map(row => row.outerHTML).join('');
})();