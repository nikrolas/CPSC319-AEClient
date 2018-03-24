import {isARecordItem} from "../utilities/Items";
import {removeRecordsFromContainer} from "../api/ContainersApi";

export var removeRecordsFromContainerAction = {
        header: "Remove from container",
        prompt: "The following items will be removed from their container.",
        action: (items) => {
            let records = items.filter(item => isARecordItem(item));
            let recordIds = records.map(record => record.id);
            return removeRecordsFromContainer(recordIds)
                .then(response => {
                    return response.json();
                })
                .then(result => {
                    return "Successfully removed records from their container."
                })
                .catch(error => {
                    return "Unable to remove one or more records from their container: " + error.numbers;
                });
        }
};

export var destroyAction = {
    header: "Destroy",
    prompt: "The following items will be destroyed.",
    option: "Delete empty containers",
    action: (items, option) => {
        return new Promise((resolve, reject) => {
            resolve("destroyed" + option);
        });
    }
};

export var deleteAction = {
    header: "Delete",
    prompt: "The following items will be deleted.",
    action: (items) => {
        return new Promise((resolve, reject) => {
            resolve("deleted");
        });
    }
};