import {isARecordItem} from "../utilities/Items";
import {removeRecordsFromContainer} from "../api/ContainersApi";

export function removeRecordsFromContainerAction(context, items) {
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