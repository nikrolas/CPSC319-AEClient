import {isAContainerItem, isARecordItem} from "../utilities/Items";
import {deleteContainers, getContainersByIds} from "../api/ContainersApi";
import {deleteRecordByIds, destroyRecords} from "../api/RecordsApi";
import {getColumns} from "../utilities/ReactTable";
import {containersResultsAccessors} from "../search/Results";

function getRecordsAndContainersIds(items) {
    let records = items.filter(item => isARecordItem(item));
    let containers = items.filter(item => isAContainerItem(item));

    let containerIds = [];
    let containedRecordsIds = [];
    containers.forEach(c => {
        containerIds.push(c.containerId);
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

function getEmptyContainers(containerIds, userId) {
    return new Promise((resolve, reject) => {
        getContainersByIds(containerIds, userId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    response.json()
                        .then(error => {
                            throw new Error(error);
                        })
                }
            })
            .then(result => {
                let emptyContainers = result.filter(container => {
                    return container.childIds && container.childIds.length === 0;
                });
                resolve(emptyContainers);
            })
            .catch(error => {
                reject("Error getting containers: " + error);
            });
    });
}

export let destroyAction = {
    header: "Destroy Records (Step 1/2)",
    prompt: "The following items will be destroyed.",
    emptyContainers: [],
    action: (items, userId) => {
        let {containerIds, uniqueRecordIds} = getRecordsAndContainersIds(items);
        let records = items.filter(item => isARecordItem(item));
        let containerIdsOfSelectedRecords = [];

        records.forEach(record => {
            if (record.containerId) {
                containerIdsOfSelectedRecords.push(record.containerId);
            }
        });

        return new Promise((resolve, reject) => {
            if (uniqueRecordIds && uniqueRecordIds.length > 0) {
                destroySelectedRecords(uniqueRecordIds, userId)
                    .then((destroyMsg) => {
                        getEmptyContainers(containerIds.concat(containerIdsOfSelectedRecords), userId)
                            .then(result => {
                                this.emptyContainers = result;
                                resolve(destroyMsg);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else if (containerIds.length === 0 && uniqueRecordIds.length === 0) {
                reject("No items were selected.");
            } else {
                console.error("Unexpected bulk action state.");
                reject("An unexpected error occurred. Please try again later.");
            }
        });
    },
    onActionComplete: (context) => {
        let columns = getColumns(context, containersResultsAccessors);
        context.setState(deleteEmptyContainersAction);
        context.setState({data: this.emptyContainers, columns: columns, actionsComplete: false});
    }
};

export let deleteEmptyContainersAction = {
    header: "Delete Empty Containers (Step 2/2)",
    prompt: "Would you like to delete the following empty containers?",
    action: (items, userId) => {
        let {containerIds} = getRecordsAndContainersIds(items);

        return new Promise((resolve, reject) => {
            deleteContainers(containerIds, userId)
                .then(response => {
                    if (response.ok) {
                        resolve("Successfully deleted empty containers.");
                    } else {
                        response.json()
                            .then(result => {
                                if (result.exception) {
                                    reject(result.error);
                                } else if (result.message) {
                                    reject(result.message);
                                } else {
                                    reject(result);
                                }
                            });
                    }
                });
        });
    }
};


export let deleteAction = {
    header: "Delete",
    prompt: "The following items will be deleted.",
    action: (items, userId) => {
        let {containerIds, uniqueRecordIds} = getRecordsAndContainersIds(items);

        return new Promise((resolve, reject) => {
            if (uniqueRecordIds.length > 0) {
                deleteRecordByIds(uniqueRecordIds, userId)
                    .then(response => {
                        response.json();
                    })
                    .then(result => {
                        if (result.status !== 200) {
                            reject("Failed to delete records. " + result.error + " Items: " + result.numbers);
                        }
                        if (containerIds.length > 0) {
                            deleteSelectedContainers(containerIds, userId)
                                .then(result => {
                                    resolve(result);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            resolve("Successfully deleted the records.")
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        reject("An unexpected error occurred while deleting records. Please try again later.");
                    });
            } else if (containerIds.length > 0) {
                deleteSelectedContainers(containerIds, userId)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else if (containerIds.length === 0 && uniqueRecordIds.length === 0) {
                reject("No items were selected.");
            } else {
                console.error("Unexpected bulk action state.");
                reject("An unexpected error occurred. Please try again later.");
            }
        });
    }
};