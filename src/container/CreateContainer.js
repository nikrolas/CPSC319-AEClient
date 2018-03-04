import React, {Component} from 'react';
import {Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'

class CreateContainer extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                title: "",
                locations: ["Burnaby", "Vancouver", "Richmond"],
                destructionDate: "September 12, 2010 6:52PM", //TODO: Hardcoded date
                notes: "",
                records: props.selectedItems
            };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //TODO - Validationstate is working but will have to likely create many for different validations
    getValidationState() {

    }

    handleChange(e) {
    }

    handleSubmit(event) {
        alert('Form has been submitted');
        event.preventDefault();
    }

    render() {
        const listLocationsJson = this.state.locations.map((item, i) =>
            <option key={i} value={i}>{item}</option>);
        const destructionDate = <div>{this.state.destructionDate}</div>;
        const requiredLabel = <span style={{color: 'red'}}>(Required)</span>;

        return (
            <div style={{margin: '0 5% 0 5%'}}>
                <h1>New Container</h1>
                <b>Due for destruction</b>
                <div>{destructionDate}</div>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Title {requiredLabel}</ControlLabel>
                        <FormControl
                            name="title"
                            type="text"
                            value={this.state.title}
                            placeholder="Enter container title"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback/>
                    </FormGroup>
                    <FormGroup controlId="formControlsSelect " onChange={this.handleChange}>
                        <ControlLabel>Location {requiredLabel}</ControlLabel>
                        <FormControl name="location"
                                     componentClass="select"
                                     placeholder="select">
                            {listLocationsJson}
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Notes</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Enter notes"/>
                    </FormGroup>
                    <Button type="submit">Cancel</Button>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        )
    }
}

export default CreateContainer;
