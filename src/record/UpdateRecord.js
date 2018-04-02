import React, {Component} from 'react';
import {Button, ButtonGroup, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Popover, OverlayTrigger} from 'react-bootstrap';
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

                classificationValidationMsg:"",
                classificationValidationState:"success",
                classification: null,
                classificationBack:[],
                classificationParentHistory:["(Select Record Type)"],
                classificationParent:"(Select Record Type)",
                classificationAtLeaf: false,

                retentionValidationMsg:"",
                retentionValidationState:"success",
                retentionSchedule:null,
                retentionScheduleName:"",

                stateValidationMsg:"",
                stateValidationState:"success",
                stateId:null,

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
                this.setState({retentionSchedule: data.scheduleId});
                this.setState({retentionScheduleName:data.schedule});
                this.setState({stateId: data.stateId});
                this.setState({consignmentCode:data.consignmentCode});
                this.setState({notes:data.notes});
                this.setState({containerId: data.containerId});
                data.classIds.forEach( id => {
                   this.state.classificationBack.push(id.toString());
                });

                let classificationPath = data.classifications.split("/");
                classificationPath.forEach( path => {
                    this.state.classificationParentHistory.push(path);
                });
                this.setState({classificationParent: classificationPath[classificationPath.length-1]});
                getClassifications(data.classIds[data.classIds.length -1])
                    .then(response => response.json())
                    .then(data => {
                        this.setState({classificationResponse: data});
                    })
                    .catch(err => {
                        console.error("Error loading record: " + err.message);
                        this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
                    });
                if (data && !data.exception) {
                    setData(that, data);
                }
            })
            .catch(err => {
                this.setState({alertMsg:"The application was unable to connect to the network. Please try again later."})
                window.scrollTo(0, 0)
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
                let splice_data = data;
                if(this.state.retentionScheduleName !== null) {
                    splice_data.splice(3,1);
                }
                else {
                    splice_data.splice(1,1);
                    splice_data.splice(4,1);
                }
                this.setState({recordStateResponse: splice_data});
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
                    const length = this.state.recordNumber.length;
                    if (length >= 1) {
                        this.setState({recordNumberValidationState: 'success'});
                    }
                    else {
                        this.setState({recordNumberValidationState: 'error'});
                        this.setState({recordNumberValidationMsg: 'Record Number should be pre-filled. Please notify the developers.'});
                    }
                }
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

                if(e.target.name === "location") {
                    const length = this.state.location.length;
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
                            }
                            if(this.state.classificationBack.length >=2) {
                                this.setState({classificationValidationState:"success"});
                            }
                            else{
                                this.setState({classificationValidationState:null});
                            }
                        })
                        .catch(err => {
                            console.error("Error loading record: " + err.message);
                            this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
                        });
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
                    if (data.status === 401 ||data.status === 400||data.status === 404||data.status === 500) {
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
                    this.setState({classificationAtLeaf:false});
                }
                else {
                    this.setState({classificationAtLeaf:true});
                }
                if(this.state.classificationBack.length >=2) {
                    this.setState({classificationValidationState:"success"});
                }
                else{
                    this.setState({classificationValidationState:null});
                }
            })
            .catch(error => {
                this.setState({alertMsg:"The application was unable to connect to the network. Please try again later."})
                window.scrollTo(0, 0)
            })
    }

    resetClassification(){
        getClassifications()
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
        document.getElementById("formClassification").value = "0";
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
                        placeholder="Type in and select a retention schedule..."/>
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

        const popoverRightClassification = (
            <Popover
                id="popover-positioned-scrolling-right"
                title="How to use"
            >
                The dropdown will dynamically update on each selection. Please keep selecting until there are at least two classifications in the path and the box turns green.
                <br/>
                <br/>
                <i className="fa fa-arrow-left"/>&nbsp;&nbsp;Back to parent selection
                <br/>
                <i className="fa fa-refresh"/>&nbsp;&nbsp;Refresh classification
            </Popover>
        );
        let formStyle = {
            margin: 'auto',
            width: '50%',
            padding: '10px',
            textAlign:'left'
        }
        let classificationDefault = {
            color:'red',
        }

        let tooltipStyle = {
            padding: '0',
            background: 'white',
            border: 'none',
            float: 'right',
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
                        <OverlayTrigger
                            trigger="click"
                            placement="right"
                            overlay={popoverRightClassification}
                        >
                            <Button style={tooltipStyle}>
                                <i className="fa fa-question-circle"></i>
                            </Button>
                        </OverlayTrigger>
                        <FormControl name="classification"
                                     componentClass="select"
                                     placeholder="select"
                        >
                            <option style={classificationDefault} value="0" disabled selected>{this.state.classificationParent}</option>
                            {listClassificationJson}
                        </FormControl>
                        <ButtonGroup>
                            <Button onClick={this.backClassification}>
                                <i className="fa fa-arrow-left"/>
                            </Button>
                            <Button onClick={this.resetClassification}>
                                <i className="fa fa-refresh"/>
                            </Button>
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
                        { this.state.retentionValidationState === "error"
                            ?<HelpBlock>{this.state.retentionValidationMsg}</HelpBlock>
                            :<br/>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formState"
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
                        { this.state.stateValidationState === "error"
                            ?<HelpBlock>{this.state.stateValidationMessage}</HelpBlock>
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
