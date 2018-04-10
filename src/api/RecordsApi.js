import {serviceRoot} from "./ServiceRoot";

let recordsPath = "/records";

export function getRecordById(recordId, userId) {
    return fetch(serviceRoot + recordsPath + "/" + recordId + "?userId=" + userId);
}

export function getRecordsByIds(ids, userId) {
    return fetch(serviceRoot + recordsPath + "?ids=" + ids + "&userId=" + userId);
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
            locationId: state.location,
            classIds: state.classificationBack,
            notes: state.notes,
        })
    });
}

// addRecordsToContainer API assumes this body structure
// Take caution when changing the body
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
            classifications: state.classificationBack,
            consignmentCode: state.consignmentCode,
            notes: state.notes,
            stateId: state.stateId,
            containerId: state.containerId
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

export function getDestructionDate(recordIds, userId) {
    return fetch(serviceRoot + '/destructiondate?userId=' + userId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recordIds: recordIds
        })
    });
}