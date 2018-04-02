import {serviceRoot} from "./ServiceRoot";
import {updateRecord} from "./RecordsApi";
import {parseResponses} from "../utilities/Responses";

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
            containerNumber: data.containerNumber,
            title: data.title,
            locationId: data.locationId,
            stateId: data.stateId,
            consignmentCode: data.consignmentCode,
            notes: data.notes,
            records: data.records
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

export function getMostRecentClosedAt(containerId, userId) {
    return fetch(serviceRoot + containerPath + "/" + containerId + '/closedAt?userId=' + userId);
}


export function addRecordsToContainer(containerId, records, userId) {

    return new Promise((resolve, reject) => {
        let promises = [];

        records.forEach(record => {
            let state = record;
            state.containerId = containerId;
            state.user = {id: userId};
            state.retentionSchedule = record.scheduleId;
            state.classificationBack = record.classIds;
            promises.push(updateRecord(record.id, state));
        });

        Promise.all(promises)
            .then(responses => {
                let errResponses = [];
                let errRecords = [];
                responses.forEach((response, index) => {
                    if (!response.ok) {
                        errResponses.push(response);
                        errRecords.push(records[index]);
                    }
                });

                if (errResponses.length > 0) {
                    let responsePromises = [];
                    errResponses.forEach(errResponse => {
                        responsePromises.push(errResponse.json());
                    });

                    Promise.all(responsePromises)
                        .then(responses => {
                            reject(parseResponses(responses, errRecords, "number"));
                        })
                        .catch(err => {
                            reject("An unexpected error occured while parsing the error responses. " + err);
                        });
                } else {
                    resolve(responses);
                }
            })
            .catch(error => {
                console.error(error);
                reject("An unexpected error occured while adding records to the container: " + error);
            })

    });
}
