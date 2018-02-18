
let serviceRoot = "http://ec2-18-220-64-10.us-east-2.compute.amazonaws.com:8080/DiscoveryChannel-1.0-SNAPSHOT";

export function getUserParam(path) {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const userId = params.get('userId');
    //TODO: Route needs to be established by backend first atm
    return fetch(serviceRoot + path + "/" + recordId + "?userId=" + userId);

}