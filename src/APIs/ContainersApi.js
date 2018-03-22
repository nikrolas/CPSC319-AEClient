import {serviceRoot} from "./ServiceRoot";

let containersPath = "/containers";
let containerPath = "/container";
let removeRecordsPath = "/removeRecords";
let userId = "500";

export function getContainersByNumber(containerNumber) {
    return fetch(serviceRoot + containersPath + "?num=" + containerNumber + "&userId=" + userId);
}

export function getContainerById(containerId) {
    return fetch(serviceRoot + containersPath + "/" + containerId + "?userId=" + userId);
}

export function createContainer(data) {
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

export function updateContainer(containerId, data) {
    return fetch(serviceRoot + '/container/' + containerId + '?userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

export function deleteContainers(ids) {
    let path = serviceRoot + containersPath + "?ids=" + ids + "&userId=" + userId;
    return fetch(path, {
        method: 'delete'
    });
}

export function removeRecordsFromContainer(recordIds) {
    // let path = serviceRoot + containerPath + removeRecordsPath + "?userId=" + userId;
    // return fetch(path, {
    //     method: 'post',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(recordIds)
    // });

    return new Promise((resolve, reject) => {
        resolve("Test resolve.");
    });
}