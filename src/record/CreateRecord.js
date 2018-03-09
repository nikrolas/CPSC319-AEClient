import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, ButtonGroup, HelpBlock, Alert} from 'react-bootstrap'
import {createRecord, getClassifications, getRecordType,getRetentionSchedule} from "../APIs/RecordsApi";
import {Typeahead} from 'react-bootstrap-typeahead';

class CreateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                alertMsg:"",
                recordTypeValidationMsg:"",
                recordTypeValidationState:null,
                recordType: null,

                locationValidationMsg:"",
                locationValidationState:"success",
                location: null,

                //TODO Record Number
                recordNumberValidationMsg:"",
                recordNumberValidationState:"success",
                recordNumber: null,

                titleValidationMsg:"",
                titleValidationState:null,
                title: "",

                //TODO Classifications
                classificationValidationMsg:"",
                classificationValidationState:null,
                classification: null,
                classificationBack:[],

                retentionValidationMsg:"",
                retentionValidationState:null,
                retentionSchedule:null,

                containerValidationMsg:"",
                containerValidationState:"success",
                container: null,

                consignmentCodeValidationMsg:"",
                consignmentCodeValidationState:"success",
                consignmentCode: null,

                notesValidationMsg:"",
                notesValidationState:"success",
                notes:null,

                locationJson: [{
                    "id": "1",
                    "location": "Burnaby",
                }, {
                    "id": "2",
                    "location": "Richmond",
                }],

                recordTypeResponse: null,
                classificationResponse: null,
                retentionScheduleResponse:null,
            };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.backClassification = this.backClassification.bind(this);
        this.resetClassification = this.resetClassification.bind(this);

    }
    componentWillMount() {
        getRecordType()
            .then(response => response.json())
            .then(data => {
                this.setState({recordTypeResponse: data});
            })
            .catch(err => {
                console.error("Error loading record: " + err.message);
                this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
            });
        getClassifications()
            .then(response => response.json())
            .then(data => {
                this.setState({classificationResponse: data});
            })
            .catch(err => {
                console.error("Error loading record: " + err.message);
                this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
            });
        getRetentionSchedule()
            .then(response => response.json())
            .then(data => {
                this.setState({retentionScheduleResponse: data});
            })
            .catch(err => {
                console.error("Error loading record: " + err.message);
                this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
            });
    }
    handleChange(e) {
        if(Array.isArray(e)){
            this.setState({retentionSchedule: e}, ()=> {
               if(this.state.retentionSchedule.length > 0) {
                   this.setState({retentionValidationState: 'success'});
               }
               else {
                   this.setState({retentionValidationState: 'error'});
                   this.setState({retentionValidationMsg:'Please select a retention schedule from the dropdown'});
               }
            });
        }
        else {
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

                if(e.target.name === "classification") {
                    getClassifications(this.state.classification)
                        .then(response => response.json())
                        .then(data => {
                            if(data.length >0) {
                                this.state.classificationBack.push(this.state.classification);
                                this.setState({classificationResponse: data});
                            }
                            else {
                                console.log(this.state.classificationBack);
                                this.setState({classificationValidationState:"success"});
                            }
                        })
                }

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
                    else if (regexNotNumbers.test(this.state.container && this.state.container.length !== 0)){
                        this.setState({containerValidationState:'error'});
                        this.setState({containerValidationMsg:'Please enter numbers only'});
                    }
                    else {
                        this.setState({container: null});
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
                        this.setState({consignmentCode: null});
                        this.setState({consignmentCodeValidationState:'success'});
                    }
                }

                if(e.target.name === "notes") {
                    const length = this.state.notes.length;
                    this.setState({notesValidationState:'success'});
                    if (length === 0) {
                        this.setState({notes: null});
                    }
                }
            });

            //When RecordType is changed, adjust record number
            if (e.target.name === "recordType") {
                for (var k in this.state.recordTypeResponse) {
                    if (k === e.target.value) {
                        this.setState({recordNumber: this.state.recordTypeResponse[k]["numberPattern"]});
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
    }

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
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if(data.status === 500) {
                        this.setState({alertMsg: data.message});
                        window.scrollTo(0, 0)
                    }
                    else {
                        this.props.history.push("/viewRecord/"+ data.id);
                    }
                })
                .catch(error => {
                    this.setState({alertMsg:"The application was unable to connect to the network. Please try again later."})
                    window.scrollTo(0, 0)
                });
        }
        event.preventDefault();
    }

    backClassification() {
            getClassifications(this.state.classificationBack.pop())
                .then(response => response.json())
                .then(data => {
                    this.setState({classificationResponse: data});
                    this.setState({classificationValidationState: null});
                })
                .catch(error => {

                });
    }

    resetClassification(){

    }

    render() {
        var listRecordTypeJson = null;
        var listClassificationJson = null;
        var retentionForm = null;
        if (this.state.recordTypeResponse !== null) {
            listRecordTypeJson = this.state.recordTypeResponse.map((item, i) => <option key={i} value={item.typeId}>{item.typeName}</option>);
        }
        if (this.state.classificationResponse !== null) {
            listClassificationJson = this.state.classificationResponse.map((item, i) =>
                <option key={i} value={item.id}>{item.name}</option>);
        }
        if (this.state.retentionScheduleResponse !== null) {
            retentionForm =
                <Typeahead
                    onChange={this.handleChange}
                    labelKey={option => `${option.name} ${option.code.trim()}`}
                options={this.state.retentionScheduleResponse}
                placeholder="Choose a state..."/>
        }


        const listLocationJson = this.state.locationJson.map((item, i) => <option key={i}
                                                                                  value={i}>{item.location}</option>);
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
                            <option value="" disabled selected>(Select a record type)</option>
                            {listClassificationJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.classificationValidationState === "error"
                            ?<HelpBlock>{this.state.classificationValidationMsg}</HelpBlock>
                            :null
                        }
                        <ButtonGroup>
                        <Button onClick={this.backClassification}>Back</Button>
                        <Button onClick={this.resetClassification}>Reset</Button>
                        </ButtonGroup>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect"
                               validationState={this.state.retentionValidationState}>
                        <ControlLabel>Retention Schedule {requiredLabel}</ControlLabel>
                            {retentionForm}
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