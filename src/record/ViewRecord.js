import React, {Component} from 'react';
import {getRecordById, deleteRecordById} from "../APIs/RecordsApi";
import {Row, Col, Grid, Button, ButtonToolbar,Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {Confirm} from 'react-confirm-bootstrap'


class ViewRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {

                alertMsg:"",
                recordJson: {
                    title:"",
                    number:"",
                    scheduleId:"",
                    typeId:"",
                    consignmentCode:"",
                    containerId:"",
                    locationId:"",
                    classifications:"",
                    notes:"",
                    id:"",
                    stateId:"",
                    createdAt:"",
                    updatedAt:"",
                    closedAt:"",
                    location:"",
                    schedule:"",
                    type:"",
                    state:"",
                    container:"",
                    scheduleYear:""
                },
            };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordById(this.props.match.params.recordId)
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

    handleSubmit() {
        deleteRecordById(this.props.match.params.recordId)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.status === 500) {
                    this.setState({alertMsg: data.message});
                    window.scrollTo(0, 0)
                }
                else {
                    this.props.history.push("/results/");
                }
            })
            .catch(error => console.log('error============:', error));
    }

    render() {
        const updateRecordLink = "/updateRecord/" + this.props.match.params.recordId;

        let title = {
            textAlign:"left",
        };
        let btnStyle = {
            display:"flex",
            justifyContent:"center"
        };

        return (
            <div>
                {this.state.alertMsg.length !== 0
                    ?<Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    :null
                }
                <h1>{this.state.recordJson["number"]}</h1>
                <ButtonToolbar style = {btnStyle}>
                <Link to={updateRecordLink}>
                    <Button  bsStyle="primary"> Edit Record </Button>
                </Link>
                    <Confirm
                        onConfirm={this.handleSubmit}
                        body="Are you sure you want to delete this?"
                        confirmText="Confirm Delete"
                        title="Deleting Record">
                        <Button bsStyle="danger">Delete Record</Button>
                    </Confirm>
                </ButtonToolbar>
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
                                {this.state.recordJson["classifications"]}

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
