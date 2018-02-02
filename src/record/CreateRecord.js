import React from 'react';
import {Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'

class CreateRecord extends React.Component{

    constructor(props) {
        super(props);
        this.state =
            {
                recordType:"",
                recordNumber: "",
                title:"",
                location: "Burnaby",
                recordJson:{"Subject":"KKK-yyyy/ggg","AE CORP - CEO - BOARD MINUTES":"KKK-XXXXXXXXXXXXXXXXXXXXXX"},
                checked: false
            };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
        //Obtain record number from dropdown and set state recordNumber
        if(e.target.name === "recordType") {
            for(var k in this.state.recordJson) {
                if(k === e.target.value) {
                    this.setState({recordNumber:this.state.recordJson[k]});
                    break;
                }
            }
        }
    }

    handleSubmit(event) {
        alert('Form has been submitted');
        event.preventDefault();
    }
    dropdownRecordType() {
        let keys = [];
        for (var k in this.state.recordJson) {
            keys.push(<option key={k} value={k}>{k}</option>);
        }
        return keys;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="formControlsSelect " onChange ={this.handleChange}>
                    <ControlLabel>Record Type*</ControlLabel>
                    <FormControl name="recordType" componentClass="select" placeholder="select">
                        {this.dropdownRecordType()}
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
                </FormGroup>;
                <Button type="submit">Submit</Button>
            </form>
        )
    }
}
export default CreateRecord;