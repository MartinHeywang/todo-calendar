import { beautifyDate, getDaysOfWeek, getEndingOfMonth, getSundayAfter, isSameDay, listDays, toISO, } from "./dateUtils.js";
import { getMondayBefore, getBeginningOfMonth } from "./dateUtils.js";
import { addTask, deleteTask, getID, getTasks, hasTasks, updateTask, } from "./tasks.js";
const Calendar = ({ startDate }) => {
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
            cells.appendChild(CalendarCell({ date: day }).element);
        });
    };
    update();
    calendar.append(title, headings, cells);
    return { element: calendar, update };
};
const CalendarCell = ({ date }) => {
    const cell = document.createElement("div");
    cell.classList.add("calendar__cell");
    cell.setAttribute("tabindex", "1");
    const today = new Date(Date.now());
    if (isSameDay(date, today)) {
        cell.classList.add("calendar__cell--today");
    }
    cell.append(date.getDate().toString());
    const hasDayEvents = hasTasks(date);
    if (hasDayEvents) {
        const dot = document.createElement("div");
        dot.classList.add("calendar__dot");
        cell.appendChild(dot);
    }
    return { element: cell };
};
const TaskList = ({}) => {
    const taskList = document.createElement("div");
    taskList.classList.add("task-list");
    const update = () => {
        const taskModels = getTasks();
        taskList.innerHTML = "";
        taskModels.forEach((taskModel) => {
            taskList.appendChild(TaskCard({ taskModel }).element);
        });
        if (taskList.children.length === 0) {
            taskList.append("You don't have any event !");
        }
    };
    update();
    return { element: taskList, update };
};
const TaskCard = ({ taskModel }) => {
    const task = document.createElement("div");
    task.classList.add("task");
    const title = document.createElement("h3");
    title.textContent = taskModel.title;
    task.append(title);
    if (taskModel.description) {
        const desc = document.createElement("p");
        desc.textContent = taskModel.description;
        task.append(desc);
    }
    const actions = document.createElement("ul");
    actions.classList.add("task__actions");
    const actionsDesc = [
        {
            name: "Edit",
            onClick: () => {
                const modal = Modal({});
                modal.setTitle("Edit an event");
                const modalContent = document.createElement("div");
                console.log(taskModel);
                const form = TaskForm({
                    defaultTitle: taskModel.title,
                    defaultDesc: taskModel.description,
                    defaultStartDate: toISO(taskModel.startDate),
                    defaultEndDate: toISO(taskModel.endDate),
                    defaultLink: taskModel.link,
                });
                modalContent.appendChild(form.element);
                const submit = document.createElement("button");
                submit.classList.add("modal__submit");
                submit.textContent = "Save!";
                modalContent.appendChild(submit);
                submit.addEventListener("click", () => {
                    const newTaskModel = Object.assign(Object.assign({}, taskModel), form.getValues());
                    updateTask(taskModel, newTaskModel);
                    taskModel = newTaskModel;
                    calendar.update();
                    taskList.update();
                    modal.hide();
                });
                modal.setContent(modalContent);
                modal.show();
            },
        },
        {
            name: "Delete",
            onClick: () => {
                deleteTask(getID(taskModel));
                calendar.update();
                taskList.update();
            },
        },
    ];
    if (taskModel.link != undefined) {
        actionsDesc.unshift({
            name: "Open Link",
            onClick: () => (window.location.href = taskModel.link),
        });
    }
    actionsDesc.forEach((actionDesc) => {
        const action = document.createElement("li");
        action.textContent = actionDesc.name;
        action.addEventListener("click", actionDesc.onClick);
        action.classList.add("task__action");
        actions.appendChild(action);
    });
    task.appendChild(Duration({
        startDate: new Date(taskModel.startDate),
        endDate: new Date(taskModel.endDate),
    }).element);
    task.appendChild(actions);
    return { element: task };
};
const Duration = ({ startDate, endDate }) => {
    const duration = document.createElement("span");
    if (isSameDay(startDate, endDate)) {
        duration.append(`${beautifyDate(startDate)}`);
    }
    else {
        duration.append(`${beautifyDate(startDate)} - ${beautifyDate(endDate)}`);
    }
    return { element: duration };
};
const Modal = ({}) => {
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
        document.body.appendChild(root);
        root.style.display = "block";
        pageMask.style.display = "unset";
    };
    const hide = () => {
        document.body.removeChild(root);
        root.style.display = "none";
        pageMask.style.display = "none";
    };
    close.addEventListener("click", hide);
    return { element: root, setTitle, setContent, show, hide };
};
const Input = ({ text = "text", type, defaultValue, }) => {
    const root = document.createElement("div");
    root.classList.add("input");
    const label = document.createElement("label");
    label.textContent = text;
    label.classList.add("input__label");
    const input = document.createElement("input");
    input.setAttribute("type", type || "text");
    input.value = defaultValue || "";
    input.classList.add("input__field", `input__field-${type || "text"}`);
    const problem = document.createElement("p");
    problem.classList.add("input__problem");
    problem.textContent = "";
    const setProblem = (text) => {
        problem.textContent = text;
    };
    root.append(label, input, problem);
    const value = () => input.value;
    return { element: root, value, setProblem };
};
const TaskForm = ({ defaultTitle = "", defaultDesc = "", defaultStartDate = "1970-01-01", defaultEndDate = "1970-01-01", defaultLink = "", }) => {
    const form = document.createElement("div");
    const title = Input({ text: "Title*", type: "text", defaultValue: defaultTitle });
    const desc = Input({ text: "Description", type: "text", defaultValue: defaultDesc });
    const startDate = Input({
        text: "Start Date",
        type: "date",
        defaultValue: defaultStartDate,
    });
    const endDate = Input({
        text: "End date*",
        type: "date",
        defaultValue: defaultEndDate,
    });
    const link = Input({ text: "Link", type: "text", defaultValue: defaultLink });
    form.append(title.element, desc.element, startDate.element, endDate.element, link.element);
    const getValues = () => {
        return {
            title: title.value(),
            description: desc.value(),
            startDate: Date.parse(startDate.value()),
            endDate: Date.parse(endDate.value()),
            link: link.value(),
        };
    };
    return {
        element: form,
        getValues,
        titleInput: title,
        descInput: desc,
        startDateInput: startDate,
        endDateInput: endDate,
        linkInput: link,
    };
};
const calendarContainer = document.querySelector(".tasks .container");
const calendar = Calendar({ startDate: new Date(Date.now()) });
const taskList = TaskList({});
calendarContainer === null || calendarContainer === void 0 ? void 0 : calendarContainer.appendChild(calendar.element);
calendarContainer === null || calendarContainer === void 0 ? void 0 : calendarContainer.appendChild(taskList.element);
const addBtn = document.querySelector(".header__button");
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", (_) => {
    const modal = Modal({});
    const modalContent = document.createElement("div");
    const form = TaskForm({});
    modalContent.appendChild(form.element);
    const submit = document.createElement("button");
    submit.textContent = "Save!";
    submit.classList.add("modal__submit");
    modalContent.appendChild(submit);
    submit.addEventListener("click", () => {
        const values = form.getValues();
        if (!values.title) {
            return form.titleInput.setProblem("You must provide a title.");
        }
        if (!values.endDate) {
            return form.endDateInput.setProblem("You must provide an ending date for the event.");
        }
        const task = Object.assign(Object.assign({}, values), { createdAt: Date.now() });
        addTask(task);
        taskList.update();
        calendar.update();
        modal.hide();
    });
    modal.setTitle("Add an event");
    modal.setContent(modalContent);
    modal.show();
});
