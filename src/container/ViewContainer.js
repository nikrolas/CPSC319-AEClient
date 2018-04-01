import React, {Component} from 'react';
import {Row, Col, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import {Confirm} from 'react-confirm-bootstrap'
import {deleteContainers, getContainerById} from "../api/ContainersApi";
import {getRecordById} from "../api/RecordsApi";
import ReactTable from "react-table";
import {getColumns, setData} from "../utilities/ReactTable";
import {getDateString, getDateTimeString, transformDates} from "../utilities/DateTime";
import {Link} from 'react-router-dom';
import {destroyAction} from "../bulk/Action";
import {containersResultsAccessors} from "../search/Results";
import {goTo} from "../context/ContextualActions";


class ViewContainer extends Component {

    constructor(props) {
        super(props);
        let accessors = ["number", "title", "type", "classifications", "createdAt", "updatedAt"];
        let columns = getColumns(this, accessors);
        this.state =
            {
                user: props.userData,
                alertMsg: "",
                success: false,
                readOnly: false,
                closedAt: null,
                data: [],
                columns: columns,
                records: [],
                containerJson: {
                    containerId: "",
                    locationId: "",
                    stateId: "",
                    scheduleId: "",
                    containerNumber: "",
                    locationName: "",
                    title: "",
                    type: "",
                    location: null,
                    state: null,
                    scheduleName: null,
                    consignmentCode: "",
                    destructionDate: "",
                    createdAt: "",
                    updatedAt: "",
                    childRecordIds: [],
                    notes: ""
                },
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount() {
        if (!this.props.match.params.containerId) {
            this.props.history.push("/");
        }
        getContainerById(this.props.match.params.containerId, this.state.user.id)
            .then(response => {
                if (response.status === 404) {
                    this.props.history.push("/notFound");
                }
                else if (response.status !== 200) {
                    throw new Error(response.message);
                } else {
                    return response.json()
                }
            })
            .then(data => {
                if (data && !data.exception) {
                    transformDates(data, getDateTimeString);
                    this.setState({containerJson: data}, () => {
                        this.props.onDataUpdate([data], getColumns(this, containersResultsAccessors));
                        this.props.onItemSelect([0]);
                    });

                    let recordIds = data.childRecordIds;
                    if (recordIds && recordIds.length > 0) {
                        this.setRecords(recordIds)
                    }
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(err => {
                console.error("Error loading container: " + err.message);
            });
    };

    bulkAction = (action) => {
        this.props.onSelectAction(action);
        goTo(this.props, "/confirmAction");
    };


    setRecordsState = (records) => {
        let latestClosedAtRecord = records[0];

        records.forEach(r => {
            if (latestClosedAtRecord < r.closedAt) {
                latestClosedAtRecord = r;
            }
        });

        let newState = {
            records: records,
            closedAt: getDateTimeString(new Date(latestClosedAtRecord.closedAt)),
            scheduleYear: latestClosedAtRecord.scheduleYear
        };

        newState.records.forEach(record => {
            transformDates(record, getDateString);
        });
        this.setState(newState);
    };

    setRecords = (recordIds) => {
        let that = this;
        let promises = [];
        recordIds.forEach((record) => {
            promises.push(getRecordById(record, this.state.user.id)
                .then((result) => {
                    return result.json();
                })
            );
        });

        Promise.all(promises)
            .then((results) => {
                if (results.length > 0) {
                    this.setRecordsState(results);
                    setData(that, results, this.state.columns);
                }
            })
            .catch((err) => {
                console.error("Error loading records: " + err);
            });
    };


    handleChange(e) {

    }

    handleDelete() {
        deleteContainers([this.props.match.params.containerId], this.state.user.id)
            .then(response => {
                if (response.ok) {
                    this.setState({
                        alertMsg: "This container has been successfully deleted.", success: true, readOnly: true});
                    window.scrollTo(0, 0);
                } else {
                    return response.json();
                }
            })
            .then(result => {
                if (result && result.status !== 200) {
                    let alertMsg = "";
                    if (result.containerNumber) {
                        alertMsg = result.error + ": " + result.containerNumber;
                    } else if (result.exception) {
                        alertMsg = result.message;
                    }
                    this.setState({alertMsg: alertMsg, success: false});
                    window.scrollTo(0, 0);
                }
            })
            .catch(error => {
                console.error(error)
                this.setState({alertMsg: "An unexpected error occurred when trying to delete this container. See the developers console for more details."});
                window.scrollTo(0, 0);
            });
    }

    render() {
        const updateContainerLink = "/updateContainer/" + this.props.match.params.containerId;

        let title = {
            textAlign: "left",
        };
        let btnStyle = {
            display: "flex",
            justifyContent: "left",
            marginTop: "20px"
        };
        let table = {
            marginTop: "20px"
        };

        let containerNumber = this.state.containerJson["containerNumber"];

        return (
            <div>
                {this.state.alertMsg && this.state.alertMsg.length !== 0
                    ? <Alert bsStyle={this.state.success ? "success" : "danger"}><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                <Grid>
                    <Row>
                        <Col md={10} mdOffset={2}>
                            <h1 id={containerNumber ? "containerNumberHeading" : null}
                                style={title}>{containerNumber}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} mdOffset={2}>
                            <p style={title}>
                                <b>Title</b>
                                <br/>
                                {this.state.containerJson["title"]}
                            </p>
                            <p style={title}>
                                <b>Location</b>
                                <br/>
                                {this.state.containerJson.location ? this.state.containerJson.location : "N/A"}
                            </p>
                            <p style={title}>
                                <b>State</b>
                                <br/>
                                {this.state.containerJson.state ? this.state.containerJson.state : "N/A"}
                            </p>
                            <p style={title}>
                                <b>Consignment Code</b>
                                <br/>
                                {this.state.containerJson["consignmentCode"] ? this.state.containerJson["consignmentCode"] : "(none)"}
                            </p>
                        </Col>
                        <Col md={4}>
                            <p style={title}>
                                <b>Created At:</b>
                                <br/>
                                {this.state.containerJson["createdAt"]}
                            </p>
                            <p style={title}>
                                <b>Updated At:</b>
                                <br/>
                                {this.state.containerJson["updatedAt"]}
                            </p>
                            <p style={title}>
                                <b>Closed At:</b>
                                <br/>
                                {this.state.closedAt ? this.state.closedAt : "N/A"}
                            </p>
                            <p style={title}>
                                <b>Retention Schedule:</b>
                                <br/>
                                {this.state.containerJson.scheduleName ? this.state.containerJson.scheduleName + " (" + this.state.scheduleYear + ")" : "N/A"}
                            </p>
                        </Col>
                        <Col md={10} mdOffset={2}>
                            <p style={title}>
                                <b>Notes</b>
                                <br/>
                                {this.state.containerJson["notes"]}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={9} mdOffset={2}>
                            <div style={table}>
                                <strong>Contained Records:</strong>
                                <div>
                                    <ReactTable
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        className="-striped -highlight"
                                        minRows={5}
                                        showPagination={true}
                                        defaultPageSize={5}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={9} mdOffset={2}>
                            <ButtonToolbar style={btnStyle}>
                                <Link to={updateContainerLink}>
                                    <Button bsStyle="primary" disabled={this.state.readOnly}> Edit Container </Button>
                                </Link>
                                <Button bsStyle="warning"
                                        disabled={this.state.readOnly}
                                        onClick={() => this.bulkAction(destroyAction)}>
                                    Destroy
                                </Button>
                                <Confirm
                                    onConfirm={this.handleDelete}
                                    body={"Are you sure you want to delete " + containerNumber + "?"}
                                    confirmText="Delete"
                                    title="Deleting Container">
                                    <Button bsStyle="danger" disabled={this.state.readOnly}>Delete</Button>
                                </Confirm>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ViewContainer;
