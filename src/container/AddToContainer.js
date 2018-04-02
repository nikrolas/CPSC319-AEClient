import React, {Component} from 'react';
import {Alert, Grid, Row, Col, ButtonToolbar, Button} from 'react-bootstrap'
import {addRecordsToContainer} from "../api/ContainersApi";
import ReactTable from "react-table";
import {isARecordItem} from "../utilities/Items";
import AlertDismissable from "../AlertDismissable";
import {getColumns} from "../utilities/ReactTable";
import {getDateString, transformDates} from "../utilities/DateTime";

class AddToContainer extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                user: props.userData,
                success: null,
                alertMsg: "",
                title: "",
                location: "",
                locations: [],
                selectedRecords: [],
                selectedContainers: [],

                invalidStateErrors: []
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let locations = this.props.userData.locations;
        let location = "";
        if (locations && locations.length > 0) {
            location = locations[0];
        }

        let selectedItems = this.getSelectedItems(this.props.resultsData, this.props.selectedItemIndexes);

        let selectedRecords = selectedItems.selectedRecords;
        let selectedContainers = selectedItems.selectedContainers;

        this.setState({locations, location, selectedRecords, selectedContainers});
    }

    componentDidMount() {
        let invalidStateErrors = [];

        if (!this.state.selectedRecords || !this.state.selectedRecords.length > 0) {
            invalidStateErrors.push("At least one record must be selected.");
        }
        if (!this.state.selectedContainers || this.state.selectedContainers.length !== 1) {
            invalidStateErrors.push("One container must be selected.");
        }

        let alertMsg = "";
        if (invalidStateErrors.length === 0) {
            let selectedContainer = this.state.selectedContainers[0];

            this.state.selectedRecords.forEach(record => {
                if (record && record.containerNumber && record.containerNumber !== selectedContainer.containerNumber) {
                    alertMsg = "Record " + record.number + " is already in a container: " + record.containerNumber;
                    this.setState({success: false});
                    return;
                }

                if (selectedContainer && selectedContainer.locationId && record.locationId !== selectedContainer.locationId) {
                    alertMsg = "Records are in a different location. Expected: " + selectedContainer.locationName;
                    this.setState({success: false});
                    return;
                }
                if (selectedContainer && selectedContainer.scheduleId && record.scheduleId !== selectedContainer.scheduleId) {
                    alertMsg = "Records have a different schedule. Expected: " + selectedContainer.scheduleName;
                    this.setState({success: false});
                    return;
                }
            });
        }

        this.setState({alertMsg, invalidStateErrors});
    }


    getSelectedItems = (records, selection) => {
        let selectedRecords = [];
        let selectedContainers = [];

        selection.forEach((index) => {
            if (isARecordItem(records[index])) {
                selectedRecords.push(records[index]);
            } else {
                selectedContainers.push(records[index]);
            }
        });

        return {selectedRecords, selectedContainers};
    };

    handleSubmit = (event) => {
        if (this.state.success) {
            this.props.history.push("/viewContainer/" + this.state.selectedContainers[0].containerId);
        } else {
            addRecordsToContainer(this.state.selectedContainers[0].containerId, this.state.selectedRecords, this.state.user.id)
                .then(result => {
                    this.setState({alertMsg: "Successfully added the records to the container.", success: true});
                })
                .catch(err => {
                    this.setState({success: false});
                    this.setState({alertMsg: err});
                    window.scrollTo(0, 0);
                });
        }
        event.preventDefault();
    };

    render() {
        let {selectedRecords, selectedContainers} = this.state;

        const records = JSON.parse(JSON.stringify(selectedRecords));
        records.forEach(record => transformDates(record, getDateString));

        const containers = JSON.parse(JSON.stringify(selectedContainers));
        const container = containers[0] ? transformDates(containers[0], getDateString) : {};

        let handleErrorAction = () => this.props.history.push("/");

        let handleCancel = () => this.props.history.goBack();

        let alertMessage = this.state.invalidStateErrors.join("\n");

        let accessors = ["number", "title", "state", "location", "schedule", "closedAt"];

        let title = {
            textAlign: "left",
        };
        let btnStyle = {
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
        };

        if (this.state.invalidStateErrors.length > 0) {
            return <AlertDismissable handleAction={handleErrorAction} alertMessage={alertMessage}/>
        } else {
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
                    <h1>{container.containerNumber}</h1>
                    <Grid>
                        <Row>
                            <Col md={4} mdOffset={3}>
                                <p style={title}>
                                    <b>Title</b>
                                    <br/>
                                    {container.title}
                                </p>
                                <p style={title}>
                                    <b>Location</b>
                                    <br/>
                                    {container.locationName}
                                </p>
                                <p style={title}>
                                    <b>State</b>
                                    <br/>
                                    {container.state}
                                </p>
                            </Col>
                            <Col md={5}>
                                <p style={title}>
                                    <b>Consignment Code</b>
                                    <br/>
                                    {container.consignmentCode}
                                </p>
                                <p style={title}>
                                    <b>Schedule:</b>
                                    <br/>
                                    {container.scheduleName}
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <div>
                                <h3>Records to add:</h3>
                                <div>
                                    <ReactTable
                                        data={records}
                                        columns={getColumns(this, accessors)}
                                        className="-striped -highlight"
                                        minRows={5}
                                        showPagination={true}
                                        defaultPageSize={5}
                                    />
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <ButtonToolbar style={btnStyle}>
                                <Button onClick={handleCancel}>
                                    {this.state.success ? "Done" : "Cancel"}
                                </Button>
                                <Button bsStyle="primary"
                                        onClick={this.handleSubmit}
                                        disabled={this.state.success === false}>
                                    {this.state.success ? "View Container" : "Proceed"}
                                </Button>
                            </ButtonToolbar>
                        </Row>
                    </Grid>
                </div>
            );
        }
    }
}

export default AddToContainer;
