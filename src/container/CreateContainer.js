import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Alert, HelpBlock} from 'react-bootstrap'
import {createContainer} from "../api/ContainersApi";
import ReactTable from "react-table";
import AlertDismissable from "../AlertDismissable";
import {isARecordItem} from "../utilities/Items";
import {setData} from "../utilities/ReactTable";

class CreateContainer extends Component {

    constructor(props, context) {
        super(props, context);

        let selectedItems = this.getSelectedItems(props.resultsData, props.selectedItemIndexes);
        this.state =
            {
                user: props.userData,
                success: false,
                alertMsg: "",
                title: "",
                locationId: null,
                locations: [],
                destructionDate: this.getDestructionDate(),
                notes: "",
                selectedRecords: selectedItems.selectedRecords,
                selectedContainers: selectedItems.selectedContainers,
                columns: props.resultsColumns,

                titleValidationMsg: "",
                titleValidationState: null,
                locationValidationMsg: "",
                locationValidationState: "success",
                notesValidationMsg: "",
                notesValidationState: "success",

                invalidStateErrors: []
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let locations = this.props.userData.locations;
        let locationId;
        if (locations && locations.length > 0) {
            locationId = locations[0].locationId;
        }

        let invalidStateErrors = [];

        if (!this.state.selectedRecords || !this.state.selectedRecords.length > 0) {
            invalidStateErrors.push("At least one record must be selected.");
        } else {

            let recordsAlreadyContained = this.state.selectedRecords.filter(record => {
                return record.containerNumber !== null || record.containerId !== 0;
            });

            let firstRecordSchedule = this.state.selectedRecords[0].scheduleId;
            let differentSchedules = false;

            this.state.selectedRecords.forEach(record => {
                if (record.scheduleId !== firstRecordSchedule) {
                    differentSchedules = true;
                }
            })

            if (recordsAlreadyContained.length > 0) {
                let recordNumbers = recordsAlreadyContained.map(r => r.containerNumber);
                this.setState({
                    alertMsg: "One or more records are already in a container: " + recordNumbers.join(", "),
                    success: false
                });
            } else if (differentSchedules) {
                this.setState({
                    alertMsg: "You cannot contain records with different retention schedules.",
                    success: false
                });
            } else {
                setData(this, this.state.selectedRecords, this.state.columns, () => {
                    this.setState({success: true});
                });
            }
        }

        this.setState({locationId, locations, invalidStateErrors});
    }


    getSelectedItems = (records, selection) => {
        let selectedRecords = [];
        let selectedContainers = [];

        selection.forEach((index) => {
            if (isARecordItem(records[index])) {
                selectedRecords.push(records[index]);
            } else {
                selectedContainers.push(records[index]);
            }
        });
        return {selectedRecords, selectedContainers};
    };

    getDestructionDate = () => {
        //TODO: get destruction date of selected records
        return "September 12, 2010 6:52PM";
    };

    //TODO - Validationstate is working but will have to likely create many for different validations
    getValidationState() {

    };

    handleChange(e) {
        e.persist();
        this.setState({[e.target.name]: e.target.value}, () => {
            if (e.target.name === "title") {
                const length = this.state.title.length;
                if (length >= 1 && length < 256) {
                    this.setState({titleValidationState: 'success'});
                }
                else if (length >= 256) {
                    this.setState({titleValidationMsg: "Please enter less than 256 characters"});
                    this.setState({titleValidationState: 'error'});
                }
                else {
                    this.setState({titleValidationState: null});
                }
            }

            if (e.target.name === "locationId") {
                const locationId = e.target.value;
                if (locationId != null) {
                    this.setState({locationValidationState: 'success'});
                }
                else {
                    this.setState({locationValidationState: null});
                }
            }

            if (e.target.name === "notes") {
                const length = this.state.notes.length;
                this.setState({notesValidationState: 'success'});
                if (length === 0) {
                    this.setState({notes: null});
                }
            }
        });
    };

    handleSubmit(event) {
        const regexValidationState = /^.*ValidationState$/;
        let keys = Object.keys(this.state);
        let failValidation = false;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (regexValidationState.test(key)) {
                if (this.state[key] === null || this.state[key].length === 0) {
                    failValidation = true;
                    let returnObj = {};
                    returnObj[key] = "error";
                    this.setState(returnObj);
                    let returnObjMsg = {};
                    let keyValidationMsg = key.replace("ValidationState", "ValidationMsg");
                    returnObjMsg[keyValidationMsg] = "Please fill out the required field.";
                    this.setState(returnObjMsg);
                }
                if (this.state[key] === "error") {
                    failValidation = true;
                }
            }
        }
        if (!failValidation) {
            let state = JSON.parse(JSON.stringify(this.state));

            let formData =
                {
                    title: state.title ? state.title.trim() : state.title,
                    locationId: state.locationId,
                    notes: state.notes ? state.notes.trim() : state.notes
                };

            let selectedRecordIds = [];
            state.selectedRecords.forEach(record => {
                selectedRecordIds.push(record.id);
            });
            formData.records = selectedRecordIds;

            let success = false;
            createContainer(formData, this.state.user.id)
                .then(response => {
                    if (response.ok) {
                        success = true;
                    }
                    return response.json();
                })
                .then(data => {
                    if (success) {
                        this.setState({success: true});
                        this.props.history.push("/viewContainer/" + data.containerId);
                    } else {
                        this.setState({success: false});
                        window.scrollTo(0, 0);

                        if (data.exception) {
                            this.setState({alertMsg: data.message, success: false});
                        }
                        else if (data.number) {
                            this.setState({alertMsg: data.error + ": " + data.number.join(", "), success: false});
                        }
                        else {
                            this.setState({alertMsg: "An unexpected error occured while creating the container: " + data});
                        }
                    }
                })
                .catch(err => {
                    this.setState({success: false});
                    this.setState({alertMsg: "An unexpected error occured. Please try again later. " + err});
                    window.scrollTo(0, 0);
                });
        }
        event.preventDefault();
    }

    render() {
        let listLocationJson = null;
        const destructionDate = <div>{this.state.destructionDate}</div>;
        const requiredLabel = <span style={{color: 'red'}}>(Required)</span>;
        const {columns, data} = this.state;

        let handleAction = () => {
            this.props.history.push("/");
        };

        let alertMessage = this.state.invalidStateErrors.join("\n");

        if (this.state.invalidStateErrors.length > 0) {
            return <AlertDismissable handleAction={handleAction} alertMessage={alertMessage}/>
        }

        if (this.state.userLocations !== null) {
            listLocationJson = this.state.locations.map((item, i) =>
                <option key={i} value={item.locationId}>{item.locationName}</option>);
        }

        return (
            <div>
                {this.state.alertMsg.length !== 0 && !this.state.success
                    ? <Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                {this.state.alertMsg.length !== 0 && this.state.success
                    ? <Alert bsStyle="success"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                <h1>New Container</h1>
                <b>Due for destruction</b>
                <div>{destructionDate}</div>
                <form onSubmit={this.handleSubmit} style={styles.formStyle}>
                    <FormGroup
                        controlId="formTitle"
                        validationState={this.state.titleValidationState}
                    >
                        <ControlLabel>Title {requiredLabel}</ControlLabel>
                        <FormControl
                            name="title"
                            type="text"
                            value={this.state.title}
                            placeholder="Enter container title"
                            onChange={this.handleChange}
                        />
                        {this.state.titleValidationState === "error"
                            ? <HelpBlock>{this.state.titleValidationMsg}</HelpBlock>
                            : null
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formLocation"
                        onChange={this.handleChange}
                        validationState={this.state.locationValidationState}
                    >
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl
                            name="locationId"
                            componentClass="select"
                            value={this.state.locationId}
                        >
                            {listLocationJson}
                        </FormControl>
                        {this.state.locationValidationState === "error"
                            ? <HelpBlock>{this.state.locationValidationMsg}</HelpBlock>
                            : null
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formNotes"
                        validationState={this.state.notesValidationState}
                    >
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl name="notes"
                                     componentClass="textarea"
                                     placeholder="Enter text"
                                     value={this.state.notes}
                                     onChange={this.handleChange}/>
                        {this.state.notesValidationState === "error"
                            ? <HelpBlock>{this.state.notesValidationMsg}</HelpBlock>
                            : null
                        }
                    </FormGroup>
                    <Button bsStyle="danger" style={{marginRight: '10px'}} onClick={() => {
                        this.props.history.goBack()
                    }}>Cancel</Button>
                    <Button bsStyle="primary" type="submit" disabled={!this.state.success}>Submit</Button>
                </form>
                <div style={styles.container}>
                    <strong>Records to contain:</strong>
                    <div style={styles.recordsTable}>
                        <ReactTable
                            data={data}
                            columns={columns}
                            className="-striped -highlight"
                            showPagination={true}
                            minRows={5}
                            defaultPageSize={5}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

let styles = {
    container: {
        margin: "10px",
    },

    recordsTable: {
        height: "300px",
        overflowY: "auto"
    },

    formStyle: {
        margin: 'auto',
        width: '50%',
        padding: '10px',
        textAlign: 'left'
    },
};

export default CreateContainer;
