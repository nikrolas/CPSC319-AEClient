import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock} from 'react-bootstrap'
import {createRecord} from "../APIs/RecordsApi";

class CreateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                titleValidationMsg:"",
                titleValidationState:null,
                recordType: "",
                recordNumber: "",
                title: "",
                containerNumber: "",
                consignmentCode: "",
                location: "Burnaby",
                classificationChildren: [],
                notes:"",
                recordJson: [{
                    "id": "10",
                    "name": "CASE RECORDS",
                    "numberPattern": "XXX-ZZZ/NN",
                    "defaultScheduleId": "322"
                }, {
                    "id": "3",
                    "name": "subject",
                    "numberPattern": "KKK-yyyy/ggg",
                    "defaultScheduleId": ""
                }]
                ,
                classificationJson: [{
                    "id": "2",
                    "name": "COMPLIANCE",
                    "keyword": "F",
                    "updatedAt": "2003-10-10 19:00:48.000000",
                    "parent": "",
                    "children": [3, 4, 5]
                }, {
                    "id": "3",
                    "name": "SAMPLE",
                    "keyword": "G",
                    "updatedAt": "2003-10-10 19:00:52.000000",
                    "parent": 2,
                    "children": ""
                }]
                ,
                retentionScheduleJson: [{
                    "id": "2",
                    "name": "INFORMATION MANAGEMENT - ACQUISITION",
                    "code": "I1.A1.01",
                    "years": "3"
                }, {
                    "id": "4",
                    "name": "BUSINESS DEVELOPMENT - COMMITTEES",
                    "code": "B1.C2.00",
                    "years": "1"
                }],
                checked: false
            };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.persist();
        this.setState({[e.target.name]: e.target.value}, ()=> {
            if(e.target.name === "title") {
                const length = this.state.title.length;
                if (length >= 1 && length < 50) {
                    this.setState({titleValidationState:'success'});
                }
                else if (length >=50){
                    this.setState({titleValidation:"Please enter less than 50 characters"})
                    this.setState({titleValidationState:'error'});
                }
                else {
                    this.setState({titleValidationState:null});
                }
            }
        });
        //When RecordType is changed, adjust record number
        if (e.target.name === "recordType") {
            for (var k in this.state.recordJson) {
                if (k === e.target.value) {
                    this.setState({recordNumber: this.state.recordJson[k]["numberPattern"]});
                    break;
                }
            }
        }
        //When Classification is changed, populate clickbox with proper children
        //TODO - Need to see how far the children information goes
        if (e.target.name === "classification") {
            for (k in this.state.classificationJson) {
                if (k === e.target.value) {
                    this.setState({classificationChildren: this.state.classificationJson[k]["children"]});
                    console.log(this.state.classificationChildren);
                    break;
                }
            }
        }
    }

    //TODO Might have to go further into children field to display all possible options
    returnCheckboxes() {
        if (this.state.classificationChildren.length > 0) {
            return this.state.classificationChildren.map((item, i) =>
                <Checkbox inline key={i} value={i}>{item}</Checkbox>);
        }
        else {
            return null;
        }
    };

    handleSubmit(event) {
        alert('Form has been submitted');
        createRecord(this.state)
            .then(result => console.log('success====:', result))
            .catch(error => console.log('error============:', error));
        event.preventDefault();
    }

    render() {
        const listRecordTypeJson = this.state.recordJson.map((item, i) => <option key={i}
                                                                                  value={i}>{item.name}</option>);
        const listClassificationJson = this.state.classificationJson.map((item, i) =>
            <option key={i} value={i}>{item.name}</option>);
        const listRetentionScheduleJson = this.state.retentionScheduleJson.map((item, i) =>
            <option key={i} value={i}>{item.name}</option>);
        const requiredLabel = <span style={{color:'red'}}>(Required)</span>;

        let formStyle = {
            margin: 'auto',
            width: '50%',
            padding: '10px',
            textAlign:'left'
        }

        return (
            <div>
                <h1>Create a New Record</h1>
                <form onSubmit={this.handleSubmit} style = {formStyle}>
                    <FormGroup
                        controlId="formControlsSelect "
                        onChange={this.handleChange}
                    >
                        <ControlLabel>Record Type {requiredLabel}</ControlLabel>
                        <FormControl name="recordType"
                                     componentClass="select"
                                     placeholder="select">
                            {listRecordTypeJson}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl
                            disabled
                            type="text"
                            value={this.state.location}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup
                        controlId="formBasicText"
                    >
                        <ControlLabel>Record Number {requiredLabel}</ControlLabel>
                        <FormControl
                            name="recordNumber"
                            type="text"
                            value={this.state.recordNumber}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                    </FormGroup>
                    <FormGroup
                        validationState={this.state.titleValidationState}
                    >
                        <ControlLabel>Title {requiredLabel}</ControlLabel>
                        <FormControl
                            name="title"
                            type="text"
                            value={this.state.title}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                        { this.state.titleValidationState === "error"
                            ?<HelpBlock>{this.state.titleValidation}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect " onChange={this.handleChange}>
                        <ControlLabel>Classification {requiredLabel}</ControlLabel>
                        <FormControl name="classification"
                                     componentClass="select"
                                     placeholder="select">
                            {listClassificationJson}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        {this.returnCheckboxes()}
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect ">
                        <ControlLabel>Retention Schedule {requiredLabel}</ControlLabel>
                        <FormControl name="retentionSchedule"
                                     componentClass="select"
                                     placeholder="select">
                            {listRetentionScheduleJson}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Container Number</ControlLabel>
                        <FormControl
                            name="containerNumber"
                            type="text"
                            value={this.state.containerNumber}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Consignment Code {requiredLabel}</ControlLabel>
                        <FormControl
                            name="consignmentCode"
                            type="text"
                            value={this.state.consignmentCode}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl
                            name="notes"
                            componentClass="textarea"
                            value={this.state.notes}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        )
    }
}

export default CreateRecord;