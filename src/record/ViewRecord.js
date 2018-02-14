import React, {Component} from 'react';
import {Row, Col, Grid} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {getRecordById} from "../APIs/RecordsApi";


class ViewRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                recordJson: {
                    Id: 51,
                    Number: "EDM-2003/001",
                    Title: "Sample Record",
                    ScheduleId: 26,
                    TypeId: 3,
                    ConsignmentCode: "DESTRUCTION CERTIFICATE 2009-01",
                    StateId: 6,
                    ContainerId: 24365,
                    LocationId: 5,
                    CreatedAt: "2003-09-15 18:52:36.000000",
                    UpdatedAt: "2009-03-26 20:44:09.000000",
                    ClosedAt: "2003-12-31 14:48:45.000000",
                    ClassificationIds: [3, 4, 5, 6],
                    Notes: "This is a note!"
                }

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
                if (data) {
                    setData(that, data);
                }
            })
            .catch(err => {
                console.error("Error loading search results: " + err.message);
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
        alert('Form has been submitted');
        event.preventDefault();
    }


    render() {
        return (
            <div>
                <h1>{this.state.recordJson["number"]}</h1>
                <Link to="/createRecord">Edit Record</Link>
                <br/><br/>
                <Grid>
                    <Row>
                        <Col sm={4} smOffset={2}>
                            <b>Title</b>
                            <br/>
                            {this.state.recordJson["title"]}
                            <br/>
                            <b>State</b>
                            <br/>
                            {this.state.recordJson["state"]}
                            <br/>
                            <b>Location</b>
                            <br/>
                            {this.state.recordJson["location"]}
                            <br/>
                            <b>Record Type</b>
                            <br/>
                            {this.state.recordJson["type"]}
                            <br/>
                            <b>Classification</b>
                            <br/>
                            {/*TODO*/}
                            To Be Completed
                            <br/>
                            <b>Consignment Code</b>
                            <br/>
                            {this.state.recordJson["consignmentCode"]}
                            <br/>

                        </Col>
                        <Col sm={3}>
                            <b>Created At</b>
                            <br/>
                            {this.state.recordJson["createdAt"]}
                            <br/>
                            <b>Updated At</b>
                            <br/>
                            {this.state.recordJson["updatedAt"]}
                            <br/>
                            <b>Closed At</b>
                            <br/>
                            {this.state.recordJson["closedAt"]}
                            <br/>
                            <b>Retention Schedule</b>
                            <br/>
                            {this.state.recordJson["schedule"]} ({this.state.recordJson["scheduleYear"]})
                            <br/>
                        </Col>
                    </Row>
                    <Row>
                        <b>Note</b>
                        <br/>
                        {this.state.recordJson["Notes"]}
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ViewRecord;
