import { isSameDay } from "./dateUtils.js";

export interface Task {
    title: string;
    createdAt: number;
    startDate: number;
    endDate: number;
    description?: string;
    link?: string;
}

const tasks: Task[] = [
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

export function hasTasks(date: Date) {
    return tasks.some(({ endDate }) => isSameDay(new Date(endDate), date));
}

export function getID(task: Task) {
    return tasks.indexOf(task)
}

export function addTask(task: Task): void {
    tasks.push(task);
}

export function updateTask(oldTask: Task, newTask: Task) {
    deleteTask(getID(oldTask))
    addTask(newTask)
}

export function deleteTask(id: number): void {
    tasks.splice(id, 1)
} 