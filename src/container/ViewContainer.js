import React, {Component} from 'react';
import {Row, Col, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import {Confirm} from 'react-confirm-bootstrap'
import {deleteContainers, getContainerById} from "../api/ContainersApi";
import {getRecordById} from "../api/RecordsApi";
import ReactTable from "react-table";
import {getColumns, setData} from "../utilities/ReactTable";
import {getDateString, getDateTimeString, transformDates} from "../utilities/DateTime";
import {Link} from 'react-router-dom';


class ViewContainer extends Component {

    constructor(props) {
        super(props);
        let accessors = ["number", "title", "type", "classifications", "createdAt", "updatedAt"];
        let columns = getColumns(this, accessors);
        this.state =
            {
                user: props.userData,
                alertMsg: "",
                location: "Mock",
                state: "Mock",
                schedule: "Mock",
                closedAt: "N/A",
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
                    location: "",
                    stateName: "",
                    scheduleName: "",
                    consignmentCode: "",
                    destructionDate: "",
                    createdAt: "",
                    updatedAt: "",
                    childRecordIds: [],
                    notes: "Container Note"
                },
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (!this.props.match.params.containerId) {
            this.props.history.push("/");
        }
        getContainerById(this.props.match.params.containerId, this.state.user.id)
            .then(response => response.json())
            .then(data => {
                if (data && !data.exception) {
                    transformDates(data, getDateTimeString);
                    this.setState({containerJson: data});
                }

                let recordIds = data.childRecordIds;
                if (recordIds && recordIds.length > 0) {
                    this.setRecords(recordIds)
                }
            })
            .catch(err => {
                console.error("Error loading container: " + err.message);
            });
    };


    setRecordsState = (records) => {
        let firstRecord = records[0];
        let newState = {
            records: records,
            location: firstRecord.location,
            state: firstRecord.state,
            closedAt: getDateTimeString(new Date(firstRecord.closedAt)),
            schedule: firstRecord.schedule + " (" + firstRecord.scheduleYear + ")"
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

    handleSubmit() {
        deleteContainers(this.props.match.params.containerId, this.state.user.id)
            .then(response => {
                if (response.status !== 200) {
                    this.setState({alertMsg: response.statusText + ": Container must be empty."});
                    window.scrollTo(0, 0)
                }
                else {
                    this.props.history.goBack();
                }
            })
            .catch(error => console.log('error============:', error));
    }

    render() {
        const updateContainerLink = "/updateContainer/" + this.props.match.params.containerId;

        let title = {
            textAlign: "left",
        };
        let btnStyle = {
            display: "flex",
            justifyContent: "center"
        };

        let containerNumber = this.state.containerJson["containerNumber"];

        return (
            <div>
                {this.state.alertMsg.length !== 0
                    ? <Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                <h1>{containerNumber}</h1>
                <ButtonToolbar style={btnStyle}>
                    <Link to={updateContainerLink}>
                        <Button bsStyle="primary"> Edit Container </Button>
                    </Link>
                    <Confirm
                        onConfirm={this.handleSubmit}
                        body={"Are you sure you want to delete " + containerNumber + "?"}
                        confirmText="Confirm Delete"
                        title="Deleting Container">
                        <Button bsStyle="danger">Delete Container</Button>
                    </Confirm>
                </ButtonToolbar>
                <br/>
                <br/>
                <Grid>
                    <Row>
                        <Col md={4} mdOffset={3}>
                            <p style={title}>
                                <b>Title</b>
                                <br/>
                                {this.state.containerJson["title"]}
                            </p>
                            <p style={title}>
                                <b>Location</b>
                                <br/>
                                {this.state.location}
                            </p>
                            <p style={title}>
                                <b>State</b>
                                <br/>
                                {this.state.state}
                            </p>
                            <p style={title}>
                                <b>Consignment Code</b>
                                <br/>
                                {this.state.containerJson["consignmentCode"]}
                            </p>
                        </Col>
                        <Col md={5}>
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
                                {this.state.closedAt}
                            </p>
                            <p style={title}>
                                <b>Retention Schedule:</b>
                                <br/>
                                {this.state.schedule}
                            </p>
                        </Col>
                        <Col md={9} mdOffset={3}>
                            <p style={title}>
                                <b>Notes</b>
                                <br/>
                                {this.state.containerJson["notes"]}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <div>
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
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ViewContainer;
