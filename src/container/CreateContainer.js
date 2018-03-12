import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Alert} from 'react-bootstrap'
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
                columns: props.resultsColumns
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
        this.setState({[e.target.name]: e.target.value});
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

        createContainer(formData).then(response => {
            return response.json();
        }).then(data => {
            this.setState({success: false});
            this.setState({alertMsg: "Endpoint not implemented."});
            window.scrollTo(0, 0)
        }).catch(err => {
            this.setState({success: false});
            this.setState({alertMsg: "Endpoint not implemented."});
            window.scrollTo(0, 0)
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
                        validationState={this.getValidationState()}
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
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect " onChange={this.handleChange}>
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl name="location"
                                     componentClass="select"
                                     placeholder="select"
                                     value={this.state.location}>
                            {listLocationsJson}
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl name="notes"
                                     componentClass="textarea"
                                     placeholder="Enter notes"
                                     value={this.state.notes}
                                     onChange={this.handleChange}/>
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
