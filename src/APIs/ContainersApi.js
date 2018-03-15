import {serviceRoot} from "./ServiceRoot";

let containersPath = "/containers";
let userId = "500";

export function getContainersByNumber(containerNumber) {
    return fetch(serviceRoot + containersPath + "?num=" + containerNumber + "&userId=" + userId);
}

export function getContainerById(containerId) {
    return fetch(serviceRoot + containersPath + "/" + containerId + "?userId=" + userId);
}

export function createContainer(data) {
    let path = serviceRoot + containersPath + "?userId=" + userId;
    return fetch(path, {
        method: 'post',
        body: JSON.stringify(data)
    });
}

export function deleteContainers(ids) {
    let path = serviceRoot + containersPath + "?ids=" + ids + "&userId=" + userId;
    return fetch(path, {
        method: 'delete'
    });
}
