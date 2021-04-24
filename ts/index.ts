import {
    beautifyDate,
    getDaysOfWeek,
    getEndingOfMonth,
    getSundayAfter,
    isSameDay,
    listDays,
} from "./dateUtils.js";
import * as tasks from "./tasks.js";
import { getMondayBefore, getBeginningOfMonth } from "./dateUtils.js";

type Component = (...args: any) => { element: HTMLElement; [x: string]: any };

const Calendar: Component = (startDate: Date) => {
    const calendar = document.createElement("div");
    calendar.classList.add("calendar");

    const title = document.createElement("h2");
    title.classList.add("calendar__title");
    title.textContent = beautifyDate(getBeginningOfMonth(startDate));

    const headings = document.createElement("ul");
    headings.classList.add("calendar__headings");
    getDaysOfWeek().forEach((day) => {
        const heading = document.createElement("li");
        heading.textContent = day;
        heading.classList.add("calendar__heading", `calendar__${day.toLowerCase()}`);

        headings.appendChild(heading);
    });

    const cells = document.createElement("div");
    cells.classList.add("calendar__cells");

    const firstDayInCalendar = getMondayBefore(getBeginningOfMonth(startDate));
    const lastDayInCalendar = getSundayAfter(getEndingOfMonth(startDate));

    const update = () => {
        cells.innerHTML = "";

        listDays(firstDayInCalendar, lastDayInCalendar).forEach((day) => {
            cells.appendChild(CalendarCell(day).element);
        });
    };
    update();

    calendar.append(title, headings, cells);

    return { element: calendar, update };
};

const CalendarCell: Component = (date: Date) => {
    const cell = document.createElement("div");
    cell.classList.add("calendar__cell");
    cell.setAttribute("tabindex", "1");

    const today = new Date(Date.now());

    if (isSameDay(date, today)) {
        cell.classList.add("calendar__cell--today");
    }

    cell.append(date.getDate().toString());

    const hasDayEvents = tasks.hasTasks(date);
    if (hasDayEvents) {
        const dot = document.createElement("div");
        dot.classList.add("calendar__dot");
        cell.appendChild(dot);
    }

    return { element: cell };
};

const TaskList: Component = () => {
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

const Task: Component = (taskModel: tasks.Task) => {
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

    task.append(
        title,
        Duration(new Date(taskModel.startDate), new Date(taskModel.endDate)).element,
        actions
    );

    return { element: task };
};

const Duration: Component = (startDate: Date, endDate: Date) => {
    const duration = document.createElement("span");

    if (isSameDay(startDate, endDate)) {
        duration.append(`${beautifyDate(startDate)}`);
    } else {
        duration.append(`${beautifyDate(startDate)} - ${beautifyDate(endDate)}`);
    }

    return { element: duration };
};

const Modal: Component = () => {
    const pageMask = document.querySelector("#page-mask") as HTMLDivElement;

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

    const setTitle = (text: string) => {
        title.textContent = text;
    };

    const setContent = (content: HTMLElement) => {
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

const Input: Component = (text: string, type = "text", className = "") => {
    const root = document.createElement("div");
    root.classList.add("input", className);

    const label = document.createElement("label");
    label.textContent = text;
    label.classList.add("input__label");

    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.classList.add("input__field", `input__field-${type}`);

    const problem = document.createElement("p")
    problem.classList.add("input__problem")
    problem.textContent = ""

    const setProblem = (text: string) => {
        problem.textContent = text
    }

    root.append(label, input, problem);

    const value = () => input.value;

    return { element: root, value, setProblem };
};

const calendarContainer = document.querySelector(".tasks .container");
const calendar = Calendar(new Date(Date.now()));
const taskList = TaskList();

calendarContainer?.appendChild(calendar.element);
calendarContainer?.appendChild(taskList.element);

const addBtn = document.querySelector(".header__button");
addBtn?.addEventListener("click", (_) => {
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
        if(title.value() === "" || title.value() == undefined) {
            return title.setProblem("You must provide a title.")
        }
        if(endDate.value() === "" || endDate.value() == undefined) {
            return endDate.setProblem("You must provide an ending date for the event.")
        }

        const task: tasks.Task = {
            id: -1,
            title: title.value(),
            description: desc.value() || "",
            createdAt: Date.now(),
            startDate: Date.parse(startDate.value()) || Date.parse(endDate.value()),
            endDate: Date.parse(endDate.value()),
            link: link.value() || undefined,
        };
        tasks.addTask(task);
        taskList.update();
        calendar.update();
        modal.hide();
    });

    form.append(
        title.element,
        desc.element,
        startDate.element,
        endDate.element,
        link.element,
        submit
    );
    modal.setTitle("Add an event");
    modal.setContent(form);

    modal.show();
    document.body.appendChild(modal.element);
});
