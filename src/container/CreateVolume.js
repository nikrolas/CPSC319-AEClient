import React, {Component} from 'react';
import {Button, Alert} from 'react-bootstrap';

class CreateVolume extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                success: false,
                alertMsg: "",
                title: "",
                location: this.getUserLocations()[0], //TODO://set user default location
                locations: this.getUserLocations(),
                destructionDate: this.getDestructionDate(),
                notes: "",
                selectedRecord: this.getSelectedRecord(props.resultsData, props.selectedItemIndexes),
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getSelectedRecord = (record, selection) => {
        //TODO: handle case when a container is also selected This component only handles records
        let index = selection[0];
        if (record[index] && record[index].hasOwnProperty('number')) {
            record[index].notes = "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
            return record[index];
        }
    };

    getUserLocations = () => {
        //TODO: retreive user locations
        return ["Burnaby", "Vancouver", "Richmond"];
    };

    getDestructionDate = () => {
        //TODO: get destruction date of selected records
        return "September 12, 2010 6:52PM";
    };

    //TODO - Validationstate is working but will have to likely create many for different validations
    getValidationState() {

    };

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit(event) {
        const formData = (({title, location, notes, selectedRecord}) => ({
            title,
            location,
            notes,
            selectedRecord
        }))(this.state);

        let selectedRecordId = formData.selectedRecord.id;
        formData.selectedRecord = selectedRecordId;

        /*createContainer(formData, 5).then(response => {
            return response.json();
        }).then(data => {
            this.setState({success: false});
            this.setState({alertMsg: "Endpoint not implemented."});
            window.scrollTo(0, 0)
        }).catch(err => {
            this.setState({success: false});
            this.setState({alertMsg: "Endpoint not implemented."});
            window.scrollTo(0, 0)
        });*/
        event.preventDefault();
    }

    displayRecord = () => {
        let record = this.state.selectedRecord;
        if (record) {
            let newRecordNum = record.number + ":";
            return <li style={{fontSize: '25px'}}>
                {record.number}
                <i className="fa fa-long-arrow-right" style={styles.arrow}/>
                {newRecordNum}
            </li>;
        }
    };

    render() {
        /*const listLocationsJson = this.state.locations.map((item, i) =>
            <option key={i} value={item}>{item}</option>);
        const destructionDate = <div>{this.state.destructionDate}</div>;
        const requiredLabel = <span style={{color: 'red'}}>(Required)</span>;*/
        const {selectedRecord} = this.state;

        return (
            <div>
                {this.state.alertMsg.length !== 0 && !this.state.success
                    ? <Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                {this.state.alertMsg.length !== 0 && this.state.success
                    ? <Alert bsStyle="success"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }


                <h1 style={{color: 'red'}}>UNDER CONSTRUCTION (WIP)</h1>
                <h2>New Volume</h2>
                <h6>{JSON.stringify(selectedRecord)}</h6>
                <form onSubmit={this.handleSubmit} style={styles.form}>
                    <ul className="list-group" style={styles.list}>
                        {this.displayRecord()}
                    </ul>
                    <div className="checkbox" style={styles.checkwrap}>
                        <div>
                            <label style={{fontSize: '15px'}}>
                                <input type="checkbox" style={{transform: 'scale(1.2,1.2)'}}/> Copy Notes:
                            </label>
                        </div>
                        <textarea readonly="true" style={styles.notes}>{selectedRecord ? selectedRecord.notes : null}</textarea>
                    </div>
                    <div>
                        <Button type="submit">Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        )
    }
}

let styles = {
    container: {
        margin: "10px",
    },
    form: {
        border: '2px solid gray',
        margin: 'auto',
        width: '50%',
        padding: '10px',
        alignItems: 'center',
    },
    list: {
        fontSize: '25px',
        listStyle: 'none',
    },
    arrow: {
        fontSize: '25px',
        transform: 'scale(2, 2)',
        marginLeft: '1cm',
        marginRight: '1cm',
        color: '#79ff46',
    },
    notes: {
        width: '85%',
        overflowY: 'auto',
        minWidth: '50%',
        maxWidth: '100%',
        minHeight: '1cm',
    },
    checkwrap: {
        //border: '2px solid blue',
    },
};

export default CreateVolume;
