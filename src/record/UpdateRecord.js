import React, {Component} from 'react';
import {Button, ButtonGroup, FormGroup, ControlLabel, FormControl, HelpBlock, Alert} from 'react-bootstrap'
//import {getClassifications, getRecordById, getRetentionSchedule,getRecordStates, getUser, updateRecord} from "../APIs/RecordsApi";
import {
    getClassifications,
    getRecordById,
    getRetentionSchedule,
    getRecordStates,
    updateRecord
} from "../api/RecordsApi";
import {Typeahead} from 'react-bootstrap-typeahead';
import {getDateTimeString} from "../utilities/DateTime";

class UpdateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                alertMsg:"",

                user: props.userData,
                userLocations:null,

                recordNumberValidationMsg:"",
                recordNumberValidationState:"success",
                recordNumber: null,
                recordNumberPattern: null,

                titleValidationMsg:"",
                titleValidationState:"success",
                title: "",


                locationValidationMsg:"",
                locationValidationState:"success",
                location: null,


                //TODO Classifications
                classificationValidationMsg:"",
                classificationValidationState:"success",
                classification: null,
                classificationBack:[],
                classificationParentHistory:["(Select Record Type)"],
                classificationParent:"(Select Record Type)",
                classificationAtLeaf: false,

                //TODO RetentionSechdule
                retentionValidationMsg:"",
                retentionValidationState:"success",
                retentionSchedule:null,
                retentionScheduleName:"",


                //TODO State
                stateValidationMsg:"",
                stateValidationState:"success",
                stateId:null,

                containerValidationMsg:"",
                containerValidationState:"success",
                container: null,


                consignmentCodeValidationMsg:"",
                consignmentCodeValidationState:"success",
                consignmentCode: null,

                notesValidationMsg:"",
                notesValidationState:"success",
                notes:null,


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

                classificationResponse: null,
                retentionScheduleResponse:null,
                recordStateResponse:null,
            };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.backClassification = this.backClassification.bind(this);
        this.resetClassification = this.resetClassification.bind(this);
    }
    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordById(this.props.match.params.recordId, this.state.user.id)
            .then(response => response.json())
            .then(data => {
                this.setState({recordNumber: data.number});
                this.setState({title: data.title});
                this.setState({location: data.locationId});
                //Classification
                this.setState({retentionSchedule: data.scheduleId});
                this.setState({retentionScheduleName:data.schedule});
                this.setState({stateId: data.stateId});
                this.setState({container:data.container});
                this.setState({consignmentCode:data.consignmentCode});
                this.setState({notes:data.notes});
                if (data && !data.exception) {
                    setData(that, data);
                }
            })
            .catch(err => {
            console.error("Error loading record: " + err.message);
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
        getRecordStates()
            .then(response => response.json())
            .then(data => {
                this.setState({recordStateResponse: data});
            })
            .catch(err => {
                console.error("Error loading record: " + err.message);
                this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
            });
        if (this.state.user !== undefined && this.state.user !== null) {
            this.setState({userLocations: this.state.user.locations});
            this.setState({location: this.state.user.locations[0].locationId})
        }
    }

    setData = (context, data) => {
        let keys = Object.keys(data);
        keys.forEach( key => {
            if (key.endsWith("At")) {
                data[key] = getDateTimeString(new Date(data[key]).toTimeString());
            }
        });
        context.setState({"responseJson": data});
    };

    handleChange(e) {
        if(Array.isArray(e)){
            if(e.length > 0) {
                this.setState({retentionSchedule: e[0].id}, ()=> {
                    this.setState({retentionValidationState: 'success'});
                });
            }
            else {
                this.setState({retentionValidationState: 'error'});
                this.setState({retentionValidationMsg:'Please select a retention schedule from the dropdown'});
            }
        }
        else {
            e.persist();
            this.setState({[e.target.name]: e.target.value}, ()=> {
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
                if(e.target.name === "classification") {
                    getClassifications(this.state.classification)
                        .then(response => response.json())
                        .then(data => {
                            if(data.length >0) {
                                if (this.state.classificationAtLeaf) {
                                    let parentHistory =  this.state.classificationParentHistory;
                                    let backHistory = this.state.classificationBack;
                                    parentHistory[parentHistory.length-1] = e.target.options[e.target.selectedIndex].text;
                                    backHistory[backHistory.length-1]=this.state.classification;
                                    this.setState({classificationParent:e.target.options[e.target.selectedIndex].text});
                                    this.setState({classificationParentHistory: parentHistory});
                                    this.setState({classificationBack: backHistory});
                                    document.getElementById("formClassification").value = "0";
                                    this.setState({classificationResponse: data});
                                }
                                else {
                                    this.state.classificationParentHistory.push(e.target.options[e.target.selectedIndex].text);
                                    this.setState({classificationParent:e.target.options[e.target.selectedIndex].text});
                                    this.state.classificationBack.push(this.state.classification);
                                    document.getElementById("formClassification").value = "0";
                                    this.setState({classificationResponse: data});
                                }
                                this.setState({classificationValidationState:null});
                                this.setState({classificationAtLeaf:false});

                            }
                            else {
                                if(!this.state.classificationAtLeaf) {
                                    this.state.classificationParentHistory.push(e.target.options[e.target.selectedIndex].text);
                                    this.state.classificationBack.push(this.state.classification);
                                }
                                else {
                                    let parentHistory =  this.state.classificationParentHistory;
                                    let backHistory = this.state.classificationBack;
                                    parentHistory[parentHistory.length-1] = e.target.options[e.target.selectedIndex].text;
                                    backHistory[backHistory.length-1]=this.state.classification;
                                    this.setState({classificationParentHistory: parentHistory});
                                    this.setState({classificationBack: backHistory});
                                }
                                this.setState({classificationAtLeaf:true});
                                this.setState({classificationValidationState:"success"});
                            }
                        })
                        .catch(err => {
                            console.error("Error loading record: " + err.message);
                            this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
                        });
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
                        this.setState({consignmentCode:null});
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
            updateRecord(this.props.match.params.recordId, this.state)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.status === 401) {
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
        this.state.classificationBack.pop();
        if (this.state.classificationParentHistory.length > 1) {
            this.state.classificationParentHistory.pop();
        }
        this.setState({classificationParent: this.state.classificationParentHistory[this.state.classificationParentHistory.length-1]});
        document.getElementById("formClassification").value = "0";
        getClassifications(this.state.classificationBack[this.state.classificationBack.length - 1])
            .then(response => response.json())
            .then(data => {
                if(data.length > 0) {
                    this.setState({classificationResponse: data});
                    this.setState({classificationValidationState: null});
                    this.setState({classificationAtLeaf:false});
                }
                else {
                    this.setState({classificationAtLeaf:true});
                    this.setState({classificationValidationState: "success"});
                }
            })
            .catch(error => {

            })
    }

    resetClassification(){
/*        getClassifications()
            .then(response => response.json())
            .then(data => {
                if(data.length >0) {
                    this.setState({classificationBack:[]});
                    this.setState({classificationParentHistory:["(Select Record Type)"]})
                    this.setState({classificationParent:"(Select Record Type)"});
                    this.setState({classificationValidationState:null});
                    this.setState({classificationResponse: data});
                }
            });
        document.getElementById("formClassification").value = "0";*/
    }

    render() {
        let listClassificationJson = null;
        let listLocationJson = null;
        let listRecordStatesJson = null;
        let retentionForm = null;
        let classificationPath = "";
        if (this.state.classificationResponse !== null) {
            listClassificationJson = this.state.classificationResponse.map((item, i) =>
                <option key={i} value={item.id}>{item.name}</option>);
        }
        if (this.state.recordStateResponse !== null) {
            listRecordStatesJson = this.state.recordStateResponse.map((item, i) =>
                <option key={i} value={item.id}>{item.name}</option>);
        }
        if (this.state.retentionScheduleResponse !== null) {
            if(this.state.retentionSchedule != null) {
                retentionForm =
                    <Typeahead
                        onChange={this.handleChange}
                        defaultInputValue = {this.state.retentionScheduleName}
                        labelKey={option => `${option.name} ${option.code.trim()}`}
                        options={this.state.retentionScheduleResponse}
                        placeholder="Choose a state..."/>
            }
        }
        if (this.state.classificationParentHistory.length > 1) {
            for(let i = 1; this.state.classificationParentHistory.length > i; i++) {
                if(i===1) {
                    classificationPath += this.state.classificationParentHistory[i];

                }
                else {
                    classificationPath += "/" + this.state.classificationParentHistory[i];
                }
            }
        }
        if (this.state.userLocations !== null) {
            listLocationJson = this.state.userLocations.map((item, i) =>
                <option key={i} value={item.locationId}>{item.locationName}</option>);
        }

        const requiredLabel = <span style={{color:'red'}}>(Required)</span>;

        let formStyle = {
            margin: 'auto',
            width: '50%',
            padding: '10px',
            textAlign:'left'
        }
        let classificationDefault = {
            color:'red',
        }

        return (
            <div>
                {this.state.alertMsg.length !== 0
                    ?<Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    :null
                }
                <h1>Update Record</h1>
                <h2>{this.state.recordNumber}</h2>
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
                            value={this.state.recordNumber}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                        { this.state.recordNumberValidationState === "error"
                            ?<HelpBlock>{this.state.recordNumberValidationMsg}</HelpBlock>
                            :<br/>
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
                            :<br/>
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
                            :<br/>
                        }
                    </FormGroup>
                    {/* TODO Classifications */}
                    <FormGroup
                        controlId="formClassification"
                        onChange={this.handleChange}
                        validationState={this.state.classificationValidationState}
                    >
                        <ControlLabel>Classification {requiredLabel} <br/> {classificationPath} </ControlLabel>
                        <FormControl name="classification"
                                     componentClass="select"
                                     placeholder="select"
                        >
                            <option style={classificationDefault} value="0" disabled selected>{this.state.classificationParent}</option>
                            {listClassificationJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        <ButtonGroup>
                            <Button onClick={this.backClassification}>Back</Button>
                            <Button onClick={this.resetClassification}>Reset</Button>
                        </ButtonGroup>
                        { this.state.classificationValidationState === "error"
                            ?<HelpBlock>{this.state.classificationValidationMsg}</HelpBlock>
                            :<p>&nbsp;</p>
                        }
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect"
                               validationState={this.state.retentionValidationState}>
                        <ControlLabel>Retention Schedule {requiredLabel}</ControlLabel>
                        {retentionForm}
                        <FormControl.Feedback/>
                        { this.state.retentionValidationState === "error"
                            ?<HelpBlock>{this.state.retentionValidationMsg}</HelpBlock>
                            :<br/>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formControlsSelect "
                        onChange={this.handleChange}
                        validationState={this.state.stateValidationState}

                    >
                        <ControlLabel>State {requiredLabel}</ControlLabel>
                        <FormControl name="stateId"
                                     componentClass="select"
                                     placeholder="select"
                                     value = {this.state.stateId}
                        >
                            {listRecordStatesJson}
                        </FormControl>
                        <FormControl.Feedback/>
                        { this.state.containerValidationState === "error"
                            ?<HelpBlock>{this.state.containerValidationMsg}</HelpBlock>
                            :<br/>
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
                            :<br/>
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
                            :<br/>
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
                            :<br/>
                        }
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        )
    }
}

export default UpdateRecord;
