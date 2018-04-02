export function parseResponseList(response) {
    let errorMsg = "";
    let msgNumMap = {};
    response.responseList.forEach(error => {
        if (msgNumMap[error.msg]) {
            msgNumMap[error.msg].push(error.number);
        } else {
            msgNumMap[error.msg] = [error.number];
        }
    });

    let uniqueMsgs = Object.keys(msgNumMap);
    if (uniqueMsgs.length > 0) {
        uniqueMsgs.forEach(msg => {
            errorMsg = errorMsg + msg + " Items: " + msgNumMap[msg].join(", ") + "\n";
        });
    } else {
        errorMsg = "No errors found.";
    }
    return errorMsg;
}
