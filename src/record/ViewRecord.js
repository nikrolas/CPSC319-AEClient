import React, {Component} from 'react';
import {Row, Col, Grid,Button} from 'react-bootstrap'
import {Link,Redirect} from 'react-router-dom';
import {Confirm} from 'react-confirm-bootstrap'


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
                },
                navigate:false
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {

    }

    handleSubmit(event) {
        alert('Form has been submitted');
        event.preventDefault();
    }

    render() {
        const { navigate } = this.state;

        // here is the important part
        if (navigate) {
            return <Redirect to="/" push={true} />
        }
        return (
            <div>
                <h1>{this.state.recordJson["Number"]}</h1>
                <Link to="/updateRecord">
                    <Button> Edit Record </Button>
                </Link>
                    <Confirm
                        onConfirm={() => this.setState({ navigate: true })}
                        body="Are you sure you want to delete this?"
                        confirmText="Confirm Delete"
                        title="Deleting Record">
                        <Button>Delete </Button>
                    </Confirm>
                <br/><br/>
                <Grid>
                    <Row>
                        <Col sm={4} smOffset={2}>
                            <b>Title</b>
                            <br/>
                            {this.state.recordJson["Title"]}
                            <br/>
                            <b>State</b>
                            <br/>
                            {this.state.recordJson["StateId"]}
                            <br/>
                            <b>Location</b>
                            <br/>
                            {this.state.recordJson["LocationId"]}
                            <br/>
                            <b>Record Type</b>
                            <br/>
                            {this.state.recordJson["TypeId"]}
                            <br/>
                            <b>Classification</b>
                            <br/>
                            {/*TODO*/}
                            To Be Completed
                            <br/>
                            <b>Consignment Code</b>
                            <br/>
                            {this.state.recordJson["ConsignmentCode"]}
                            <br/>

                        </Col>
                        <Col sm={3}>
                            <b>Created At</b>
                            <br/>
                            {this.state.recordJson["CreatedAt"]}
                            <br/>
                            <b>Updated At</b>
                            <br/>
                            {this.state.recordJson["UpdatedAt"]}
                            <br/>
                            <b>Closed At</b>
                            <br/>
                            {this.state.recordJson["ClosedAt"]}
                            <br/>
                            <b>Retention Schedule</b>
                            <br/>
                            {this.state.recordJson["ScheduleId"]}
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