import {serviceRoot} from "./ServiceRoot";

let containersPath = "/containers";
let containerPath = "/container";
let removeRecordsPath = "/removeRecords";

export function getContainersByNumber(containerNumber, userId) {
    return fetch(serviceRoot + containersPath + "?num=" + containerNumber + "&userId=" + userId);
}

export function getContainerById(containerId, userId) {
    return fetch(serviceRoot + containersPath + "/" + containerId + "?userId=" + userId);
}

export function createContainer(data, userId) {
    let path = serviceRoot + containerPath + "?userId=" + userId;
    return fetch(path, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

export function updateContainer(containerId, data, userId) {
    return fetch(serviceRoot + containerPath + containerId + '?userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

export function deleteContainers(ids, userId) {
    let path = serviceRoot + containersPath + "?ids=" + ids + "&userId=" + userId;
    return fetch(path, {
        method: 'delete'
    });
}

export function removeRecordsFromContainer(recordIds, userId) {
    let path = serviceRoot + containerPath + removeRecordsPath + "?userId=" + userId;
    return fetch(path, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordIds)
    });
}

export function addRecordsToContainer(containerId, data, userId) {
    let path = serviceRoot + containerPath + containerId + "?userId=" + userId;
    return fetch(path, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}
