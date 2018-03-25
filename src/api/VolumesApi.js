import {serviceRoot} from "./ServiceRoot";

export function getVolumesByNumber(number, userId) {
    return fetch(serviceRoot + "/volume?num=" + number + "&userId=" + userId);
}

export function createVolume(id, copy, userId) {
    return fetch(serviceRoot + '/volume/' + id + '?copyNotes=' + copy + '&userId=' + userId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
}