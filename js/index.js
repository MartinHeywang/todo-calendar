import * as tasks from "./tasks.js";
const months = {
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
const Calendar = (startDate) => {
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
    const firstOfMonth = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), 0));
    const firstDayInCalendar = new Date(firstOfMonth.getTime() - (firstOfMonth.getDay() - 1) * millisInDay);
    const lastDayInCalendar = new Date(firstOfMonth.getTime() - firstOfMonth.getDay() * millisInDay + 35 * millisInDay);
    const update = () => {
        cells.innerHTML = "";
        for (let i = firstDayInCalendar.getTime(); i <= lastDayInCalendar.getTime(); i += millisInDay) {
            cells.appendChild(CalendarCell(new Date(new Date(i))).element);
        }
    };
    update();
    calendar.append(title, headings, cells);
    return { element: calendar, update };
};
const CalendarCell = (day) => {
    const cell = document.createElement("div");
    cell.classList.add("calendar__cell");
    cell.setAttribute("tabindex", "1");
    const today = new Date(Date.now());
    if (day.getFullYear() === today.getFullYear() &&
        day.getMonth() === today.getMonth() &&
        day.getDate() === today.getDate()) {
        cell.classList.add("calendar__cell--today");
    }
    cell.append(day.getDate().toString());
    const hasDayEvents = tasks.hasTasks(day);
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
    const update = () => {
        const taskModels = tasks.getTasks();
        taskList.innerHTML = "";
        taskModels.forEach((taskModel) => {
            taskList.appendChild(Task(taskModel).element);
        });
    };
    update();
    return { element: taskList, update };
};
const Task = (taskModel) => {
    const task = document.createElement("div");
    task.classList.add("task");
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
    task.append(title, Duration(new Date(taskModel.startDate), new Date(taskModel.endDate)).element, actions);
    return { element: task };
};
const Duration = (startDate, endDate) => {
    const duration = document.createElement("span");
    const beautifyDate = (date) => {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    if (tasks.sameDay(startDate, endDate)) {
        duration.append(`${beautifyDate(startDate)}`);
    }
    else {
        duration.append(`${beautifyDate(startDate)} - ${beautifyDate(endDate)}`);
    }
    return { element: duration };
};
const Modal = () => {
    const pageMask = document.querySelector("#page-mask");
    const root = document.createElement("div");
    root.classList.add("modal");
    const header = document.createElement("div");
    header.classList.add("modal__header");
    root.appendChild(header);
    const title = document.createElement("h2");
    title.textContent = "...";
    title.classList.add("modal__title");
    const close = document.createElement("button");
    close.classList.add("modal__close");
    close.textContent = "Close";
    header.append(title, close);
    const setTitle = (text) => {
        title.textContent = text;
    };
    const setContent = (content) => {
        const oldContent = root.children[1];
        if (oldContent) {
            root.removeChild(oldContent);
            oldContent.classList.remove("modal__content");
        }
        content.classList.add("modal__content");
        root.appendChild(content);
    };
    const show = () => {
        root.style.display = "block";
        pageMask.style.display = "unset";
    };
    const hide = () => {
        root.style.display = "none";
        pageMask.style.display = "none";
    };
    close.addEventListener("click", hide);
    return { element: root, setTitle, setContent, show, hide };
};
const Input = (text, type = "text", className = "") => {
    const root = document.createElement("div");
    root.classList.add("input", className);
    const label = document.createElement("label");
    label.textContent = text;
    label.classList.add("input__label");
    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.classList.add("input__field", `input__field-${type}`);
    root.append(label, input);
    const value = () => input.value;
    return { element: root, value };
};
const calendarContainer = document.querySelector(".tasks .container");
const calendar = Calendar(new Date(Date.now()));
const taskList = TaskList();
calendarContainer === null || calendarContainer === void 0 ? void 0 : calendarContainer.appendChild(calendar.element);
calendarContainer === null || calendarContainer === void 0 ? void 0 : calendarContainer.appendChild(taskList.element);
const addBtn = document.querySelector(".header__button");
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", (_) => {
    const modal = Modal();
    const form = document.createElement("div");
    const title = Input("Title*", "text", "modal__title");
    const desc = Input("Description", "text", "modal__desc");
    const startDate = Input("Start Date", "date", "modal__start-date");
    const endDate = Input("End date*", "date", "modal__end-date");
    const link = Input("Link", "text", "modal__link");
    const submit = document.createElement("button");
    submit.textContent = "Save!";
    submit.classList.add("modal__submit");
    submit.addEventListener("click", () => {
        const task = {
            id: -1,
            title: title.value(),
            description: desc.value(),
            createdAt: Date.now(),
            startDate: Date.parse(startDate.value()),
            endDate: Date.parse(endDate.value()),
            link: link.value()
        };
        tasks.addTask(task);
        taskList.update();
        calendar.update();
        modal.hide();
    });
    form.append(title.element, desc.element, startDate.element, endDate.element, link.element, submit);
    modal.setTitle("Add an event");
    modal.setContent(form);
    modal.show();
    document.body.appendChild(modal.element);
});
