export function dateFormat(date: string | Date): string {
    if (date instanceof Date) {
        return date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2));
    }
    return date;
}

export function dateTimeFormat(date: string | Date): string {
    if (date instanceof Date) {
        return date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2)) + ' ' + (('0' + date.getHours()).slice(-2)) + ':' + (('0' + date.getMinutes()).slice(-2)) + ':' + (('0' + date.getSeconds()).slice(-2));
    }
    return date;
}

export function compareDate<T extends Date | string>(dateStart: T, dateEnd: T): Boolean {

    if (dateStart instanceof String && dateEnd instanceof String) {
        return dateStart === dateEnd;
    }

    if (dateStart instanceof Date && dateEnd instanceof Date) {
        return dateStart.getTime() === dateEnd.getTime()
    }

    return true;
}