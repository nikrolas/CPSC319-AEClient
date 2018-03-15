
import {serviceRoot} from "./ServiceRoot";

export function getUser() {
    const search = window.location.search.substr(1);
    const params = new URLSearchParams(search);
    const userId = params.get('userId');
    //TODO: Route needs to be established by backend first atm
    return fetch(serviceRoot + "/users/"+userId);

}