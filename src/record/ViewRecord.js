import React, {Component} from 'react';
import {getRecordById, deleteRecordByIds, updateRecord} from "../api/RecordsApi";
import {Row, Col, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {Confirm} from 'react-confirm-bootstrap'
import {getDateTimeString} from "../utilities/DateTime";
import {recordsResultsAccessors} from "../search/Results";
import {getColumns} from "../utilities/ReactTable";


class ViewRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                user: props.userData,
                alertMsg: "",
                success: true,
                recordJson: {
                    title: "",
                    number: "",
                    scheduleId: "",
                    typeId: "",
                    consignmentCode: "",
                    containerId: "",
                    locationId: "",
                    classifications: "",
                    notes: "",
                    id: "",
                    stateId: "",
                    createdAt: "",
                    updatedAt: "",
                    closedAt: "",
                    location: "",
                    schedule: "",
                    type: "",
                    state: "",
                    containerNumber: "",
                    scheduleYear: ""
                },
                onItemSelectCallback: props.onItemSelect,
                onDataUpdateCallback: props.onDataUpdate
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordById(this.props.match.params.recordId, this.state.user.id)
            .then(response => {
                if (response.status === 404) {
                    this.props.history.push("/notFound");
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data.status === 401 ||data.status === 400||data.status === 404||data.status === 500) {
                    let status = data.status ? data.status : "";
                    let err = data.error ? " " + data.error : "";
                    let msg = data.message ? ": " + data.message : "";
                    let alertMsg = status + err + msg;
                    this.setState({alertMsg, success: false});
                    //this.setState({alertMsg: data.message, success: false});
                    window.scrollTo(0, 0)
                }
                else if (data && !data.exception) {
                    setData(that, data);
                    that.state.onItemSelectCallback([0]);
                    that.state.onDataUpdateCallback([that.state.recordJson], getColumns(this, recordsResultsAccessors));
                }
            })
            .catch(err => {
                this.setState({alertMsg: "Error loading record: " + err.message, success: false});
            });
    }


    setData = (context, data, callback) => {
        let keys = Object.keys(data);
        keys.forEach(key => {
            if (key.endsWith("At")) {
                data[key] = getDateTimeString(new Date(data[key]));
            }
        });
        context.setState({"recordJson": data}, callback);
    };

    handleChange(e) {

    }

    handleSubmit() {
        deleteRecordByIds([this.props.match.params.recordId], this.state.user.id)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status === 401 ||data.status === 400||data.status === 404||data.status === 500) {
                    this.setState({alertMsg: data.message, success: false});
                    window.scrollTo(0, 0)
                }
                else {
                    this.props.history.push("/results/");
                }
            })
            .catch(error => console.log('error============:', error));
    }

    handleRemoveFromContainer = () => {
        let recordState = JSON.parse(JSON.stringify(this.state.recordJson));
        recordState.classificationBack = recordState.classIds;
        recordState.containerNumber = "";
        recordState.retentionSchedule = recordState.scheduleId;
        recordState.user = JSON.parse(JSON.stringify(this.state.user));

        updateRecord(this.props.match.params.recordId, recordState)
            .then(response => response.json())
            .then(data => {
                if (data && !data.exception) {
                    this.setData(this, data, () => {
                        if (!this.isInContainer()) {
                            this.setState({alertMsg: "Record has been removed from its container.", success: true});
                        } else {
                            this.setState({alertMsg: "Unable to remove record from its container.", success: false});
                        }
                    });

                } else if (data.status !== 201) {
                    this.setState({alertMsg: data.message, success: false});
                } else {
                    throw new Error();
                }
            })
            .catch(err => {
                console.error("Error updating record: " + err.message);
            });
    };

    isInContainer = () => {
        return (this.state.recordJson["containerId"] !== 0 || this.state.recordJson["containerNumber"] != null);
    };

    alertStyle = () => {
        return this.state.success ? 'success' : 'danger';
    };

    render() {

        const updateRecordLink = "/updateRecord/" + this.props.match.params.recordId;

        let title = {
            textAlign: "left",
        };
        let btnStyle = {
            display: "none",
        };
        if (this.state.user.role === "Administrator" || this.state.user.role === "RMC") {
            btnStyle = {
                display: "flex",
                justifyContent: "left"
            }
        }

        return (
            <div>
                {this.state.alertMsg && this.state.alertMsg.length !== 0
                    ? <Alert bsStyle={this.alertStyle()}><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                <Grid>
                    <Row>
                        <Col md={10} mdOffset={2}>
                            <h1 style={title}>{this.state.recordJson["number"]}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} mdOffset={2}>
                            <p style={title}>
                                <b>Title</b>
                                <br/>
                                {this.state.recordJson["title"]}
                            </p>
                            <p style={title}>
                                <b>State</b>
                                <br/>
                                {this.state.recordJson["state"]}
                            </p>
                            <p style={title}>
                                <b>Location</b>
                                <br/>
                                {this.state.recordJson["location"]}
                            </p>
                            <p style={title}>
                                <b>Record Type</b>
                                <br/>
                                {this.state.recordJson["type"]}
                            </p>
                            <p style={title}>
                                <b>Classification</b>
                                <br/>
                                {this.state.recordJson["classifications"]}
                            </p>
                            <p style={title}>
                                <b>Consignment Code</b>
                                <br/>
                                {this.state.recordJson["consignmentCode"]}
                            </p>
                        </Col>
                        <Col md={5}>
                            <p style={title}>
                                <b>Created At:</b>
                                <br/>
                                {this.state.recordJson["createdAt"]}
                            </p>
                            <p style={title}>
                                <b>Updated At:</b>
                                <br/>
                                {this.state.recordJson["updatedAt"]}
                            </p>
                            <p style={title}>
                                <b>Closed At:</b>
                                <br/>
                                {this.state.recordJson["closedAt"]}
                            </p>
                            <p style={title}>
                                <b>Retention Schedule:</b>
                                <br/>
                                {this.state.recordJson["schedule"]} ({this.state.recordJson["scheduleYear"]})
                            </p>
                        </Col>
                        <Col md={9} mdOffset={2}>
                            <p style={title}>
                                <b>Note</b>
                                <br/>
                                {this.state.recordJson["notes"]}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10} mdOffset={2}>
                            <ButtonToolbar style={btnStyle}>
                                <Link to={updateRecordLink}>
                                    <Button bsStyle="primary"> Edit Record </Button>
                                </Link>
                                <Confirm
                                    onConfirm={this.handleRemoveFromContainer}
                                    body={"Are you sure you want to remove " + this.state.recordJson["number"] + " from it's container?"}
                                    confirmText="Remove"
                                    title="Removing from container">
                                    <Button bsStyle="warning" disabled={!this.isInContainer()}>Remove From
                                        Container</Button>
                                </Confirm>
                                <Confirm
                                    onConfirm={this.handleSubmit}
                                    body="Are you sure you want to delete this?"
                                    confirmText="Confirm Delete"
                                    title="Deleting Record">
                                    <Button bsStyle="danger">Delete Record</Button>
                                </Confirm>
                                <Link to={'/createVolume'}>
                                    <Button bsStyle="primary" style={{marginLeft: '5px'}}> Create Volume </Button>
                                </Link>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ViewRecord;
