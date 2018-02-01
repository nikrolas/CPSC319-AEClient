import React from 'react';
import {Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'

class CreateRecord extends React.Component{

    constructor(props) {
        super(props);
        this.state = {value: '',
                      location: "Burnaby"};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('Your favorite flavor is: ' + this.state.value);
        event.preventDefault();
    }
    createRecordType() {
        let items = ["Cat", "Dog", "Hamster"];
        //TODO populate with proper values
        for (let i = 0; i <= this.props.maxValue; i++) {
            items.push(<option key={i} value={i}>{i}</option>);
            //here I will be creating my options dynamically based on
            //what props are currently passed to the parent component
        }
        return items;
    }

    onDropdownSelected(e) {
        console.log("THE VAL", e.target.value);
    }
    render() {
        return (
            <form>
                <FormGroup controlId="formControlsSelect " onChange ={this.onDropdownSelected}>
                    <ControlLabel>Record Type*</ControlLabel>
                    <FormControl componentClass="select" placeholder="select">
                        {this.createRecordType()}
                    </FormControl>
                </FormGroup>
                <br/>
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
                <Button type="submit">Submit</Button>
            </form>
        )
    }
}
export default CreateRecord;