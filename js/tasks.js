import { isSameDay } from "./dateUtils.js";
const tasks = [
    {
        id: 1,
        title: "Homework",
        createdAt: Date.UTC(2021, 3, 18, 15),
        startDate: Date.UTC(2021, 3, 25, 7),
        endDate: Date.UTC(2021, 3, 27, 11),
        description: "Work for school. See MonBureauNumerique.",
        link: "https://lyc-koeberle.monbureaunumerique.fr",
    },
];
export function getTasks() {
    return tasks;
}
export function hasTasks(date) {
    return tasks.some(({ endDate }) => isSameDay(new Date(endDate), date));
}
export function addTask(task) {
    tasks.push(task);
}
