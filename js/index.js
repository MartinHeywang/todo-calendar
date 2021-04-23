"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tasks_js_1 = require("./tasks.js");
var months = {
    "0": "January",
    "1": "February",
    "2": "March",
    "3": "April",
    "4": "May",
    "5": "June",
    "6": "July",
    "7": "August",
    "8": "September",
    "9": "October",
    "10": "November",
    "11": "December",
};
var days = ["M", "T", "W", "T", "F", "S", "S"];
var Calendar = function (startDate) {
    var calendar = document.createElement("div");
    calendar.classList.add("calendar");
    var title = document.createElement("h2");
    title.classList.add("calendar__title");
    title.textContent = months[startDate.getMonth()] + " " + startDate.getFullYear();
    var headings = document.createElement("ul");
    headings.classList.add("calendar__headings");
    days.forEach(function (day) {
        var heading = document.createElement("li");
        heading.textContent = day;
        heading.classList.add("calendar__heading", "calendar__" + day.toLowerCase());
        headings.appendChild(heading);
    });
    var cells = document.createElement("div");
    cells.classList.add("calendar__cells");
    var millisInDay = 1 * 24 * 60 * 60 * 1000;
    var firstOfMonth = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), 0));
    var firstDayInCalendar = new Date(firstOfMonth.getTime() - (firstOfMonth.getDay() - 1) * millisInDay);
    var lastDayInCalendar = new Date(firstOfMonth.getTime() - firstOfMonth.getDay() * millisInDay + 35 * millisInDay);
    for (var i = firstDayInCalendar.getTime(); i <= lastDayInCalendar.getTime(); i += millisInDay) {
        cells.appendChild(CalendarCell(new Date(new Date(i))).element);
    }
    calendar.append(title, headings, cells);
    return { element: calendar };
};
var CalendarCell = function (day) {
    var cell = document.createElement("div");
    cell.classList.add("calendar__cell");
    cell.setAttribute("tabindex", "1");
    var today = new Date(Date.now());
    if (day.getFullYear() === today.getFullYear() &&
        day.getMonth() === today.getMonth() &&
        day.getDate() === today.getDate()) {
        cell.classList.add("calendar__cell--today");
    }
    cell.append(day.getDate().toString());
    var hasDayEvents = tasks_js_1.hasTasks(day);
    if (hasDayEvents) {
        var dot = document.createElement("div");
        dot.classList.add("calendar__dot");
        cell.appendChild(dot);
    }
    return { element: cell };
};
var TaskList = function () {
    var taskList = document.createElement("div");
    taskList.classList.add("task-list");
    var taskModels = tasks_js_1.getTasks();
    taskModels.forEach(function (taskModel) {
        taskList.appendChild(Task(taskModel).element);
    });
    return { element: taskList };
};
var Task = function (taskModel) {
    var task = document.createElement("div");
    task.classList.add("task");
    task.style.backgroundColor = taskModel.color;
    var title = document.createElement("h3");
    title.textContent = taskModel.title;
    var actions = document.createElement("ul");
    actions.classList.add("task__actions");
    var actionsText = ["View", "Edit", "Delete"];
    actionsText.forEach(function (text) {
        var action = document.createElement("li");
        action.textContent = text;
        action.classList.add("task__action");
        actions.appendChild(action);
    });
    task.append(title, Duration(new Date(taskModel.startDate), new Date(taskModel.endDate)).element, actions);
    return { element: task };
};
var Duration = function (startDate, endDate) {
    var duration = document.createElement("span");
    var beautifyDate = function (date) {
        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    };
    if (tasks_js_1.sameDay(startDate, endDate)) {
        duration.append("" + beautifyDate(startDate));
    }
    else {
        duration.append(beautifyDate(startDate) + " - " + beautifyDate(endDate));
    }
    return { element: duration };
};
var calendarContainer = document.querySelector(".tasks .container");
calendarContainer === null || calendarContainer === void 0 ? void 0 : calendarContainer.appendChild(Calendar(new Date(Date.now())).element);
calendarContainer === null || calendarContainer === void 0 ? void 0 : calendarContainer.appendChild(TaskList().element);
