import {serviceRoot} from "./ServiceRoot";

let searchPath = "/search";

export function searchByNumber(num, options, page, pageSize, userId) {
    return fetch(serviceRoot + searchPath
        + "?num=" + num
        + "&record=" + options.record
        + "&container=" + options.container
        + "&page=" + page
        + "&pageSize=" + pageSize
        + "&userId=" + userId);
}
