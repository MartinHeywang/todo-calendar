type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
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
const millisInDay = 24 * 60 * 60 * 1000;

export function isSameDay(firstDate: Date, secondDate: Date) {
    return (
        getBeginningOfDay(firstDate).getTime() === getBeginningOfDay(secondDate).getTime()
    );
}

export function beautifyDate(date: Date): string {
    let result = "";

    const dayOfMonth = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (dayOfMonth > 1) result += `${dayOfMonth} `;
    result += `${months[month as MonthIndex]} `;
    result += `${year}`;

    return result;
}

export function getBeginningOfMonth(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(Date.UTC(year, month));
}

export function getEndingOfMonth(date: Date) {
    const newDate = getBeginningOfMonth(date);
    newDate.setMonth(newDate.getMonth() + 1);
    newDate.setTime(newDate.getTime() - millisInDay); // remove one day
    return newDate;
}

export function getBeginningOfDay(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function getMondayBefore(date: Date) {
    const dayOfWeek = date.getDay();
    const time = date.getTime();

    return new Date(time - (dayOfWeek - 1) * millisInDay);
}

export function getSundayAfter(date: Date) {
    const dayOfWeek = date.getDay();
    const time = date.getTime();

    return new Date(time + (7 - dayOfWeek) * millisInDay);
}

export function listDays(startDate: Date, endDate: Date) {
    const days = [];

    const startMillis = getBeginningOfDay(startDate).getTime();
    const endMillis = getBeginningOfDay(endDate).getTime();

    for (let millis = startMillis; millis <= endMillis; millis += millisInDay) {
        days.push(new Date(millis));
    }

    return days;
}

export function getDaysOfWeek() {
    return Object.freeze(days);
}

export function getMonthsOfYear() {
    return Object.freeze(months);
}

export function toISO(date: Date | number) {
    if (typeof date === "number") {
        date = new Date(date);
    }

    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}
