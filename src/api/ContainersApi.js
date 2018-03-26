import {serviceRoot} from "./ServiceRoot";
import {updateRecord} from "./RecordsApi";

let containersPath = "/containers";
let containerPath = "/container";

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

export function addRecordsToContainer(containerId, records, userId) {
    let promises = [];
    records.forEach(record => {
        let state = record;
        state.containerId = containerId;
        state.user = {id: userId};
        promises.push(
            updateRecord(record.id, state)
                .then(response => {
                    return response.json();
                }));
    });

    return Promise.all(promises);
}
