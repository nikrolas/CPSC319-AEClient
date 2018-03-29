import {isAContainerItem, isARecordItem} from "../utilities/Items";
import {deleteContainers, getContainerById} from "../api/ContainersApi";
import {deleteRecordByIds, destroyRecords} from "../api/RecordsApi";

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

function destroySelectedRecords(uniqueRecordIds, userId) {
    return new Promise((resolve, reject) => {
        let success = false;
        destroyRecords(uniqueRecordIds, userId)
            .then(response => {
                if (response.ok) {
                    success = true;
                    resolve("Successfully destroyed the records.");
                } else {
                    return response.json();
                }
            })
            .then(result => {
                if (!success) {
                    reject(result.error + " Items: " + result.number);
                }
            })
            .catch(error => {
                console.error(error);
                reject("An unexpected error occurred. Please try again later.");
            });
    });
}

function deleteSelectedContainers(containerIds, userId) {
    return new Promise((resolve, reject) => {
        let success = false;
        deleteContainers(containerIds, userId)
            .then(response => {
                if (response.ok) {
                    success = true;
                    resolve("Successfully deleted the containers.")
                } else {
                    return response.json();
                }
            })
            .then(result => {
                if (!success) {
                    reject(result.error + " Items: " + result.number);
                }
            })
            .catch(error => {
                console.error(error);
                reject("An unexpected error occurred. Please try again later.");
            });
    });
}

function deleteContainersOfSelectedRecords(items, containerIds, uniqueRecordIds, userId) {
    let records = items.filter(item => isARecordItem(item));
    let containerIdsOfSelectedRecords = [];

    records.forEach(record => {
        if (record.containerId) {
            containerIdsOfSelectedRecords.push(record.containerId);
        }
    });

    containerIdsOfSelectedRecords = new Set(containerIdsOfSelectedRecords);

    let uniqueContainerIdsOfSelectedRecords = Array.from(containerIdsOfSelectedRecords);
    return {containerIds, uniqueRecordIds};

    return new Promise((resolve, reject) => {

        let promises = [];
        uniqueContainerIdsOfSelectedRecords.forEach(containerId => {
            promises.push(
                getContainerById(containerId, userId)
                    .then(response => {
                        return response.json();
                    })
            );
        });

        Promise.all(promises)
            .then(results => {
                let emptyContainers = results.filter(container => {
                    return container.childIds && container.childIds === 0;
                });
                let emptyContainerIds = emptyContainers.map(c => c.containerId);
                deleteSelectedContainers(emptyContainerIds, userId)
                    .then(response => {
                        response.json();
                    })
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    })

            })
            .catch(error => {
                console.error(error);
                reject("Unable to check the status of one or more containers. Some empty containers may not be deleted.")
            })
    });
}

export let destroyAction = {
    header: "Destroy",
    prompt: "The following items will be destroyed.",
    option: "Delete empty containers",
    action: (items, option, userId) => {
        let {containerIds, uniqueRecordIds} = getRecordsAndContainersIds(items);

        return new Promise((resolve, reject) => {
            let success = false;
            if (uniqueRecordIds && uniqueRecordIds.length > 0) {
                destroySelectedRecords(uniqueRecordIds, userId)
                    .then((destroyMsg) => {
                        if (containerIds && containerIds.length > 0 && option) {
                            let promises = [
                                deleteSelectedContainers(containerIds, userId),
                                deleteContainersOfSelectedRecords(items, containerIds, uniqueRecordIds, userId)
                            ];
                            Promise.all(promises)
                                .then((deleteMsg) => {
                                    success = true;
                                    resolve(destroyMsg + deleteMsg);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            success = true;
                            resolve(destroyMsg);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else if (containerIds && containerIds.length > 0 && option) {
                deleteSelectedContainers(containerIds, userId)
                    .then((successMsg) => {
                        success = true;
                        resolve(successMsg);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else if (containerIds.length === 0 && uniqueRecordIds.length === 0) {
                reject("No items were selected.");
            } else {
                console.error("Unknown bulk action state.");
                reject("An unexpected error occurred. Please try again later.");
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