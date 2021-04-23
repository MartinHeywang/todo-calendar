export interface Task {
    title: string
    color: string
    createdAt: number
    startDate: number,
    endDate: number,
    description?: string,
    link?: string
}

const tasks = [
    {
        title: "Homework",
        color: "darkorange",
        createdAt: Date.UTC(2021, 3, 18, 15),
        startDate: Date.UTC(2021, 3, 25, 7),
        endDate: Date.UTC(2021, 3, 27, 11),
        description: "Work for school. See MonBureauNumerique.",
        link: "https://lyc-koeberle.monbureaunumerique.fr",
    },
]

export function getTasks() {
    return tasks
}

export function hasTasks(date: Date) {
    return (
        tasks.filter(({ endDate }) => sameDay(new Date(endDate), date)) ?? []
    ).length !== 0
        ? true
        : false
}

export function sameDay(firstDate: Date, secondDate: Date) {
    return (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    )
}
