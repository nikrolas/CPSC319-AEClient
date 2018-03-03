import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap'
import {getRecordById,updateRecord} from "../APIs/RecordsApi";

class UpdateRecord extends Component {

    constructor(props, context) {
        super(props, context);
        let mockDate = new Date(1127779200000).toTimeString();
        this.state =
            {
                recordType: "",
                recordNumber: "",
                title: "",
                state:"",
                containerNumber: "",
                consignmentCode: "",
                location: "Burnaby",
                notes:"",
                classificationChildren: [],
                responseJson:{
                    Id: 51,
                    Number: "EDM-2003/001",
                    title: "Sample Record",
                    ScheduleId: 26,
                    TypeId: 3,
                    ConsignmentCode: "DESTRUCTION CERTIFICATE 2009-01",
                    StateId: 6,
                    ContainerId: 24365,
                    LocationId: 5,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    closedAt: mockDate,
                    ClassificationIds: [3, 4, 5, 6],
                    state: "Active",
                    location: "AE Corporate Office - Edmonton - Accounting",
                    type: "AE CORP - ACCOUNTING - EDM - PROJECT BILLINGS",
                    consignmentCode: null,
                    schedule: "FINANCIAL MANAGEMENT - ACCOUNTING",
                    scheduleYear: 6,
                    Notes: "This is a note!"
                },
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
    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordById(this.props.match.params.recordId)
            .then(response => response.json())
            .then(data => {
                if (data && !data.exception) {
                    setData(that, data);
                }
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
    componentDidMount(){
    }
    //TODO - Validationstate is working but will have to likely create many for different validations
    getValidationState() {
/*        const length = this.state.recordNumber.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;*/
    }

    handleChange(e) {
        let responseCopy = JSON.parse(JSON.stringify(this.state.responseJson));
        responseCopy[e.target.name] = e.target.value;
        this.setState({responseJson:responseCopy});
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
        updateRecord(this.props.match.params.recordId, this.state)
            .then(result => console.log('success====:', result))
            .catch(error => console.log('error============:', error));
        event.preventDefault();
    }

    render() {
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
                <h1>Update Record</h1>
                <h2>{this.state.responseJson["number"]}</h2>
                <form onSubmit={this.handleSubmit}  style = {formStyle}>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
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
                    </FormGroup>
                    <FormGroup
                        validationState={this.getValidationState()}
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
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl
                            name="location"
                            type="text"
                            value={this.state.responseJson["location"]}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
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
                    <FormGroup
                        controlId="formControlsSelect "
                        onChange={this.handleChange}
                    >
                        <ControlLabel>State {requiredLabel}</ControlLabel>
                        <FormControl name="state"
                                     componentClass="select"
                                     placeholder="select">
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Archived - Local</option>
                            <option>Archived - Interim</option>
                            <option>Destroyed</option>
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
                            value={this.state.responseJson["consignmentCode"]}
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

export default UpdateRecord;