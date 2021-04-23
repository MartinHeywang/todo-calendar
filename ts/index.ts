import { Task, getTasks, hasTasks, sameDay } from "./tasks.js";

interface Months {
    [key: number]: string;
}

const months: Months = {
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

const days = ["M", "T", "W", "T", "F", "S", "S"];

const Calendar = (startDate: Date) => {
    const calendar = document.createElement("div");
    calendar.classList.add("calendar");

    const title = document.createElement("h2");
    title.classList.add("calendar__title");
    title.textContent = `${months[startDate.getMonth()]} ${startDate.getFullYear()}`;

    const headings = document.createElement("ul");
    headings.classList.add("calendar__headings");
    days.forEach((day) => {
        const heading = document.createElement("li");
        heading.textContent = day;
        heading.classList.add("calendar__heading", `calendar__${day.toLowerCase()}`);

        headings.appendChild(heading);
    });

    const cells = document.createElement("div");
    cells.classList.add("calendar__cells");

    const millisInDay = 1 * 24 * 60 * 60 * 1000;
    const firstOfMonth = new Date(
        Date.UTC(startDate.getFullYear(), startDate.getMonth(), 0)
    );

    const firstDayInCalendar = new Date(
        firstOfMonth.getTime() - (firstOfMonth.getDay() - 1) * millisInDay
    );

    const lastDayInCalendar = new Date(
        firstOfMonth.getTime() - firstOfMonth.getDay() * millisInDay + 35 * millisInDay
    );

    for (
        let i = firstDayInCalendar.getTime();
        i <= lastDayInCalendar.getTime();
        i += millisInDay
    ) {
        cells.appendChild(CalendarCell(new Date(new Date(i))).element);
    }

    calendar.append(title, headings, cells);

    return { element: calendar };
};

const CalendarCell = (day: Date) => {
    const cell = document.createElement("div");
    cell.classList.add("calendar__cell");
    cell.setAttribute("tabindex", "1");

    const today = new Date(Date.now());

    if (
        day.getFullYear() === today.getFullYear() &&
        day.getMonth() === today.getMonth() &&
        day.getDate() === today.getDate()
    ) {
        cell.classList.add("calendar__cell--today");
    }

    cell.append(day.getDate().toString());

    const hasDayEvents = hasTasks(day);
    if (hasDayEvents) {
        const dot = document.createElement("div");
        dot.classList.add("calendar__dot");
        cell.appendChild(dot);
    }

    return { element: cell };
};

const TaskList = () => {
    const taskList = document.createElement("div");
    taskList.classList.add("task-list");

    const taskModels = getTasks();

    taskModels.forEach((taskModel) => {
        taskList.appendChild(Task(taskModel).element);
    });

    return { element: taskList };
};

const Task = (taskModel: Task) => {
    const task = document.createElement("div");
    task.classList.add("task");

    task.style.backgroundColor = taskModel.color;

    const title = document.createElement("h3");
    title.textContent = taskModel.title;

    const actions = document.createElement("ul");
    actions.classList.add("task__actions");
    const actionsText = ["View", "Edit", "Delete"];

    actionsText.forEach((text) => {
        const action = document.createElement("li");
        action.textContent = text;
        action.classList.add("task__action");
        actions.appendChild(action);
    });

    task.append(
        title,
        Duration(new Date(taskModel.startDate), new Date(taskModel.endDate)).element,
        actions
    );

    return { element: task };
};

const Duration = (startDate: Date, endDate: Date) => {
    const duration = document.createElement("span");

    const beautifyDate = (date: Date) => {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    if (sameDay(startDate, endDate)) {
        duration.append(`${beautifyDate(startDate)}`);
    } else {
        duration.append(`${beautifyDate(startDate)} - ${beautifyDate(endDate)}`);
    }

    return { element: duration };
};

const calendarContainer = document.querySelector(".tasks .container");
calendarContainer?.appendChild(Calendar(new Date(Date.now())).element);
calendarContainer?.appendChild(TaskList().element);
