import { isSameDay } from "./dateUtils.js";
const tasks = [
    {
        title: "Homework",
        createdAt: Date.UTC(2021, 3, 18, 15),
        startDate: Date.UTC(2021, 3, 25, 7),
        endDate: Date.UTC(2021, 3, 27, 11),
    },
];
export function getTasks() {
    return tasks;
}
export function hasTasks(date) {
    return tasks.some(({ endDate }) => isSameDay(new Date(endDate), date));
}
export function getID(task) {
    return tasks.indexOf(task);
}
export function addTask(task) {
    tasks.push(task);
}
export function updateTask(oldTask, newTask) {
    deleteTask(getID(oldTask));
    addTask(newTask);
}
export function deleteTask(id) {
    tasks.splice(id, 1);
}
