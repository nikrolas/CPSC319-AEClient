export function getDateTimeString(date) {
    let result = "";
    if (typeof date.toDateString === 'function' && typeof date.toTimeString === 'function') {
        result = date.toDateString() + " " + date.toTimeString();
    }
    return result;
}

export function getDateString(date) {
    let result = "";
    if (typeof date.toDateString === 'function') {
        result = date.toDateString();
    }
    return result;
}

export function  transformDates(data, transformer) {
    let keys = Object.keys(data);
    keys.forEach(key => {
        if (key.endsWith("At")) {
            data[key] = transformer(new Date(data[key]));
        }
    });
    return data;
}
