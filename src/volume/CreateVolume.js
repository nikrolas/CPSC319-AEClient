import React, {Component} from 'react';
import {Button, Alert} from 'react-bootstrap';
import {getVolumesByNumber, createVolume} from "../api/VolumesApi";
import {MdCreateNewFolder} from 'react-icons/lib/md';
import PropTypes from 'prop-types';

class CreateVolume extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                user: props.userData,
                timeout: null,
                success: false,
                alertMsg: "",
                location: this.getUserLocations()[0], //TODO://set user default location
                locations: this.getUserLocations(),
                notes: "",
                copy: false,
                selectedRecord: this.getSelectedRecord(props.resultsData, props.selectedItemIndexes),
                volumes: [],
                numbers: [],
            };
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    static contextTypes = {
        router: PropTypes.object
    };

    componentWillMount() {
        if (!this.state.success) {
            if (this.state.selectedRecord)
                this.search(this.state.selectedRecord.number.split(":")[0]);
            else {
                if (!this.state.timeout) {
                    this.setState({
                            alertMsg: "Nothing selected. Redirecting..",
                            timeout: setTimeout(() => {
                                this.context.router.history.goBack();
                            }, 2000)
                        }
                    );
                    window.scrollTo(0, 0);
                }
            }
        }
    }
    search = (searchString) => {
        getVolumesByNumber(searchString, this.state.user.id)
            .then(response => {
                //console.log(response);
                return response.json()
            })
            .then(data => {
                if (data.error) {
                    let msg = data.status + ": " + data.error;
                    this.setState({alertMsg: msg});
                    window.scrollTo(0, 0)
                }
                else if (data.status && data.status !== 200) {
                    this.setState({alertMsg: data.message});
                    window.scrollTo(0, 0)
                }
                else if (data && data.length > 0) {
                    data.sort((a,b) => this.naturalCompare(a.number,b.number));
                    let numbers = [];
                    data.forEach((volume) => {
                        numbers.push(volume.number);
                    });
                    let notes = data[data.length -1].notes;
                    this.setState({volumes: data, numbers, notes});
                }
            })
            .catch(err => {
                console.error("Error loading volumes: " + err.message);
            });
    };
    naturalCompare = (a, b) => {
        let ax = [], bx = [];

        a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
        b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

        while(ax.length && bx.length) {
            let an = ax.shift();
            let bn = bx.shift();
            let nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if(nn) return nn;
        }

        return ax.length - bx.length;
    };

    componentWillUnmount() {
        if (this.state.timeout)
            clearTimeout(this.state.timeout);
    }

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

    handleCancel(event) {
        if (!this.state.timeout) {
            this.setState({
                timeout: setTimeout(() => {
                    this.context.router.history.goBack();
                }, 1500),
                success: false,
                alertMsg: "Cancelled. Redirecting..",
            });
            window.scrollTo(0, 0);
        }

        event.preventDefault();
    }

    handleSubmit(event) {
        let {volumes, copy} = this.state;

        let latest = volumes[volumes.length - 1];
        let id = null;
        if (latest) {
            id = latest.id;
        }
        createVolume(id, copy, this.state.user.id)
        .then(response => {
            //console.log(response);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                let msg = data.status + ": " + data.error;
                this.setState({alertMsg: msg});
                window.scrollTo(0, 0)
            }
            else if(data.status && data.status !== 200) {
                //console.log(JSON.stringify(data));
                this.setState({alertMsg: data.message});
                window.scrollTo(0, 0)
            }
            else {
                if (!this.state.timeout) {
                    this.setState({
                        timeout: setTimeout(() => {
                            this.props.history.push("/viewRecord/" + data.id);
                        }, 2000),
                        success: true,
                        alertMsg: "Success",
                    });
                    window.scrollTo(0, 0);
                }
            }
        })
        .catch(error => {
            this.setState({alertMsg:"The application was unable to connect to the network. Please try again later."});
            window.scrollTo(0, 0)
        });

        event.preventDefault();
    }

    handleClick(event, index) {
            let routePath = "/viewRecord/" + this.state.volumes[index].id;
            this.props.history.push(routePath);
            event.preventDefault();
    };

    displayVolumes = () => {
        if (this.state.volumes.length > 0) {
            return this.state.numbers.map((number, index) => {
                if (index === 0 && !number.includes(":")) {
                    return <li key={index} style={{fontSize: '25px'}}>
                        <span style={{color: '#79ff46'}}>UPDATE:&ensp;</span>
                        <a onClick={(e) => this.handleClick(e, index)}>{number}</a>
                        <i className="fa fa-long-arrow-right" style={styles.arrow}/>
                        {this.newVolNum(0)}
                    </li>
                }
                else return <li key={index} style={{fontSize: '25px'}}>
                    <a onClick={(e) => this.handleClick(e, index)}>{number}</a>
                </li>
            });
        }
    };
    displayNew = () => {
        if (this.state.volumes.length > 0)
            return <li style={{fontSize: '25px', listStyle: 'none'}}>
                <MdCreateNewFolder style={styles.add}/>
                    <span style={{color: '#2f8bff'}}>
                        NEW:&ensp;
                    </span>
                    {this.newVolNum(this.state.numbers.length)}
                </li>
    };
    newVolNum = (n) => {
        let numbers = this.state.numbers;
        let arr = [];
        if (n < numbers.length && numbers[n])
            arr = numbers[n].split(":");
        else if (numbers[n-1])
            arr = numbers[n-1].split(":");

        let num = arr[0] + ":";
        let vol = arr[1] ? Number(arr[1]) : n;
        let newvol = vol + 1;
        if (newvol >= 10)
            num += newvol;
        else num += "0" + newvol;
        return num;
    };

    render() {
        return (
            <div style={styles.container}>
                {this.state.alertMsg.length !== 0 && !this.state.success
                    ? <Alert bsStyle="danger"><h4 style={{fontSize: '25px'}}>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                {this.state.alertMsg.length !== 0 && this.state.success
                    ? <Alert bsStyle="success"><h4 style={{fontSize: '25px'}}>{this.state.alertMsg}</h4></Alert>
                    : null
                }

                <h1>New Volume</h1>
                <div style={styles.form}>
                    <ul className="list-group" style={styles.list}>
                        {this.displayVolumes()}
                    </ul>
                    {this.displayNew()}
                    <div className="checkbox" style={styles.checkwrap}>
                        <div>
                            <label style={{fontSize: '15px'}}>
                                <input type="checkbox" style={{transform: 'scale(1.2,1.2)'}}
                                       checked={this.state.copy}
                                       onChange={(e) => this.setState({copy: e.target.checked})}/>
                                Copy notes from last volume:
                            </label>
                        </div>
                        <textarea readOnly="true"
                                  style={this.state.notes === "" ? styles.notes : styles.notes2}
                                  value={this.state.notes}/>
                    </div>
                    <div>
                        <Button bsStyle="danger" onClick={this.handleCancel}>Cancel</Button>
                        &ensp;
                        <Button bsStyle="primary" onClick={this.handleSubmit}>Create</Button>
                    </div>
                </div>
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
        padding: '5%',
        width: '70%',
        alignItems: 'center',
        boxShadow: '-5px 5px 10px gray',
    },
    list: {
        fontSize: '25px',
        listStyle: 'none',
        maxHeight: '8cm',
        overflowY: 'auto',
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
        transform: 'scale(1.55, 1.45)',
        verticalAlign: 'baseline',
        marginRight: '10px',
        color: '#2f8bff',
    },
    notes: {
        width: '75%',
        overflowY: 'auto',
        minWidth: '25%',
        maxWidth: '100%',
        minHeight: '1cm',
    },
    notes2: {
        width: '75%',
        height: '5cm',
        overflowY: 'auto',
        minWidth: '25%',
        maxWidth: '100%',
        minHeight: '1cm',
    },
    checkwrap: {
        //border: '2px solid blue',
    },
};

export default CreateVolume;
