import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import {createContainer} from "../APIs/ContainersApi";
import ReactTable from "react-table";

class CreateContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                title: "",
                location: this.getUserLocations()[0], //TODO://set user default location
                locations: this.getUserLocations(),
                destructionDate: this.getDestructionDate(),
                notes: "",
                selectedRecords: this.getSelectedRecords(props.resultsData, props.selectedItems),
                columns: props.resultsColumns
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSelectedRecords = (records, selection) => {
        let selectedRecords = [];
        selection.forEach((index) => {
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

        createContainer(formData, 5).then(response => {
            return response.json();
        }).then(data => {
            alert("Endpoint not implemented yet.");
        }).catch(err => {
            alert("Endpoint not implemented yet.");
        })
    }


    render() {
        const listLocationsJson = this.state.locations.map((item, i) =>
            <option key={i} value={item}>{item}</option>);
        const destructionDate = <div>{this.state.destructionDate}</div>;
        const requiredLabel = <span style={{color: 'red'}}>(Required)</span>;
        const {selectedRecords, columns} = this.state;

        const container = {
            margin: "10px",
        };

        const recordsTable = {
            height: "300px",
            overflowY: "auto"
        };

        return (
            <div style={{margin: '0 5% 0 5%'}}>
                <h1>New Container</h1>
                <b>Due for destruction</b>
                <div>{destructionDate}</div>
                <form onSubmit={this.handleSubmit}>
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
                <div style={container}>
                    <strong>Records to contain:</strong>
                    <div style={recordsTable}>
                        <ReactTable
                            data={selectedRecords}
                            columns={columns}
                            className="-striped -highlight"
                            showPagination={false}
                            minRows={5}
                            defaultPageSize={selectedRecords.length}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateContainer;
