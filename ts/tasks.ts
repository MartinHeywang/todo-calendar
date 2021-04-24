import { isSameDay } from "./dateUtils.js";

export interface Task {
    id: number;
    title: string;
    createdAt: number;
    startDate: number;
    endDate: number;
    description?: string;
    link?: string;
}

const tasks: Task[] = [
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

export function hasTasks(date: Date) {
    return tasks.some(({ endDate }) => isSameDay(new Date(endDate), date));
}

export function addTask(task: Task) {
    tasks.push(task);
}
