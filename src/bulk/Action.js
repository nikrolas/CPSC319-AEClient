import {isAContainerItem, isARecordItem} from "../utilities/Items";
import {deleteContainers, removeRecordsFromContainer} from "../api/ContainersApi";
import {deleteRecordByIds, destroyRecords} from "../api/RecordsApi";

export let removeRecordsFromContainerAction = {
    header: "Remove from container",
    prompt: "The following items will be removed from their container.",
    action: (items, option, userId) => {
        let records = items.filter(item => isARecordItem(item));
        let recordIds = records.map(record => record.id);
        return removeRecordsFromContainer(recordIds, userId)
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result.status !== 200) {
                    throw new Error (result.message);
                }
                return "Successfully removed records from their container."
            })
            .catch(error => {
                throw new Error("Unable to remove one or more records from their container. " + error);
            });
    }
};

function getRecordsAndContainersIds(items) {
    let records = items.filter(item => isARecordItem(item));
    let containers = items.filter(item => isAContainerItem(item));

    let containerIds = [];
    let containedRecordsIds = [];
    containers.forEach(c => {
        containerIds.push(c.id);
        containedRecordsIds = containedRecordsIds.concat(c.childRecordIds)
    });

    let recordIds = records.map(r => r.id);
    recordIds = containedRecordsIds.concat(recordIds);
    recordIds = new Set(recordIds);

    let uniqueRecordIds = Array.from(recordIds);
    return {containerIds, uniqueRecordIds};
}

export let destroyAction = {
    header: "Destroy",
    prompt: "The following items will be destroyed.",
    option: "Delete empty containers",
    action: (items, option, userId) => {
        let {containerIds, uniqueRecordIds} = getRecordsAndContainersIds(items);

        return new Promise((resolve, reject) => {
            if (uniqueRecordIds.length > 0) {
                destroyRecords(uniqueRecordIds, userId)
                    .then(response => {
                        if (response.status !== 200) {
                            reject("Failed to destroy Records.");
                        }
                        else if (option && containerIds.length > 0) {
                            deleteContainers(containerIds, userId)
                                .then(response => {
                                    if (response.status !== 200) {
                                        reject("Failed to delete containers.");
                                    }
                                    resolve("Successfully destroyed the records and deleted empty containers.")
                                })
                                .catch(error => {
                                    reject(error);
                                })
                        } else {
                            resolve("Successfully destroyed the records.")
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else if (option && containerIds.length > 0) {
                deleteContainers(containerIds, userId)
                    .then(response => {
                        if (response.status !== 200) {
                            reject("Failed to delete containers.");
                        }
                        resolve("Successfully destroyed the records and deleted empty containers.")
                    })
                    .catch(error => {
                        reject(error);
                    })
            } else {
                resolve("Successfully destroyed the records.")
            }
        });
    }
};

export let deleteAction = {
    header: "Delete",
    prompt: "The following items will be deleted.",
    action: (items, option, userId) => {
        let {containerIds, uniqueRecordIds} = getRecordsAndContainersIds(items);

        return new Promise((resolve, reject) => {
            if (uniqueRecordIds.length > 0) {
                deleteRecordByIds(uniqueRecordIds, userId)
                    .then(response => {
                        if (response.status !== 200) {
                            reject("Failed to delete records.");
                        }
                        if (containerIds.length > 0) {
                            deleteContainers(containerIds, userId)
                                .then(response => {
                                    if (response.status !== 200) {
                                        reject("Failed to delete containers.");
                                    }
                                    resolve("Successfully deleted the records and containers.")
                                })
                                .catch(error => {
                                    reject(error);
                                })
                        } else {
                            resolve("Successfully deleted the records.")
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else if (containerIds.length > 0) {
                deleteContainers(containerIds, userId)
                    .then(response => {
                        if (response.status !== 200) {
                            reject("Failed to delete containers.");
                        }
                        resolve("Successfully deleted the containers.")
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });
    }
};