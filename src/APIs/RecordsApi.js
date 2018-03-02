//THIS IS FOR LOCAL
let serviceRoot = "http://localhost:8080";
//THIS IS FOR PRODUCTION
//let serviceRoot = "http://ec2-18-220-64-10.us-east-2.compute.amazonaws.com:8080/DiscoveryChannel-1.0-SNAPSHOT";

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
            consignmentCode: "RF011329724",
            containerId: "166132",
            locationId: "5",
            classifications: "PROJECT MANAGEMENT/Budgets and Schedules",
            notes: "11",
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
            consignmentCode: "RF011329724",
            notes: "11",
            stateId : 1,
            containerId : 24372
        })
    })
}




