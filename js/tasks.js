"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameDay = exports.hasTasks = exports.getTasks = void 0;
var tasks = [
    {
        title: "Homework",
        color: "darkorange",
        createdAt: Date.UTC(2021, 3, 18, 15),
        startDate: Date.UTC(2021, 3, 25, 7),
        endDate: Date.UTC(2021, 3, 27, 11),
        description: "Work for school. See MonBureauNumerique.",
        link: "https://lyc-koeberle.monbureaunumerique.fr",
    },
];
function getTasks() {
    return tasks;
}
exports.getTasks = getTasks;
function hasTasks(date) {
    var _a;
    return ((_a = tasks.filter(function (_a) {
        var endDate = _a.endDate;
        return sameDay(new Date(endDate), date);
    })) !== null && _a !== void 0 ? _a : []).length !== 0
        ? true
        : false;
}
exports.hasTasks = hasTasks;
function sameDay(firstDate, secondDate) {
    return (firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate());
}
exports.sameDay = sameDay;
