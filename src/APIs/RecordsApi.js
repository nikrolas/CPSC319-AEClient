import {serviceRoot} from "./ServiceRoot";

let recordsPath = "/records";

export function getRecordsByNumber(recordNumber, userId) {
    return fetch(serviceRoot + recordsPath + "?num=" + recordNumber + "&userId=" + userId);
}

export function getRecordById(recordId, userId) {
    return fetch(serviceRoot + recordsPath + "/" + recordId + "?userId=" + userId);
}





