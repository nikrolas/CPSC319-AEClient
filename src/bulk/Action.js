import {isAContainerItem, isARecordItem} from "../utilities/Items";
import {deleteContainers, getContainersByIds} from "../api/ContainersApi";
import {deleteRecordByIds, destroyRecords} from "../api/RecordsApi";
import {getColumns} from "../utilities/ReactTable";
import {containersResultsAccessors} from "../search/Results";
import {isOk, parseResponseList} from "../utilities/Responses";


function getSelectedRecordsAndContainerIds(items) {
    let records = items.filter(item => isARecordItem(item));
    let containers = items.filter(item => isAContainerItem(item));

    let containerIds = containers.map(c => c.containerId);
    let recordIds = records.map(r => r.id);

    return {containerIds, recordIds};
}

function getRecordsContainerRecordsAndContainerIds(items) {
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
                    if (result.number) {
                        let itemsStr = "";
                        if (result.number.length > 0) {
                            itemsStr = " Items: " + result.number.join(", ");
                        }
                        reject(result.error + itemsStr);
                    } else if (result.exception) {
                        reject(result.message);
                    } else {
                        reject(result);
                    }
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
                    if (result.containerNumber) {
                        let containerNumStr = "";
                        if (result.containerNumber.length > 0) {
                            containerNumStr = ": " + result.containerNumber.join(", ");
                        }
                        reject(result.error + containerNumStr);
                    } else if (result.exception) {
                        reject(result.message);
                    }
                }
            })
            .catch(error => {
                console.error(error);
                reject("An unexpected error occurred. Please try again later. See the developer console for more details.");
            });
    });
}

function getEmptyContainers(containerIds, userId) {
    return new Promise((resolve, reject) => {
        if (containerIds && containerIds.length > 0) {
            let stringContainerIds = containerIds.join(",");
            getContainersByIds(stringContainerIds, userId)
                .then(response => {
                    if (response.ok) {
                        response.json()
                            .then(result => {
                                let emptyContainers = result.filter(container => {
                                    return container.childRecordIds && container.childRecordIds.length === 0;
                                });
                                resolve(emptyContainers);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        response.json()
                            .then(error => {
                                reject(error.error);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }
                })
                .catch(error => {
                    reject("Unexpected error while getting containers: " + error);
                });
        } else {
            resolve([]);
        }
    });
}

export let destroyAction = {
    header: "Destroy Records",
    prompt: "The following items will be destroyed.",
    emptyContainers: [],
    action: (items, userId) => {
        let {containerIds, uniqueRecordIds} = getRecordsContainerRecordsAndContainerIds(items);
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
            } else if (containerIds.length > 0) {
                getEmptyContainers(containerIds.concat(containerIdsOfSelectedRecords), userId)
                    .then(result => {
                        this.emptyContainers = result;
                        resolve("The selected containers are empty and can be deleted.");
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
        if (this.emptyContainers && this.emptyContainers.length > 0) {
            let columns = getColumns(context, containersResultsAccessors);
            context.setState(deleteEmptyContainersAction);
            context.setState({data: this.emptyContainers, columns: columns, actionsComplete: false});
        }
    }
};

export let deleteEmptyContainersAction = {
    header: "Delete Empty Containers",
    prompt: "Would you like to delete the following empty containers?",
    action: (items, userId) => {
        let {containerIds} = getRecordsContainerRecordsAndContainerIds(items);

        return new Promise((resolve, reject) => {
            deleteContainers(containerIds, userId)
                .then(response => {
                    if (response.ok) {
                        resolve("Successfully deleted empty containers.");
                    } else {
                        response.json()
                            .then(result => {
                                if (result.containerNumber) {
                                    let containerNumStr = "";
                                    if (result.containerNumber.length > 0) {
                                        containerNumStr = ": " + result.containerNumber.join(", ");
                                    }
                                    reject(result.error + containerNumStr);
                                } else if (result.exception) {
                                    reject(result.message)
                                } else {
                                    reject(result);
                                }
                            });
                    }
                });
        });
    },
    onActionComplete: () => {
    }
};


export let deleteAction = {
    header: "Delete",
    prompt: "The following items will be deleted.",
    action: (items, userId) => {
        let {containerIds, recordIds} = getSelectedRecordsAndContainerIds(items);
        let deleteSuccess = true;
        return new Promise((resolve, reject) => {
            if (recordIds.length > 0) {
                deleteRecordByIds(recordIds, userId)
                    .then(response => {
                        return response.text();
                    })
                    .then(result => {
                        if (result && result.length > 0) {
                            let response = JSON.parse(result);
                            if (!isOk(response)) {
                                deleteSuccess = false;
                                reject(parseResponseList(response));
                            }
                        }
                        if (deleteSuccess) {
                            if (containerIds.length > 0) {
                                deleteSelectedContainers(containerIds, userId)
                                    .then(() => {
                                        resolve("Successfully deleted the records and containers.");
                                    })
                                    .catch(error => {
                                        reject("Only records were deleted. " + error);
                                    });
                            } else {
                                resolve("Successfully deleted the records.")
                            }
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
            } else if (containerIds.length === 0 && recordIds.length === 0) {
                reject("No items were selected.");
            } else {
                console.error("Unexpected bulk action state.");
                reject("An unexpected error occurred. Please try again later.");
            }
        });
    },
    onActionComplete: () => {
    }
};
