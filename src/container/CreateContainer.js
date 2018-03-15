import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Alert, HelpBlock} from 'react-bootstrap'
import {createContainer} from "../APIs/ContainersApi";
import ReactTable from "react-table";

class CreateContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                success: false,
                alertMsg: "",
                title: "",
                location: this.getUserLocations()[0], //TODO://set user default location
                locations: this.getUserLocations(),
                destructionDate: this.getDestructionDate(),
                notes: "",
                selectedRecords: this.getSelectedRecords(props.resultsData, props.selectedItemIndexes),
                columns: props.resultsColumns,

                titleValidationMsg: "",
                titleValidationState: null,
                locationValidationMsg: "",
                locationValidationState: "success",
                notesValidationMsg: "",
                notesValidationState: "success"
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSelectedRecords = (records, selection) => {
        //TODO: handle case when a container is also selected This component only handles records
        let selectedRecords = [];
        selection.forEach((index) => {
            if (records[index].hasOwnProperty('number'))
                selectedRecords.push(records[index]);
        });
        return selectedRecords;
    };

    getUserLocations = () => {
        //TODO: retreive user locations
        return ["Burnaby", "Vancouver", "Richmond"];
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

            if (e.target.name === "location") {
                const length = this.state.location.length;
                if (length >= 1) {
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
        const formData = (({title, location, notes, selectedRecords}) => ({
            title,
            location,
            notes,
            selectedRecords
        }))(this.state);

        let selectedRecordIds = [];
        formData.selectedRecords.forEach(record => {
            selectedRecordIds.push(record.id);
        });
        formData.selectedRecords = selectedRecordIds;

        //TODO: workaround - remove!
        formData.containerNumber = "9999/999-ZZZ";

        createContainer(formData).then(response => {
            if (response.status !== 201) {
                throw new Error(response.message);
            } else {
                return response.json();
            }
        }).then(data => {
            this.setState({success: true});
            this.props.history.push("/viewContainer/" + data.containerId);
        }).catch(err => {
            this.setState({success: false});
            this.setState({alertMsg: "Unable to create container: " + err.message});
            window.scrollTo(0, 0);
        });
        event.preventDefault();
    }


    render() {
        const listLocationsJson = this.state.locations.map((item, i) =>
            <option key={i} value={item}>{item}</option>);
        const destructionDate = <div>{this.state.destructionDate}</div>;
        const requiredLabel = <span style={{color: 'red'}}>(Required)</span>;
        const {selectedRecords, columns} = this.state;

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
                        <FormControl.Feedback/>
                        {this.state.titleValidationState === "error"
                            ? <HelpBlock>{this.state.titleValidationMsg}</HelpBlock>
                            : null
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formLocation"
                        validationState={this.state.locationValidationState}
                    >
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl
                            name="location"
                            componentClass="select"
                            value = {this.state.location}
                            onChange={this.handleChange}
                        >
                            {listLocationsJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.locationValidationState === "error"
                            ?<HelpBlock>{this.state.locationValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup
                        validationState={this.state.notesValidationState}
                    >
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl name="notes"
                                     componentClass="textarea"
                                     placeholder="Enter text"
                                     value={this.state.notes}
                                     onChange={this.handleChange}/>
                        <FormControl.Feedback/>
                        {this.state.notesValidationState === "error"
                            ? <HelpBlock>{this.state.notesValidationMsg}</HelpBlock>
                            : null
                        }
                    </FormGroup>
                    <Button type="submit">Cancel</Button>
                    <Button type="submit">Submit</Button>
                </form>
                <div style={styles.container}>
                    <strong>Records to contain:</strong>
                    <div style={styles.recordsTable}>
                        <ReactTable
                            data={selectedRecords}
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
