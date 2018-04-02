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
            let appendItems = "";
            if (msgNumMap[msg] && msgNumMap[msg].length > 0) {
                appendItems = " Items: " + msgNumMap[msg].join(", ");
            }
            errorMsg = errorMsg + msg + appendItems + "\n";
        });
    } else {
        errorMsg = "No errors found.";
    }
    return errorMsg;
}

export function isOk(response) {
    let errors = 0;

    response.responseList.forEach(response => {
        if (!response.status) {
            errors++;
        }
    });
    return errors === 0;
}
