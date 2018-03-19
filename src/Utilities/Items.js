export function isARecordItem(obj) {
    return obj.hasOwnProperty('number');
}

export function isAContainerItem(obj) {
    return !obj.hasOwnProperty('number') && obj.hasOwnProperty('containerNumber');
}

export function getSelectedRecords(records, selection) {
    let selectedRecords = [];
    selection.forEach((index) => {
        if (isARecordItem(records[index]))
            selectedRecords.push(records[index]);
    });
    return selectedRecords;
}

export function getSelectedContainers(containers, selection) {
    let selectedContainers = [];
    selection.forEach((index) => {
        if (isAContainerItem(containers[index]))
            selectedContainers.push(containers[index]);
    });
    return selectedContainers;
}

export function getSelectedItems(data, selection) {
    return selection.map((index) => data[index]);
}
