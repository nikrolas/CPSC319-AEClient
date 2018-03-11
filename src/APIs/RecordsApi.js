import {serviceRoot} from "./ServiceRoot";

let recordsPath = "/records";
let userId = "500";
export function getRecordsByNumber(recordNumber) {
    return fetch(serviceRoot + recordsPath + "?num=" + recordNumber + "&userId=" + userId);
}

export function getRecordById(recordId) {
    return fetch(serviceRoot + recordsPath + "/" + recordId + "?userId=" + userId);
}

export function deleteRecordById(recordId) {
    return fetch(serviceRoot + '/record/' + recordId+ '?userId=' + userId, {
        method: 'DELETE',
    })
}

export function createRecord(state) {
    return fetch(serviceRoot + '/record?userId=' + userId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            title: state.title,
            number: state.recordNumber,
            scheduleId: "10",
            typeId:"3",
            consignmentCode: state.consignmentCode,
            containerId: state.container,
            locationId: "5",
            classifications: "PROJECT MANAGEMENT/Budgets and Schedules",
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

export function createVolume(state) {
    return fetch(serviceRoot + '/volume/' + state.id + '?userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            number: state.number,
            copyNotes: state.copy,
        })
    })
}



