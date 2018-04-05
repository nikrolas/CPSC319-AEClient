import React, {Component} from 'react';
import {getRecordById, deleteRecordByIds, updateRecord} from "../api/RecordsApi";
import {MdCreateNewFolder, MdLibraryAdd, MdModeEdit, MdMoveToInbox} from 'react-icons/lib/md';
import {
    Row,
    Col,
    Grid,
    Button,
    ButtonToolbar,
    Alert,
    FormGroup,
    Form,
    FormControl,
    InputGroup
} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {Confirm} from 'react-confirm-bootstrap'
import {getDateTimeString} from "../utilities/DateTime";
import {recordsResultsAccessors} from "../search/Results";
import {getColumns} from "../utilities/ReactTable";
import {destroyAction} from "../bulk/Action";
import {goTo} from "../context/ContextualActions";
import {addRecordsToContainer} from "../api/ContainersApi";
import {searchByNumber} from "../api/SearchApi";


class ViewRecord extends Component {

    constructor(props, context) {
        super(props, context);
        this.state =
            {
                user: props.userData,
                alertMsg: "",
                success: true,
                readOnly: false,
                newContainerNumber: "",
                newContainerId: 0,
                recordJson: {
                    title: "n/a",
                    number: "n/a",
                    scheduleId: "n/a",
                    typeId: "n/a",
                    consignmentCode: "n/a",
                    containerId: "n/a",
                    locationId: "n/a",
                    classIds: [],
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
                traybtn: '',
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
        e.persist();
        this.setState({[e.target.name]: e.target.value});
    }

    addToContainer = (e) => {
        if (this.state.newContainerNumber && this.state.newContainerNumber.length > 0) {
            let options = {
                record: false,
                container: true
            };
            let encodedSearchString = encodeURIComponent(this.state.newContainerNumber.trim());
            searchByNumber(encodedSearchString, options, 1, 5, this.state.user.id)
                .then(response => {
                    return response.json()
                })
                .then((res) => {
                    if (res.error || (res.status && res.status !== 200)) {
                        let status = res.status ? res.status : "";
                        let err = res.error ? " " + res.error : "";
                        let msg = res.message ? ": " + res.message : "";
                        let alertMsg = status + err + msg;
                        this.setState({alertMsg});
                        window.scrollTo(0, 0)
                    }
                    else {
                        if (res.results && res.results.length === 1) {
                            addRecordsToContainer(res.results[0].containerId, [this.state.recordJson], this.state.user.id)
                                .then(responses => {
                                    return responses[0].json();
                                })
                                .then(result => {
                                    this.setData(this, result);
                                    this.setState({
                                        alertMsg: "Successfully added to the container: " + result.containerNumber,
                                        success: true
                                    });
                                    window.scrollTo(0, 0);
                                })
                                .catch(err => {
                                    this.setState({success: false});
                                    this.setState({alertMsg: err});
                                    window.scrollTo(0, 0);
                                });
                        } else if (res.results && res.results.length > 1) {
                            this.setState({success: false});
                            this.setState({alertMsg: "The container number needs to be unique. More than one container was found with the given container number."});
                            window.scrollTo(0, 0);
                        } else if (res.results && res.results.length === 0) {
                            this.setState({success: false});
                            this.setState({alertMsg: "The container number does not exist."});
                            window.scrollTo(0, 0);
                        } else {
                            console.log(res);
                            this.setState({success: false});
                            this.setState({alertMsg: "Unexpected result from looking up the container number. See console for more details."});
                            window.scrollTo(0, 0);
                        }
                    }
                })
                .catch(error => {
                    this.setState({alertMsg: error, loading: false});
                    window.scrollTo(0, 0)
                });
        }
        e.preventDefault();
    };

    addtoTray = () => {
        if (this.state.traybtn !== '')
            return;
        let stored = localStorage.getItem("tray" + this.state.user.id);
        let tray = stored ? JSON.parse(stored) : [];
        let record = Object.assign({}, this.state.recordJson);
        record["icon"] = "record";
        let intray = tray.some((item) => {
            return item["id"] === record["id"];
        });
        if (!intray) {
            tray.push(record);
            localStorage.setItem("tray" + this.state.user.id, JSON.stringify(tray));
            this.setState({traybtn: 'success'});
        }
        else
            this.setState({traybtn: 'error'});
    };
    trayBtnText = () => {
        switch (this.state.traybtn) {
            case 'success':
                return <span><i className="fa fa-check" style={{marginRight: '5px'}}/>Added to Tray</span>;
            case 'error':
                return <span><i className="fa fa-remove" style={{marginRight: '5px'}}/>Already in Tray</span>;
            default:
                return <span><MdMoveToInbox style={{marginRight: '5px'}}/>Add to Tray</span>;
        }
    };
    trayBtnStyle = () => {
        const colors = {
            blue: '#00569c',
            green: '#57b431',
            red: '#C4354F',
            white: '#ffffff'
        };
        let style = {
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
            marginLeft: 5,
            color: colors.white,
            backgroundColor: colors.blue,
            borderColor: '#2e6da4'
        };
        switch (this.state.traybtn) {
            case 'success':
                style["backgroundColor"] = colors.green;
                return style;
            case 'error':
                style["backgroundColor"] = colors.red;
                return style;
            default:
                return style;
        }
    };

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

    getContainerNumber = () => {
        if (this.state.recordJson["containerNumber"] !== null) {
            return this.state.recordJson["containerNumber"]
        } else {
            return "n/a";
        }
    };

    render() {

        let title = {
            textAlign: "left",
        };
        let btnStyle = {
            display: "none",
        };

        let iconWithText = {
            marginRight: '5px',
            verticalAlign: 'middle',
            transform: 'scale(1.3, 1.3)'
        };

        let disabledLink = {
            textDecoration: "inherit",
            color: "inherit",
            pointerEvents: "none",
            cursor: "default"
        };

        let linkStyle = () => {
            if (this.state.recordJson.containerId) {
                return {};
            } else {
                return disabledLink;
            }
        };

        if (this.state.user.role === "Administrator" || this.state.user.role === "RMC") {
            btnStyle = {
                display: "flex",
                justifyContent: "left"
            }
        }
        let containerPath = "/";
        if (this.state.recordJson.containerId) {
            containerPath = "/viewContainer/" + this.state.recordJson.containerId;
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
                                <span id="title">
                                    {this.state.recordJson["title"] !== ""
                                        ? this.state.recordJson["title"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>State</b>
                                <br/>
                                <span id="recordState">
                                    {this.state.recordJson["state"] !== ""
                                        ? this.state.recordJson["state"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Location</b>
                                <br/>
                                <span id="location">
                                    {this.state.recordJson["location"] !== ""
                                        ? this.state.recordJson["location"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Record Type</b>
                                <br/>
                                <span id="recordType">
                                    {this.state.recordJson["type"] !== ""
                                        ? this.state.recordJson["type"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Classification</b>
                                <br/>
                                <span id="classification">
                                    {this.state.recordJson["classifications"] !== ""
                                        ? this.state.recordJson["classifications"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Consignment Code</b>
                                <br/>
                                <span id="consignmentCode">
                                    {this.state.recordJson["consignmentCode"] !== ""
                                        ? this.state.recordJson["consignmentCode"]
                                        : "n/a"}
                                </span>
                            </p>
                        </Col>
                        <Col md={5}>
                            <p style={title}>
                                <b>Created At:</b>
                                <br/>
                                <span id="createdAt">
                                    {this.state.recordJson["createdAt"] !== ""
                                        ? this.state.recordJson["createdAt"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Updated At:</b>
                                <br/>
                                <span id="updatedAt">
                                    {this.state.recordJson["updatedAt"] !== ""
                                        ? this.state.recordJson["updatedAt"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Closed At:</b>
                                <br/>
                                <span id="closedAt">
                                    {this.state.recordJson["closedAt"] !== ""
                                        ? this.state.recordJson["closedAt"]
                                        : "n/a"}
                                </span>
                            </p>
                            <p style={title}>
                                <b>Retention Schedule:</b>
                                <br/>
                                <span id="retentionSchedule">
                                    {this.state.recordJson["schedule"] !== ""
                                        ? this.state.recordJson["schedule"]
                                        : "n/a"}
                                    ({this.state.recordJson["scheduleYear"]})
                                </span>
                            </p>
                            <p style={title}>
                                <b>Container Number:</b>
                                <br/>
                                <Link id="containerNumber" style={linkStyle()} to={containerPath}>
                                    {this.getContainerNumber()}
                                </Link>
                            </p>
                        </Col>
                        <Col md={9} mdOffset={2}>
                            <p style={title}>
                                <b>Note</b>
                                <br/>
                                <span id="note">
                                    {this.state.recordJson["notes"] !== null
                                        ? this.state.recordJson["notes"]
                                        : "n/a"}
                                </span>
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10} mdOffset={2}>
                            <ButtonToolbar style={btnStyle}>
                                <Button id="edit"
                                        bsStyle="primary"
                                        disabled={this.state.readOnly}
                                        onClick={() => goTo(this.props, "/updateRecord/" + this.props.match.params.recordId)}
                                >
                                    <MdModeEdit style={iconWithText}/>
                                    Edit Record
                                </Button>
                                <Button bsStyle="success"
                                        disabled={this.state.readOnly}
                                        onClick={() => {
                                            goTo(this.props, "/createVolume")
                                        }}>
                                    <MdCreateNewFolder style={iconWithText}/>
                                    Create Volume
                                </Button>
                                <Button bsStyle="warning"
                                        onClick={() => this.bulkAction(destroyAction)}
                                        disabled={this.state.readOnly}>
                                    <i className="fa fa-flag" style={{marginRight: '5px'}}/>
                                    Destroy
                                </Button>
                                <Button
                                    ref={ref => {
                                        this.traybtn = ref
                                    }}
                                    disabled={this.state.readOnly}
                                    onClick={this.addtoTray}
                                    style={this.trayBtnStyle()}>
                                    {this.state.traybtn ? this.trayBtnText() :
                                        <span><MdMoveToInbox style={iconWithText}/>Add to Tray</span>}
                                </Button>
                                <Confirm
                                    onConfirm={this.handleSubmit}
                                    body="Are you sure you want to delete this?"
                                    confirmText="Delete"
                                    title="Deleting Record">
                                    <Button bsStyle="danger"
                                            disabled={this.state.readOnly}>
                                        <i className="fa fa-trash-o" style={{marginRight: '5px'}}/>
                                        Delete
                                    </Button>
                                </Confirm>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "10px"}}>
                        <Col md={10} mdOffset={2}>
                            <Form inline style={{float: "left"}}>
                                <InputGroup style={{marginRight: "5px"}}>
                                    <FormGroup
                                        controlId="addToContainerInput"
                                    >
                                        <FormControl
                                            type="text"
                                            name="newContainerNumber"
                                            value={this.state.newContainerNumber}
                                            placeholder="Enter Container Number"
                                            onChange={this.handleChange}
                                            disabled={this.state.recordJson.containerId !== 0 || this.state.readOnly}
                                        />
                                    </FormGroup>
                                    <InputGroup.Button>
                                        <Button bsStyle="success"
                                                disabled={this.state.recordJson.containerId !== 0 || this.state.readOnly}
                                                onClick={this.addToContainer}>
                                            <MdLibraryAdd style={iconWithText}/>
                                            Add to Container
                                        </Button>
                                    </InputGroup.Button>
                                </InputGroup>
                                <Button bsStyle="primary"
                                        disabled={this.state.readOnly}
                                        onClick={() => goTo(this.props, "/createContainer")}>
                                    <i className="fa fa-dropbox" style={iconWithText}/>
                                    Contain
                                </Button>
                                <Confirm
                                    style={{marginLeft: '5px'}}
                                    onConfirm={this.handleRemoveFromContainer}
                                    body={"Are you sure you want to remove " + this.state.recordJson["number"] + " from it's container?"}
                                    confirmText="Remove"
                                    title="Removing from container">
                                    <Button
                                        bsStyle="warning"
                                        disabled={!this.isInContainer() || this.state.readOnly}>
                                        <i className="fa fa-minus-square" style={{marginRight: '5px'}}/>
                                        Remove From Container
                                    </Button>
                                </Confirm>
                            </Form>
                        </Col>
                    </Row>
                </Grid>
                <br/>
            </div>
        )
    }
}

export default ViewRecord;
