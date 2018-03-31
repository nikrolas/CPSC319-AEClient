import {serviceRoot} from "./ServiceRoot";
import {updateRecord} from "./RecordsApi";

let containersPath = "/containers";
let containerPath = "/container";

export function getContainerById(containerId, userId) {
    return fetch(serviceRoot + containersPath + "/" + containerId + "?userId=" + userId);
}

export function getContainersByIds(ids, userId) {
    return fetch(serviceRoot + containersPath + "?ids=" + ids + "&userId=" + userId);
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
    return fetch(serviceRoot + containerPath + "/" + containerId + '?userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            containerNumber: data.responseJson.containerNumber,
            title: data.title,
            location: data.location,
            containerId: data.responseJson.containerId,
            stateId: data.stateId,
            consignmentCode: data.consignmentCode,
            notes: data.notes
        })
    });
}

export function deleteContainers(ids, userId) {
    let path = serviceRoot + containersPath + "?ids=" + ids + "&userId=" + userId;
    return fetch(path, {
        method: 'delete'
    });
}

export function addRecordToContainer(containerId, record, userId) {
    let state = record;
    state.containerId = containerId;
    state.user = {id: userId};
    return updateRecord(record.id, state);
}
