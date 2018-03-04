import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock, Alert} from 'react-bootstrap'
import {createRecord} from "../APIs/RecordsApi";

class CreateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                alertMsg:"",
                recordTypeValidationMsg:"",
                recordTypeValidationState:null,
                recordType: "",

                locationValidationMsg:"",
                locationValidationState:"success",
                location: "",

                //TODO Record Number
                recordNumberValidationMsg:"",
                recordNumberValidationState:"success",
                recordNumber: "",

                titleValidationMsg:"",
                titleValidationState:null,
                title: "",

                //TODO Classifications
                classificationValidationMsg:"",
                classificationValidationState:"success",
                classification: "",


                retentionValidationMsg:"",
                retentionValidationState:null,
                retentionSchedule:"",

                containerValidationMsg:"",
                containerValidationState:"success",
                container: "",

                consignmentCodeValidationMsg:"",
                consignmentCodeValidationState:"success",
                consignmentCode: "",

                notesValidationMsg:"",
                notesValidationState:"success",
                notes:"",

                classificationChildren: [],
                locationJson: [{
                    "id": "1",
                    "location": "Burnaby",
                }, {
                    "id": "2",
                    "location": "Richmond",
                }],

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
            //Validation handling here
            if(e.target.name === "recordType") {
                const length = this.state.recordType.length;
                if (length >= 1) {
                    this.setState({recordTypeValidationState: 'success'});
                }
                else {
                    this.setState({titleValidationState: null});
                }
            }
            if(e.target.name === "location") {
                const length = this.state.location.length;
                if (length >= 1) {
                    this.setState({locationValidationState: 'success'});
                }
                else {
                    this.setState({locationValidationState: null});
                }
            }
            //TODO Record Number

            if(e.target.name === "title") {
                const length = this.state.title.length;
                if (length >= 1 && length < 256) {
                    this.setState({titleValidationState:'success'});
                }
                else if (length >=50){
                    this.setState({titleValidationMsg:"Please enter less than 256 characters"})
                    this.setState({titleValidationState:'error'});
                }
                else {
                    this.setState({titleValidationState:null});
                }
            }
            //TODO Classification
            if(e.target.name === "retentionSchedule") {
                const length = this.state.retentionSchedule.length;
                if (length >= 1) {
                    this.setState({retentionValidationState:'success'});
                }
                else {
                    this.setState({retentionValidationState:null});
                }
            }
            if(e.target.name === "container") {
                const regexNumbers = /^[0-9\b]{1,11}$/;
                const regexNumbersExceed = /^[0-9\b]{12,}$/;
                const regexNotNumbers = /[^0-9]+/;

                if (regexNumbers.test(this.state.container)) {
                    this.setState({containerValidationState:'success'});
                }
                else if (regexNumbersExceed.test(this.state.container)) {
                    this.setState({containerValidationState:'error'});
                    this.setState({containerValidationMsg:'Please enter less than 12 numbers'});
                }
                else if (regexNotNumbers.test(this.state.container)){
                    this.setState({containerValidationState:'error'});
                    this.setState({containerValidationMsg:'Please enter numbers only'});
                }
                else {
                    this.setState({containerValidationState:'success'});
                }
            }

            if(e.target.name === "consignmentCode") {
                const length = this.state.consignmentCode.length;
                if (length >= 1 && length <= 50) {
                    this.setState({consignmentCodeValidationState:'success'});
                }
                else if (length > 50) {
                    this.setState({consignmentCodeValidationState:'error'});
                    this.setState({consignmentCodeValidationMsg:'Please enter less than 51 characters only'});
                }
                else {
                    this.setState({consignmentCodeValidationState:'success'});
                }
            }

            if(e.target.name === "notes") {
                const length = this.state.notes.length;
                if (length >= 0) {
                    this.setState({notesValidationState:'success'});
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
        const regexValidationState = /^.*ValidationState$/;
        var keys = Object.keys(this.state);
        var failValidation = false;
        for(var i=0;i<keys.length;i++){
            var key = keys[i];
            if (regexValidationState.test(key)) {
                if(this.state[key] === null) {
                    failValidation = true;
                    var returnObj = {};
                    returnObj[key] = "error";
                    this.setState(returnObj);
                    var returnObjMsg = {};
                    var keyValidationMsg = key.replace("ValidationState", "ValidationMsg");
                    returnObjMsg[keyValidationMsg]= "Please fill out the required field.";
                    this.setState(returnObjMsg);


                }
                if(this.state[key] === "error") {
                    failValidation = true;
                }
            }
        }
        if(!failValidation) {
            createRecord(this.state)
                .then(result => {
                    console.log('success====:', result)
                })
                .catch(error => {
                    this.setState({alertMsg:"The application was unable to connect to the network. Please try again later."})
                    window.scrollTo(0, 0)
                });
        }
        event.preventDefault();
    }

    render() {
        const listRecordTypeJson = this.state.recordJson.map((item, i) => <option key={i}
                                                                                  value={i}>{item.name}</option>);
        const listLocationJson = this.state.locationJson.map((item, i) => <option key={i}
                                                                                  value={i}>{item.location}</option>);
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
                {this.state.alertMsg.length !== 0
                    ?<Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    :null
                }
                <h1>Create a New Record</h1>
                <form onSubmit={this.handleSubmit} style = {formStyle}>
                    <FormGroup
                        controlId="formControlsSelect"
                        onChange={this.handleChange}
                        validationState={this.state.recordTypeValidationState}
                    >
                        <ControlLabel>Record Type {requiredLabel}</ControlLabel>
                        <FormControl name="recordType"
                                     componentClass="select"
                        >
                            <option value="" disabled selected>(Select a record type)</option>
                            {listRecordTypeJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.recordTypeValidationState === "error"
                            ?<HelpBlock>{this.state.recordTypeValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formControlsSelect"
                        onChange={this.handleChange}
                        validationState={this.state.locationValidationState}
                    >
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl
                            name="location"
                            componentClass="select"
                        >
                        {listLocationJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.locationValidationState === "error"
                            ?<HelpBlock>{this.state.locationValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    {/*TODO RecordNumber*/}
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.state.recordNumberValidationState}
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
                        { this.state.recordNumberValidationState === "error"
                            ?<HelpBlock>{this.state.recordNumberValidationMsg}</HelpBlock>
                            :null
                        }
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
                            ?<HelpBlock>{this.state.titleValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                   {/* TODO Classifications */}
                    <FormGroup
                        controlId="formControlsSelect "
                        onChange={this.handleChange}
                        validationState={this.state.classificationValidationState}
                    >
                        <ControlLabel>Classification {requiredLabel}</ControlLabel>
                        <FormControl name="classification"
                                     componentClass="select"
                                     placeholder="select">
                            {listClassificationJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.classificationValidationState === "error"
                            ?<HelpBlock>{this.state.classificationValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup>
                        {this.returnCheckboxes()}
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect"
                               onChange={this.handleChange}
                               validationState={this.state.retentionValidationState}>
                        <ControlLabel>Retention Schedule {requiredLabel}</ControlLabel>
                        <FormControl name="retentionSchedule"
                                     componentClass="select"
                                     placeholder="select">
                            <option value="" disabled selected>(Select a record type)</option>
                            {listRetentionScheduleJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.retentionValidationState === "error"
                            ?<HelpBlock>{this.state.retentionValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>

                    <FormGroup
                        validationState={this.state.containerValidationState}
                    >
                        <ControlLabel>Container Number</ControlLabel>
                        <FormControl
                            name="container"
                            type="text"
                            value={this.state.container}
                            placeholder="Enter digits"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                        { this.state.containerValidationState === "error"
                            ?<HelpBlock>{this.state.containerValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>

                    <FormGroup
                        validationState={this.state.consignmentCodeValidationState}
                    >
                        <ControlLabel>Consignment Code</ControlLabel>
                        <FormControl
                            name="consignmentCode"
                            type="text"
                            value={this.state.consignmentCode}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                        { this.state.consignmentCodeValidationState === "error"
                            ?<HelpBlock>{this.state.consignmentCodeValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup
                        validationState={this.state.notesValidationState}
                    >
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl
                            name="notes"
                            componentClass="textarea"
                            value={this.state.notes}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                        { this.state.notesValidationState === "error"
                            ?<HelpBlock>{this.state.notesValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        )
    }
}

export default CreateRecord;