import React, {Component} from 'react';
import {getRecordById} from "../APIs/RecordsApi";
import {Row, Col, Grid, Button} from 'react-bootstrap'
import {Link,Redirect} from 'react-router-dom';
import {Confirm} from 'react-confirm-bootstrap'


class ViewRecord extends Component {

    constructor(props, context) {
        super(props, context);
        let mockDate = new Date(1127779200000).toTimeString();
        this.state =
            {
                recordJson: {
                    Id: 51,
                    Number: "EDM-2003/001",
                    title: "Sample Record",
                    ScheduleId: 26,
                    TypeId: 3,
                    ConsignmentCode: "DESTRUCTION CERTIFICATE 2009-01",
                    StateId: 6,
                    ContainerId: 24365,
                    LocationId: 5,
                    createdAt: mockDate,
                    updatedAt: mockDate,
                    closedAt: mockDate,
                    ClassificationIds: [3, 4, 5, 6],
                    state: "Active",
                    location: "AE Corporate Office - Edmonton - Accounting",
                    type: "AE CORP - ACCOUNTING - EDM - PROJECT BILLINGS",
                    consignmentCode: null,
                    schedule: "FINANCIAL MANAGEMENT - ACCOUNTING",
                    scheduleYear: 6,
                    Notes: "This is a note!"
                },
                navigate:false
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordById(this.props.match.params.recordId, 5)
            .then(response => response.json())
            .then(data => {
                if (data && !data.exception) {
                    setData(that, data);
                }
            })
            .catch(err => {
                console.error("Error loading record: " + err.message);
            });
    }

    setData = (context, data) => {
        let keys = Object.keys(data);
        keys.forEach( key => {
            if (key.endsWith("At")) {
                data[key] = new Date(data[key]).toTimeString();
            }
        });
        context.setState({"recordJson": data});
    };
    handleChange(e) {

    }

    handleSubmit(event) {
        alert('Form has been submitted - for rollback');
        event.preventDefault();
    }

    render() {
        const { navigate } = this.state;
        const updateRecordLink = "/updateRecord/" + this.props.match.params.recordId;

        let title = {
            textAlign:"left",
        };

        // here is the important part
        if (navigate) {
            return <Redirect to="/" push={true} />
        }

        return (
            <div>
                <h1>{this.state.recordJson["number"]}</h1>
                <Link to={updateRecordLink}>
                    <Button  bsStyle="primary"> Edit Record </Button>
                </Link>
                    <Confirm
                        onConfirm={() => this.setState({ navigate: true })}
                        body="Are you sure you want to delete this?"
                        confirmText="Confirm Delete"
                        title="Deleting Record">
                        <Button bsStyle="danger">Delete Record</Button>
                    </Confirm>
                <br/><br/>
                <Grid>
                    <Row>
                        <Col md={4} mdOffset={3}>
                            <p style ={title}>
                                <b>Title</b>
                                <br/>
                                {this.state.recordJson["title"]}
                            </p>
                            <p style ={title}>
                                <b>State</b>
                                <br/>
                                {this.state.recordJson["state"]}
                            </p>
                            <p style ={title}>
                                <b>Location</b>
                                <br/>
                                {this.state.recordJson["location"]}
                            </p>
                            <p style ={title}>
                                <b>Record Type</b>
                                <br/>
                                {this.state.recordJson["type"]}
                            </p>
                            <p style ={title}>
                                <b>Classification</b>
                                <br/>
                                {/*TODO*/}
                                To Be Completed
                            </p>
                            <p style ={title}>
                                <b>Consignment Code</b>
                                <br/>
                                {this.state.recordJson["consignmentCode"]}
                            </p>
                        </Col>
                        <Col md={5}>
                            <p style ={title}>
                                <b>Created At:</b>
                                <br/>
                                {this.state.recordJson["createdAt"]}
                            </p>
                            <p style ={title}>
                                <b>Updated At:</b>
                                <br/>
                                {this.state.recordJson["updatedAt"]}
                            </p>
                            <p style ={title}>
                                <b>Closed At:</b>
                                <br/>
                                {this.state.recordJson["closedAt"]}
                            </p>
                            <p style ={title}>
                                <b>Retention Schedule:</b>
                                <br/>
                                {this.state.recordJson["schedule"]} ({this.state.recordJson["scheduleYear"]})
                            </p>
                        </Col>
                        <Col md={9} mdOffset={3}>
                            <p style ={title}>
                                <b>Note</b>
                                <br/>
                                {this.state.recordJson["Notes"]}
                            </p>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ViewRecord;
