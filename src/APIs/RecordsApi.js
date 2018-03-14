import {serviceRoot} from "./ServiceRoot";

let recordsPath = "/records";
let userId = "500";
export function getRecordsByNumber(recordNumber) {
    return fetch(serviceRoot + recordsPath + "?num=" + recordNumber + "&userId=" + userId);
}

export function getRecordById(recordId) {
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
    return fetch(serviceRoot + "users/"+userId);
}

export function deleteRecordById(recordId) {
    return fetch(serviceRoot + '/record/' + recordId+ '?userId=' + userId, {
        method: 'DELETE',
    })
}

export function createRecord(state) {
    let classpath = "";
    if(state.classificationParentHistory.length >= 1) {
        for(let i = 1; state.classificationParentHistory.length > i; i++) {
            if(i===1) {
                classpath += state.classificationParentHistory[i];

            }
            else {
                classpath += "/" + state.classificationParentHistory[i];
            }
        }
    }
    return fetch(serviceRoot + '/record?userId=' + userId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            title: state.title,
            number: state.recordNumber,
            scheduleId: state.retentionSchedule[0].id,
            typeId:state.recordType,
            consignmentCode: state.consignmentCode,
            containerId: state.container,
            locationId: "5",
            classifications: classpath,
            notes: state.notes,
        })
    })
}

export function updateRecord(recordId,state) {
    return fetch(serviceRoot + '/records/' + recordId + '?userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            title: state.responseJson["title"],
            scheduleId: 10,
            classifications : "PROJECT MANAGEMENT/Budgets and Schedules",
            consignmentCode: state.responseJson["consignmentCode"],
            notes: state.responseJson["notes"],
            stateId : 1,
            containerId : state.responseJson["containerId"]
        })
    })
}




