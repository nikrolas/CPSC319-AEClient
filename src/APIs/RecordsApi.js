//THIS IS FOR LOCAL
let serviceRoot = "http://localhost:8080";
//THIS IS FOR PRODUCTION
//let serviceRoot = "http://ec2-18-220-64-10.us-east-2.compute.amazonaws.com:8080/DiscoveryChannel-1.0-SNAPSHOT";

let recordsPath = "/records";

export function getRecordsByNumber(recordNumber, userId) {
    return fetch(serviceRoot + recordsPath + "?num=" + recordNumber + "&userId=" + userId);
}

export function getRecordById(recordId, userId) {
    return fetch(serviceRoot + recordsPath + "/" + recordId + "?userId=" + userId);
}





