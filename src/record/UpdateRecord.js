import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock, Alert} from 'react-bootstrap'
import {getRecordById, updateRecord} from "../APIs/RecordsApi";

class UpdateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                alertMsg:"",

                recordNumberValidationMsg:"",
                recordNumberValidationState:"success",

                titleValidationMsg:"",
                titleValidationState:"success",

                locationValidationMsg:"",
                locationValidationState:"success",

                //TODO Classifications
                classificationValidationMsg:"",
                classificationValidationState:"success",

                //TODO RetentionSechdule
                retentionValidationMsg:"",
                retentionValidationState:"success",

                //TODO State
                stateValidationMsg:"",
                stateValidationState:"success",

                containerValidationMsg:"",
                containerValidationState:"success",

                consignmentCodeValidationMsg:"",
                consignmentCodeValidationState:"success",

                notesValidationMsg:"",
                notesValidationState:"success",

                classificationChildren: [],
                responseJson:{
                    title:null,
                    number:null,
                    scheduleId:null,
                    typeId:null,
                    consignmentCode:null,
                    containerId:null,
                    locationId:null,
                    classifications:null,
                    notes:null,
                    id:null,
                    stateId:null,
                    createdAt:null,
                    updatedAt:null,
                    closedAt:null,
                    location:"",
                    schedule:null,
                    type:null,
                    state:null,
                    container:null,
                    scheduleYear:null
                },
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
    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordById(this.props.match.params.recordId)
            .then(response => response.json())
            .then(data => {
                if (data && !data.exception) {
                    setData(that, data);
                }
                console.log(this.state);
            })
            .catch(err => {
                console.error("Error loading record: " + err.message);
            });
    }
    setData = (context, data) => {
        let keys = Object.keys(data);
        keys.forEach( key => {
            if (key.endsWith("At")) {
                data[key] = new Date(data[key]).toTimeString();
            }
        });
        context.setState({"responseJson": data});
    };

    handleChange(e) {
        e.persist();
        let responseCopy = JSON.parse(JSON.stringify(this.state.responseJson));
        responseCopy[e.target.name] = e.target.value;
        this.setState({responseJson:responseCopy}, ()=> {
            //Validation handling here
            if(e.target.name === "recordNumber") {
                const length = this.state.responseJson["number"];
                if (length >= 1) {
                    this.setState({recordNumberValidationState: 'success'});
                }
                else {
                    this.setState({recordNumberValidationState: 'error'});
                    this.setState({recordNumberValidationMsg: 'Record Number should be pre-filled. Please notify the developers.'});
                }
            }
            if(e.target.name === "title") {
                const length = this.state.responseJson["title"].length;
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

            if(e.target.name === "location") {
                const length = this.state.responseJson["location"].length;
                if (length >= 1) {
                    this.setState({locationValidationState: 'success'});
                }
                else {
                    this.setState({locationValidationState: 'error'});
                    this.setState({locationValidationMsg: 'Record Number should be pre-filled. Please notify the developers.'});
                }
            }
            //TODO Classification
            //TODO RetentionScehdule
            if(e.target.name === "retentionSchedule") {
                const length = this.state.responseJson["retentionSchedule"].length;
                if (length >= 1) {
                    this.setState({retentionValidationState:'success'});
                }
                else {
                    this.setState({retentionValidationState:null});
                }
            }
            //TODO State
            if(e.target.name === "containerId") {
                const regexNumbers = /^[0-9\b]{1,11}$/;
                const regexNumbersExceed = /^[0-9\b]{12,}$/;
                const regexNotNumbers = /[^0-9]+/;

                if (regexNumbers.test(this.state.responseJson["containerId"])) {
                    this.setState({containerValidationState:'success'});
                }
                else if (regexNumbersExceed.test(this.state.container)) {
                    this.setState({containerValidationState:'error'});
                    this.setState({containerValidationMsg:'Please enter less than 12 numbers'});
                }
                else if (regexNotNumbers.test(this.state.container) && this.state.responseJson["containerId"].length !== 0){
                    this.setState({containerValidationState:'error'});
                    this.setState({containerValidationMsg:'Please enter numbers only'});
                }
                else {
                    var tempObject = this.state.responseJson;
                    tempObject['containerId'] = null;
                    console.log(tempObject);
                    this.setState({responseJson: tempObject});
                    this.setState({containerValidationState:'success'});
                }
            }

            if(e.target.name === "consignmentCode") {
                const length = this.state.responseJson['consignmentCode'].length;
                if (length >= 1 && length <= 50) {
                    this.setState({consignmentCodeValidationState:'success'});
                }
                else if (length > 50) {
                    this.setState({consignmentCodeValidationState:'error'});
                    this.setState({consignmentCodeValidationMsg:'Please enter less than 51 characters only'});
                }
                else {
                    var tempObject1 = this.state.responseJson;
                    tempObject1['consignmentCode'] = null;
                    console.log(tempObject1);
                    this.setState({responseJson: tempObject});
                    this.setState({consignmentCodeValidationState:'success'});
                }
            }

            if(e.target.name === "notes") {
                const length = this.state.responseJson['notes'].length;
                if (length >= 0) {
                    this.setState({notesValidationState:'success'});
                }
            }

        });

        //When Classification is changed, populate clickbox with proper children
        //TODO - Need to see how far the children information goes
        if (e.target.name === "classification") {
            for (var k in this.state.classificationJson) {
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
            updateRecord(this.props.match.params.recordId, this.state)
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

    render() {
        var listLocationJson = null;
        if(typeof this.state.responseJson["location"] === "string") {
            listLocationJson = <option value={this.state.responseJson["locationId"]}>{this.state.responseJson["location"]}</option>
        }
        else {
            listLocationJson =this.state.responseJson["location"].map((item, i) => <option key={i}
                                                                                           value={i}>{item.location}</option>);
        }
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
                <h1>Update Record</h1>
                <h2>{this.state.responseJson["number"]}</h2>
                <form onSubmit={this.handleSubmit}  style = {formStyle}>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.state.recordNumberValidationState}
                    >
                        <ControlLabel>Record Number {requiredLabel}</ControlLabel>
                        <FormControl
                            disabled
                            name="number"
                            type="text"
                            value={this.state.responseJson["number"]}
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
                            value={this.state.responseJson["title"]}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                        { this.state.titleValidationState === "error"
                            ?<HelpBlock>{this.state.titleValidationMsg}</HelpBlock>
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
                            disabled
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
                    {/* TODO Classifications */}
                    <FormGroup
                        controlId="formControlsSelect "
                        onChange={this.handleChange}
                        validationState={this.state.classificationValidationState}
                    >
                        <ControlLabel>Classification {requiredLabel} TODO</ControlLabel>
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
                    <FormGroup
                        controlId="formControlsSelect "
                        validationState={this.state.retentionValidationState}
                    >
                        <ControlLabel>Retention Schedule {requiredLabel} TODO</ControlLabel>
                        <FormControl name="retentionSchedule"
                                     componentClass="select"
                                     placeholder="select">
                            {listRetentionScheduleJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.retentionValidationState === "error"
                            ?<HelpBlock>{this.state.retentionValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formControlsSelect "
                        onChange={this.handleChange}
                        validationState={this.state.stateValidationState}

                    >
                        <ControlLabel>State {requiredLabel} TODO</ControlLabel>
                        <FormControl name="state"
                                     componentClass="select"
                                     placeholder="select">
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Archived - Local</option>
                            <option>Archived - Interim</option>
                            <option>Destroyed</option>
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.containerValidationState === "error"
                            ?<HelpBlock>{this.state.containerValidationMsg}</HelpBlock>
                            :null
                        }
                    </FormGroup>
                    <FormGroup
                        validationState={this.state.containerValidationState}
                    >
                        <ControlLabel>Container Number TODO</ControlLabel>
                        <FormControl
                            name="containerId"
                            type="text"
                            value={this.state.responseJson["container"]}
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
                            value={this.state.responseJson['consignmentCode']}
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
                            value={this.state.responseJson['notes']}
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

export default UpdateRecord;