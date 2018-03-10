import {serviceRoot} from "./ServiceRoot";

let containersPath = "/containers";
let userId = "500";

export function getContainerById(containerId) {
    return fetch(serviceRoot + containersPath + "/" + containerId + "?userId=" + userId);
}

export function createContainer(data, userId) {
    let path = serviceRoot + containersPath + "?userId=" + userId;
    return  fetch(path, {
            method: 'post',
            body: JSON.stringify(data)
        });
}
