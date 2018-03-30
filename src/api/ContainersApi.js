import {serviceRoot} from "./ServiceRoot";
import {updateRecord} from "./RecordsApi";

let containersPath = "/containers";
let containerPath = "/container";

export function getContainerById(containerId, userId) {
    return fetch(serviceRoot + containersPath + "/" + containerId + "?userId=" + userId);
}

export function getContainersByIds(containerIds, userId) {
    return fetch(serviceRoot + containersPath + "?ids=" + containerIds + "?userId=" + userId);
}

export function createContainer(data, userId) {
    let path = serviceRoot + containerPath + "?userId=" + userId;
    return fetch(path, {
        method: 'POST',
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
            locationId: data.location.locationId,
            containerId: data.responseJson.containerId,
            stateId: data.stateId,
            consignmentCode: data.consignmentCode,
            notes: data.notes
        })
    });
}

export function deleteContainers(ids, userId) {
    let path = serviceRoot + containersPath + "?userId=" + userId;
    return fetch(path, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            containerIds: ids
        })
    });
}

export function addRecordToContainer(containerId, record, userId) {
    let state = record;
    state.containerId = containerId;
    state.user = {id: userId};
    return updateRecord(record.id, state);
}
