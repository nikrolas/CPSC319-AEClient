import React, {Component} from 'react';
import {
    Button,
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonGroup,
    HelpBlock,
    Alert,
    OverlayTrigger,
    Popover
} from 'react-bootstrap'
import {createRecord, getClassifications, getRecordType, getRetentionSchedule} from "../api/RecordsApi";
import {Typeahead} from 'react-bootstrap-typeahead';

class CreateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                alertMsg:"",

                user: props.userData,
                userLocations: null,

                recordTypeValidationMsg:"",
                recordTypeValidationState:null,
                recordType: null,
                recordTypeSelectionIndex:0,

                locationValidationMsg:"",
                locationValidationState:"success",
                location: null,
                locationSelectedIndex: 0,

                recordNumberValidationMsg:"",
                recordNumberValidationState:null,
                recordNumber: null,
                recordNumberPattern: null,

                titleValidationMsg:"",
                titleValidationState:null,
                title: "",

                classificationValidationMsg:"",
                classificationValidationState:null,
                classification: null,
                classificationBack:[],
                classificationParentHistory:["(Select Record Type)"],
                classificationParent:"(Select Record Type)",
                classificationAtLeaf: false,


                retentionValidationMsg:"",
                retentionValidationState:null,
                retentionSchedule:null,

                consignmentCodeValidationMsg:"",
                consignmentCodeValidationState:"success",
                consignmentCode: null,

                notesValidationMsg:"",
                notesValidationState:"success",
                notes:null,

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
        if (this.state.user !== undefined && this.state.user !== null) {
            this.setState({userLocations: this.state.user.locations});
            this.setState({location: this.state.user.locations[0].locationId})
        }
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
                    this.numberPatternRules(this.state.recordTypeResponse[e.target.selectedIndex-1]["numberPattern"]);
                    if(this.state.recordTypeResponse[e.target.selectedIndex-1]["defaultSchedule"]!== null) {
                        this._typeahead._updateText(this.state.recordTypeResponse[e.target.selectedIndex-1]["defaultSchedule"]);

                    }
                    this.setState({recordTypeSelectionIndex:e.target.selectedIndex-1});
                    const length = this.state.recordType.length;
                    if (length >= 1) {
                        this.setState({recordTypeValidationState: 'success'});
                    }
                    else {
                        this.setState({titleValidationState: null});
                    }
                }
                if(e.target.name === "location") {
                    this.setState({locationSelectedIndex: e.target.selectedIndex}, ()=> {
                        this.numberPatternRules(this.state.recordTypeResponse[this.state.recordTypeSelectionIndex]["numberPattern"]);
                    });
                    const length = this.state.location.length;
                    if (length >= 1) {
                        this.setState({locationValidationState: 'success'});
                    }
                    else {
                        this.setState({locationValidationState: null});
                    }
                }
                if(e.target.name === "recordNumber") {
                    const length = this.state.recordNumber.length;
                    if (length >= 1) {
                        this.setState({recordNumberValidationState: 'success'});
                    }
                    else {
                        this.setState({recordNumberValidationState: null});
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
                        });
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
        }
    }

    numberPatternRules(pattern) {
        let finalPattern = pattern;
        if(finalPattern.includes("KKK")){
            let capitalizedData = this.state.user.locations[this.state.locationSelectedIndex].locationCode.toUpperCase();
            finalPattern = finalPattern.replace(/^.{3}/g,capitalizedData);
        }
        if(finalPattern.includes("yyyy")){
            finalPattern = finalPattern.replace("yyyy", new Date().getFullYear().toString());
        }

        if(finalPattern.includes("ggg")) {
            let concat_pattern = finalPattern.substring(0, pattern.length-4);
            if(concat_pattern[concat_pattern.length -1] === "."){
                let concat_pattern_client  = concat_pattern.substring(0,concat_pattern.length-1);
                this.setState({recordNumberPattern: concat_pattern_client});
            }
            else {
                this.setState({recordNumberPattern: concat_pattern});
            }
        }
        else {
            this.setState({recordNumberPattern: finalPattern});
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
                    this.setState({classificationResponse: data});
                    this.setState({classificationValidationState:null});
                    this.setState({classification: null});
                    this.setState({classificationBack:[]});
                    this.setState({classificationParentHistory:["(Select Record Type)"]});
                    this.setState({classificationParent:"(Select Record Type)"});
                    this.setState({classificationAtLeaf:false});
                }
            });
        document.getElementById("formClassification").value = "0";
    }

    render() {
        let listRecordTypeJson = null;
        let listClassificationJson = null;
        let retentionForm = null;
        let listLocationJson = null;
        let classificationPath = "";
        if (this.state.recordTypeResponse !== null && !this.state.recordTypeResponse.error) {
            listRecordTypeJson = this.state.recordTypeResponse.map((item, i) => <option data-order={i} value={item.typeId}>{item.typeName}</option>);
        }
        if (this.state.classificationResponse !== null) {
            listClassificationJson = this.state.classificationResponse.map((item, i) =>
                <option key={i} value={item.id}>{item.name}</option>);
        }
        if (this.state.userLocations !== null) {
            listLocationJson = this.state.userLocations.map((item, i) =>
                <option key={i} value={item.locationId}>{item.locationName}</option>);
        }
        if (this.state.retentionScheduleResponse !== null) {
                retentionForm =
                    <Typeahead
                        ref={component => this._typeahead = component ? component.getInstance() : this._typeahead}
                        onChange={this.handleChange}
                        labelKey={option => `${option.name} ${option.code.trim()}`}
                        options={this.state.retentionScheduleResponse}
                        placeholder="Type in and select a retention schedule..."/>
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

        const requiredLabel = <span style={{color:'red'}}>(Required)</span>;

        const popoverRightRecordNumber = (
            <Popover
                id="popover-positioned-scrolling-right"
                title="Key Codes"
            >
                <strong>KKK:</strong> Location Code (generated)<br/>
                <strong>YYYY: </strong> Year (generated) <br/>
                <strong>X/Z:</strong> Alphanumeric <br/>
                <strong>N:</strong> Numeric digits <br/>
            </Popover>
        );
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
        //XXX and ZZZ is alphanumeric
        //KKK is location code
        //LL with client
        //GG is autogenerated
        //YY Year
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
                <h1>Create a New Record</h1>
                <form onSubmit={this.handleSubmit} style = {formStyle}>
                    <FormGroup
                        controlId="formRecordType"
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
                        { this.state.recordTypeValidationState === "error"
                            ?<HelpBlock>{this.state.recordTypeValidationMsg}</HelpBlock>
                            :<br/>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formLocation"
                        onChange={this.handleChange}
                        validationState={this.state.locationValidationState}
                    >
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl
                            name="location"
                            componentClass="select"
                            value = {this.state.location}
                        >
                        {listLocationJson}
                        </FormControl>
                        { this.state.locationValidationState === "error"
                            ?<HelpBlock>{this.state.locationValidationMsg}</HelpBlock>
                            :<br/>
                        }
                    </FormGroup>
                    <FormGroup
                        controlId="formRecordNumber"
                        validationState={this.state.recordNumberValidationState}
                    >
                        <ControlLabel>Record Number {requiredLabel}
                            <br/>
                                <div id="suggestedRecordNum">
                                    {this.state.recordNumberPattern}
                                </div>
                        </ControlLabel>
                        <OverlayTrigger
                            trigger="click"
                            placement="right"
                            overlay={popoverRightRecordNumber}
                        >
                            <Button style={tooltipStyle}>
                                <i className="fa fa-question-circle"></i>
                            </Button>
                        </OverlayTrigger>
                        <FormControl
                            name="recordNumber"
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
                        controlId="formTitle"
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
                        controlId="formConsignmentCode"
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
                        controlId="formNotes"
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

export default CreateRecord;
