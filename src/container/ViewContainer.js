import React, {Component} from 'react';
import {Row, Col, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import {Confirm} from 'react-confirm-bootstrap'
import {deleteContainers, getContainerById} from "../APIs/ContainersApi";
import {getRecordById} from "../APIs/RecordsApi";
import ReactTable from "react-table";
import {getColumns, setData} from "../Utilities/ReactTable";
import {getDateString, getDateTimeString, transformDates} from "../Utilities/DateTime";


class ViewContainer extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                alertMsg: "",
                location: "",
                state: "",
                schedule: "",
                closedAt: "",
                data: [],
                columns: [],
                records: [],
                note: "Container Note",
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
                    notes: ""
                },
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (!this.props.match.params.containerId) {
            this.props.history.push("/");
        }
        getContainerById(this.props.match.params.containerId)
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
            promises.push(getRecordById(record)
                .then((result) => {
                    return result.json();
                })
            );
        });

        Promise.all(promises)
            .then((results) => {
                if (results.length > 0) {
                    this.setRecordsState(results);
                    let accessors = ["number", "title", "type", "classifications", "createdAt", "updatedAt"];
                    let columns = getColumns(that, accessors);
                    setData(that, results, columns);
                }
            })
            .catch((err) => {
                console.error("Error loading records: " + err);
            });
    };


    handleChange(e) {

    }

    handleSubmit() {
        deleteContainers(this.props.match.params.containerId)
            .then(response => {
                if(response.status !== 200) {
                    console.log(response);
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
        // const updateContainerLink = "/updateContainer/" + this.props.match.params.containerId;

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
                        <Button bsStyle="primary"> Edit Container </Button>
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
                                <b>Note</b>
                                <br/>
                                {this.state.note}
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
