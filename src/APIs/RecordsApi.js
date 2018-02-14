let serviceRoot = "http://ec2-18-220-64-10.us-east-2.compute.amazonaws.com:8080/DiscoveryChannel-1.0-SNAPSHOT";

let recordsPath = "/records";

let mode = {"mode": "no-cors"};

export function getRecordsByNumber(recordNumber, userId) {
    return fetch(serviceRoot + recordsPath + "?num=" + recordNumber + "&userId=" + userId, mode);
}

export function getRecordById(recordId, userId) {
    return fetch(serviceRoot + recordsPath + "/" + recordId + "?userId=" + userId, mode);
}





