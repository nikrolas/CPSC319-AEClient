import {serviceRoot} from "./ServiceRoot";

let containersPath = "/containers";

export function createContainer(data, userId) {
    let path = serviceRoot + containersPath + "?userId=" + userId;
    return  fetch(path, {
            method: 'post',
            body: JSON.stringify(data)
        });
}
