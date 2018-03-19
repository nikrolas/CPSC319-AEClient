import {serviceRoot} from "./ServiceRoot";

let userId = "500";

export function searchVolumes(number) {
    //TODO waiting for endpoint
    return fetch(serviceRoot + "/volume?num=" + number + "&userId=" + userId);
}

export function createVolume(id, copy) {
    return fetch(serviceRoot + '/volume/' + id + '?copyNotes=' + copy + '&userId=' + userId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
}