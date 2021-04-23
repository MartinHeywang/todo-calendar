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
    var _a;
    return ((_a = tasks.filter(({ endDate }) => sameDay(new Date(endDate), date))) !== null && _a !== void 0 ? _a : []).length !== 0
        ? true
        : false;
}
export function addTask(task) {
    tasks.push(task);
}
export function sameDay(firstDate, secondDate) {
    return (firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate());
}
