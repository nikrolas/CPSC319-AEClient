import React, {Component} from 'react';
import {Button, Alert} from 'react-bootstrap';
import {createVolume, getRecordsByNumber} from "../APIs/RecordsApi";

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
                copy: false,
                selectedRecord: this.getSelectedRecord(props.resultsData, props.selectedItemIndexes),
                volumes: [],
                numbers: [],
            };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (this.state.selectedRecord)
            this.search(this.state.selectedRecord.number.split(":")[0]);
    }
    search = (searchString) => {
        getRecordsByNumber(searchString)
            .then(response => {
                //console.log(response);
                return response.json()
            })
            .then(data => {
                //console.log(JSON.stringify(data));
                if (data && data.length > 0) {
                    data.sort((a,b) => a.number > b.number);
                    let numbers = [];
                    data.forEach((volume) => {
                        numbers.push(volume.number);
                    });
                    //console.log(JSON.stringify(numbers));
                    let notes = data[data.length-1].notes;
                    this.setState({volumes: data, numbers, notes});
                }
            })
            .catch(err => {
                console.error("Error loading search results: " + err.message);
            });

        /*let data = mockData2;
        data.sort((a,b) => a.number > b.number);
        let numbers = [];
        data.forEach((volume) => {
            numbers.push(volume.number);
        });
        let notes = data[data.length-1].notes;
        this.setState({volumes: data, numbers, notes});*/

    };

    getSelectedRecord = (record, selection) => {
        let index = selection[0];
        if (record[index] && record[index].hasOwnProperty('number')) {
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

    getValidationState() {};

    handleChange() {};

    handleSubmit(event) {
        let {volumes, numbers, copy} = this.state;

        let last = volumes[volumes.length - 1];
        let latest = Object.assign({}, last);
        if (!this.state.copy) {
            latest.notes = "";
        }
        latest.number = this.newVolNum(numbers.length);
        latest['copyNotes'] = copy;

        createVolume(latest)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.status === 500) {
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
        event.preventDefault();
    }

    displayVolumes = () => {
        if (this.state.volumes.length < 1)
            return;

        let display = this.state.numbers.map((number, index) => {
            if (index === 0 && !number.includes(":")) {
                return <li style={{fontSize: '25px'}}>
                    {number}
                    <i className="fa fa-long-arrow-right" style={styles.arrow}/>
                    {this.newVolNum(0)}
                </li>
            }
            else return <li style={{fontSize: '25px'}}> {number} </li>
        });
        display.push(
            <li style={{fontSize: '25px'}}>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                <i className="material-icons" style={styles.add}>create_new_folder</i>
                {this.newVolNum(this.state.numbers.length)}
            </li>
        );
        return display;
    };

    newVolNum = (i) => {
        let numbers = this.state.numbers;
        let arr = [];
        if (i < numbers.length && numbers[i])
            arr = numbers[i].split(":");
        else if (numbers[i-1])
            arr = numbers[i-1].split(":");

        let num;
        if (arr[1]) {
            if (arr[1].startsWith("0"))
                num = arr[0] + ":0" + (Number(arr[1]) + 1);
            else num = arr[0] + ":" + (Number(arr[1]) + 1);
        }
        else num = arr[0] + ":0" + (i+1);
        return num;
    };

    render() {
        /*const listLocationsJson = this.state.locations.map((item, i) =>
            <option key={i} value={item}>{item}</option>);
        const destructionDate = <div>{this.state.destructionDate}</div>;
        const requiredLabel = <span style={{color: 'red'}}>(Required)</span>;*/
        const {notes} = this.state;

        return (
            <div style={styles.container}>
                {this.state.alertMsg.length !== 0 && !this.state.success
                    ? <Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                {this.state.alertMsg.length !== 0 && this.state.success
                    ? <Alert bsStyle="success"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }

                <h2>New Volume</h2>
                <form onSubmit={this.handleSubmit} style={styles.form}>
                    <ul className="list-group" style={styles.list}>
                        {this.displayVolumes()}
                    </ul>
                    <div className="checkbox" style={styles.checkwrap}>
                        <div>
                            <label style={{fontSize: '15px'}}>
                                <input type="checkbox" style={{transform: 'scale(1.2,1.2)'}}
                                       checked={this.state.copy}
                                       onChange={(e) => this.setState({copy: e.target.checked})}/>
                                Copy Notes to New Volume:
                            </label>
                        </div>
                        <textarea readonly="true" style={styles.notes}>{notes !== "" ? notes : null}</textarea>
                    </div>
                    <div>
                        <Button type="submit">Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
                {/*<h6>{JSON.stringify(this.state.copy)}</h6>
                <h6>{JSON.stringify(this.state.numbers)}</h6>
                <h6>{JSON.stringify(this.newVolNum(this.state.numbers.length))}</h6>*/}
            </div>
        )
    }
}

let styles = {
    container: {
        margin: "0 5% 5% 5%",
    },
    form: {
        border: '1px solid gray',
        margin: 'auto',
        width: '70%',
        padding: '10px',
        alignItems: 'center',
        boxShadow: '-5px 5px 10px gray',
    },
    list: {
        fontSize: '25px',
        listStyle: 'none',
    },
    arrow: {
        fontSize: '25px',
        transform: 'scale(1.5, 1.5)',
        marginLeft: '0.5cm',
        marginRight: '0.5cm',
        color: '#79ff46',
    },
    add: {
        fontSize: '20px',
        transform: 'scale(1.5, 1.5)',
        marginRight: '0.5cm',
        color: '#2f8bff',
    },
    notes: {
        width: '75%',
        overflowY: 'auto',
        minWidth: '25%',
        maxWidth: '100%',
        minHeight: '1cm',
    },
    checkwrap: {
        //border: '2px solid blue',
    },
};

let mockData = [
    {
        "title": "Pfeffer, Haag and Kihn - Et commodi at - Voluptatem consequuntur et ut sapiente dolor",
        "number": "20073454.00.P.01.00:01",
        "scheduleId": 638,
        "typeId": 83,
        "consignmentCode": "507202590",
        "containerId": 45719,
        "locationId": 5,
        "classifications": "PROJECT MANAGEMENT/ENGINEERING AGREEMENTS",
        "notes": "",
        "id": 31865,
        "stateId": 4,
        "createdAt": 1192147200000,
        "updatedAt": 1233100800000,
        "closedAt": 1224460800000,
        "location": "Edmonton",
        "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
        "type": "Project",
        "state": "Archived - Interim",
        "container": "2008/259-EDM",
        "scheduleYear": 15
    },
    {
        "title": "Frami Group - Sed soluta ut vitae quia omnis",
        "number": "20073454.00.P.01.00:02",
        "scheduleId": 638,
        "typeId": 83,
        "consignmentCode": "507202590",
        "containerId": 45719,
        "locationId": 5,
        "classifications": "PROJECT MANAGEMENT/ENGINEERING AGREEMENTS/Project Initiation and Closure",
        "notes": "",
        "id": 31866,
        "stateId": 4,
        "createdAt": 1192147200000,
        "updatedAt": 1233100800000,
        "closedAt": 1224460800000,
        "location": "Edmonton",
        "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
        "type": "Project",
        "state": "Archived - Interim",
        "container": "2008/259-EDM",
        "scheduleYear": 15
    },
    {
        "title": "Orn - Wuckert - Vitae nesciunt dolor ea ea quia",
        "number": "20073454.00.P.01.00:04",
        "scheduleId": 638,
        "typeId": 83,
        "consignmentCode": "507202590",
        "containerId": 45719,
        "locationId": 5,
        "classifications": "CONSTRUCTION SERVICES/CONSTRUCTION INSPECTION",
        "notes": "notes from 20073454.00.P.01.00:04",
        "id": 31868,
        "stateId": 4,
        "createdAt": 1192147200000,
        "updatedAt": 1233100800000,
        "closedAt": 1224460800000,
        "location": "Edmonton",
        "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
        "type": "Project",
        "state": "Archived - Interim",
        "container": "2008/259-EDM",
        "scheduleYear": 15
    },
    {
        "title": "Block and Sons - Dolore et debitis - Ex quos ut quasi",
        "number": "20073454.00.P.01.00:03",
        "scheduleId": 638,
        "typeId": 83,
        "consignmentCode": "507202590",
        "containerId": 45719,
        "locationId": 5,
        "classifications": "PROJECT MANAGEMENT/INVOICING AND REPORTING",
        "notes": "",
        "id": 31867,
        "stateId": 4,
        "createdAt": 1192147200000,
        "updatedAt": 1233100800000,
        "closedAt": 1224460800000,
        "location": "Edmonton",
        "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
        "type": "Project",
        "state": "Archived - Interim",
        "container": "2008/259-EDM",
        "scheduleYear": 15
    },
];

let mockData2 = [
    {
        "title": "Pfeffer, Haag and Kihn - Et commodi at - Voluptatem consequuntur et ut sapiente dolor",
        "number": "20073454.00.P.01.00",
        "scheduleId": 638,
        "typeId": 83,
        "consignmentCode": "507202590",
        "containerId": 45719,
        "locationId": 5,
        "classifications": "PROJECT MANAGEMENT/ENGINEERING AGREEMENTS",
        "notes": "notes from 20073454.00.P.01.00",
        "id": 31865,
        "stateId": 4,
        "createdAt": 1192147200000,
        "updatedAt": 1233100800000,
        "closedAt": 1224460800000,
        "location": "Edmonton",
        "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
        "type": "Project",
        "state": "Archived - Interim",
        "container": "2008/259-EDM",
        "scheduleYear": 15
    },
    ];

export default CreateVolume;
