import React from 'react';
import {Button, FormGroup, ControlLabel, FormControl,Checkbox} from 'react-bootstrap'

class CreateRecord extends React.Component{

    constructor(props) {
        super(props);
        this.state =
            {
                recordType:"",
                recordNumber: "",
                title:"",
                location: "Burnaby",
                classificationChildren:[],
                recordJson:[{
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
                classificationJson:[{
                    "id": "2",
                    "name": "COMPLIANCE",
                    "keyword": "F",
                    "updatedAt": "2003-10-10 19:00:48.000000",
                    "parent": "",
                    "children": [3,4,5]
                }, {
                    "id": "3",
                    "name": "SAMPLE",
                    "keyword": "G",
                    "updatedAt": "2003-10-10 19:00:52.000000",
                    "parent": 2,
                    "children": ""
                }]
                ,
                checked: false
            };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
        //When RecordType is changed, adjust record number
        if(e.target.name === "recordType") {
            for(var k in this.state.recordJson) {
                if(k === e.target.value) {
                    this.setState({recordNumber:this.state.recordJson[k]["numberPattern"]});
                    break;
                }
            }
        }
        //When Classification is changed, populate clickbox with proper children
        if(e.target.name === "classification") {
            for( k in this.state.classificationJson) {
                if(k === e.target.value) {
                    this.setState({classificationChildren:this.state.classificationJson[k]["children"]});
                    console.log(this.state.classificationChildren);
                    break;
                }
            }
        }
    }

    returnCheckboxes(){
        if(this.state.classificationChildren.length > 0) {
            return this.state.classificationChildren.map((item,i)=>
                <Checkbox inline key ={i} value = {i}>{item}</Checkbox>);
        }
        else {
            return null;
        }
    };

    handleSubmit(event) {
        alert('Form has been submitted');
        event.preventDefault();
    }

    render() {
        const listRecordTypeJson = this.state.recordJson.map((item,i)=><option key={i} value={i}>{item.name}</option>);
        const listClassificationJson= this.state.classificationJson.map((item,i)=>
            <option key={i} value={i}>{item.name}</option>);

        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="formControlsSelect " onChange ={this.handleChange}>
                    <ControlLabel>Record Type*</ControlLabel>
                    <FormControl name="recordType"
                                 componentClass="select"
                                 placeholder="select">
                        {listRecordTypeJson}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Location*</ControlLabel>
                    <FormControl
                        disabled
                        type="text"
                        value={this.state.location}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Record Number</ControlLabel>
                    <FormControl
                        name="recordNumber"
                        type="text"
                        value={this.state.recordNumber}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Title*</ControlLabel>
                    <FormControl
                        name="title"
                        type="text"
                        value={this.state.title}
                        placeholder="Enter text"
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="formControlsSelect " onChange ={this.handleChange}>
                    <ControlLabel>Classification</ControlLabel>
                    <FormControl name="classification"
                                 componentClass="select"
                                 placeholder="select">
                        {listClassificationJson}
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    {this.returnCheckboxes()}
                </FormGroup>
                <Button type="submit">Submit</Button>
            </form>
        )
    }
}
export default CreateRecord;