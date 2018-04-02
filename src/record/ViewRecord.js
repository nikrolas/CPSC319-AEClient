import React, {Component} from 'react';
import {getRecordById, deleteRecordByIds, updateRecord} from "../api/RecordsApi";
import {Row, Col, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {Confirm} from 'react-confirm-bootstrap'
import {getDateTimeString} from "../utilities/DateTime";
import {recordsResultsAccessors} from "../search/Results";
import {getColumns} from "../utilities/ReactTable";
import {destroyAction} from "../bulk/Action";
import {goTo} from "../context/ContextualActions";


class ViewRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                user: props.userData,
                alertMsg: "",
                success: true,
                readOnly: false,
                recordJson: {
                    title: "n/a",
                    number: "n/a",
                    scheduleId: "n/a",
                    typeId: "n/a",
                    consignmentCode: "n/a",
                    containerId: "n/a",
                    locationId: "n/a",
                    classifications: "n/a",
                    notes: "n/a",
                    id: "n/a",
                    stateId: "n/a",
                    createdAt: "n/a",
                    updatedAt: "n/a",
                    closedAt: "n/a",
                    location: "n/a",
                    schedule: "n/a",
                    type: "n/a",
                    state: "n/a",
                    containerNumber: "n/a",
                    scheduleYear: "n/a"
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
                if (data.status === 401 || data.status === 400 || data.status === 404 || data.status === 500) {
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

    bulkAction = (action) => {
        this.props.onSelectAction(action);
        goTo(this.props, "/confirmAction");
    };

    setData = (context, data, callback) => {
        let keys = Object.keys(data);
        keys.forEach(key => {
            if (key.endsWith("At")) {
                if (data[key] !== null) {
                    data[key] = getDateTimeString(new Date(data[key]));
                }
                else {
                    data[key] = "n/a";
                }
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
                if (data.status && (data.status === 401 || data.status === 400 || data.status === 404 || data.status === 500)) {
                    this.setState({alertMsg: data.message, success: false});
                    window.scrollTo(0, 0)
                }
                else {
                    for (let i = 0; i < data.responseList.length; i++) {
                        if (!data.responseList[i].status) {
                            this.setState({alertMsg: data.responseList[i].msg, success: false});
                            window.scrollTo(0, 0)
                        } else {
                            this.setState({
                                alertMsg: "This record has been successfully deleted.",
                                success: true,
                                readOnly: true
                            });
                            window.scrollTo(0, 0)
                        }
                    }
                }
            })
            .catch(error => {
                this.setState({alertMsg: "The application was unable to connect to the network. Please try again later."});
                window.scrollTo(0, 0);
            });
    }

    handleRemoveFromContainer = () => {
        let recordState = JSON.parse(JSON.stringify(this.state.recordJson));
        recordState.classificationBack = recordState.classIds;
        recordState.containerNumber = "";
        recordState.containerId = null;
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
                this.setState({alertMsg: "The application was unable to connect to the network. Please try again later."});
                window.scrollTo(0, 0)
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
                            <h1 id={this.state.recordJson["number"] && this.state.recordJson["number"] !== "n/a" ? "recordNumberHeading" : null}
                                style={title}>{this.state.recordJson["number"]}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} mdOffset={2}>
                            <p style={title}>
                                <b>Title</b>
                                <br/>
                                {this.state.recordJson["title"] !== ""
                                    ? this.state.recordJson["title"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>State</b>
                                <br/>
                                <div id="recordState">
                                {this.state.recordJson["state"] !== ""
                                    ? this.state.recordJson["state"]
                                    : "n/a"}
                                </div>
                            </p>
                            <p style={title}>
                                <b>Location</b>
                                <br/>
                                {this.state.recordJson["location"] !== ""
                                    ? this.state.recordJson["location"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>Record Type</b>
                                <br/>
                                {this.state.recordJson["type"] !== ""
                                    ? this.state.recordJson["type"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>Classification</b>
                                <br/>
                                {this.state.recordJson["classifications"] !== ""
                                    ? this.state.recordJson["classifications"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>Consignment Code</b>
                                <br/>
                                {this.state.recordJson["consignmentCode"] !== ""
                                    ? this.state.recordJson["consignmentCode"]
                                    : "n/a"}
                            </p>
                        </Col>
                        <Col md={5}>
                            <p style={title}>
                                <b>Created At:</b>
                                <br/>
                                {this.state.recordJson["createdAt"] !== ""
                                    ? this.state.recordJson["createdAt"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>Updated At:</b>
                                <br/>
                                {this.state.recordJson["updatedAt"] !== ""
                                    ? this.state.recordJson["updatedAt"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>Closed At:</b>
                                <br/>
                                {this.state.recordJson["closedAt"] !== ""
                                    ? this.state.recordJson["closedAt"]
                                    : "n/a"}
                            </p>
                            <p style={title}>
                                <b>Retention Schedule:</b>
                                <br/>
                                {this.state.recordJson["schedule"] !== ""
                                    ? this.state.recordJson["schedule"]
                                    : "n/a"}
                                ({this.state.recordJson["scheduleYear"]})
                            </p>
                            <p style={title}>
                                <b>Container Number:</b>
                                <br/>
                                {this.state.recordJson["containerNumber"] !== null
                                    ? this.state.recordJson["containerNumber"]
                                    : "n/a"}
                            </p>
                        </Col>
                        <Col md={9} mdOffset={2}>
                            <p style={title}>
                                <b>Note</b>
                                <br/>
                                {this.state.recordJson["notes"] !== ""
                                    ? this.state.recordJson["notes"]
                                    : "n/a"}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10} mdOffset={2}>
                            <ButtonToolbar style={btnStyle}>
                                <Link to={updateRecordLink}>
                                    <Button bsStyle="primary" disabled={this.state.readOnly}> Edit Record </Button>
                                </Link>
                                <Link to={'/createVolume'}>
                                    <Button bsStyle="primary" style={{marginLeft: '5px'}}
                                            disabled={this.state.readOnly}> Create Volume </Button>
                                </Link>
                                <Confirm
                                    onConfirm={this.handleRemoveFromContainer}
                                    body={"Are you sure you want to remove " + this.state.recordJson["number"] + " from it's container?"}
                                    confirmText="Remove"
                                    title="Removing from container">
                                    <Button bsStyle="warning" disabled={!this.isInContainer() || this.state.readOnly}>Remove
                                        From
                                        Container</Button>
                                </Confirm>
                                <Button bsStyle="warning"
                                        onClick={() => this.bulkAction(destroyAction)}
                                        disabled={this.state.readOnly}>
                                    Destroy
                                </Button>
                                <Confirm
                                    onConfirm={this.handleSubmit}
                                    body="Are you sure you want to delete this?"
                                    confirmText="Delete"
                                    title="Deleting Record">
                                    <Button bsStyle="danger" disabled={this.state.readOnly}>Delete</Button>
                                </Confirm>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Grid>
                <br/>
            </div>
        )
    }
}

export default ViewRecord;
