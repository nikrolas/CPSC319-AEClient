export function getIdFromLocation (location) {
    let index = location.pathname.lastIndexOf("/");
    return location.pathname.substr(index + 1);
}