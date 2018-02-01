import React from 'react';

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
                <label>
                    Record Type*:
                    <br/>
                    <input type="select" onChange={this.onDropdownSelected} label="Multiple Select" multiple>
                        {this.createRecordType()}
                    </input>
                </label>
                <br/>
                <label>
                    Location*:
                    This will take location and be read only
                    <br/>
                    <input type="text" value={this.state.location} disabled />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
export default CreateRecord;