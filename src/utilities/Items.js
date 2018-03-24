export function isARecordItem(obj) {
    return obj && obj.hasOwnProperty('number');
}

export function isAContainerItem(obj) {
    return obj && !obj.hasOwnProperty('number') && obj.hasOwnProperty('containerNumber');
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

export function getSelectedItemsCategorized(data, selection) {
    let selectedItems = {
        records: [],
        containers: [],
        unknown: []
    };
    selection.forEach((index) => {
        if (isARecordItem(data[index])) {
            selectedItems.records.push(data[index]);
        }
        else if (isAContainerItem(data[index])) {
            selectedItems.containers.push(data[index]);
        }
        else {
            selectedItems.unknown.push(data[index]);
        }
    });
    return selectedItems;
}
