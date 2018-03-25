import {serviceRoot} from "./ServiceRoot";

let recordsPath = "/records";

export function getRecordsByNumber(recordNumber, userId) {
    return fetch(serviceRoot + recordsPath + "?num=" + recordNumber + "&userId=" + userId);
}

export function getRecordById(recordId, userId) {
    return fetch(serviceRoot + recordsPath + "/" + recordId + "?userId=" + userId);
}

export function getRecordType() {
    return fetch(serviceRoot + "/recordtypes");
}

export function getRetentionSchedule() {
    return fetch(serviceRoot + "/retentionschedules");
}

export function getClassifications(parentId = "") {
    if (parentId.length !== 0) {
        return fetch(serviceRoot + "/classifications?parentId=" + parentId);
    }
    else {
        return fetch(serviceRoot + "/classifications");
    }
}

export function getUser(userId) {
    return fetch(serviceRoot + "/users/" + userId);
}

export function getRecordStates() {
    return fetch(serviceRoot + "/recordstates/");
}

export function deleteRecordByIds(recordIds, userId) {
    return fetch(serviceRoot + recordsPath + '?userId=' + userId, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recordIds: recordIds
        })
    });
}

export function createRecord(state) {
    return fetch(serviceRoot + '/record?userId=' + state.user.id, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: state.title,
            number: state.recordNumber,
            scheduleId: state.retentionSchedule[0].id,
            typeId: state.recordType,
            consignmentCode: state.consignmentCode,
            containerId: state.container,
            locationId: state.location,
            classIds: state.classificationBack,
            notes: state.notes,
        })
    });
}

export function updateRecord(recordId, state) {
    return fetch(serviceRoot + '/records/' + recordId + '?userId=' + state.user.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: state.title,
            scheduleId: state.retentionSchedule,
            //TODO temporary state b/c end point not complete
            classifications: state.responseJson.classifications,
            consignmentCode: state.consignmentCode,
            notes: state.notes,
            stateId: state.stateId,
            containerId: state.container
        })
    });
}


export function destroyRecords(recordIds, userId) {
    return fetch(serviceRoot + '/destroyrecords?userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recordIds: recordIds
        })
    });
}
