import React, {Component} from 'react';
import {Row, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import ReactTable from "react-table";
import {getSelectedItems} from "../utilities/Items";
import {setData} from "../utilities/ReactTable";
import AlertDismissable from "../AlertDismissable";


class ConfirmAction extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                user: props.userData,
                alertMsg: "",
                success: false,
                data: [],
                columns: [],
                header: "",
                prompt: "",
                valid: true,
                actionsComplete: false,
                invalidStateErrors: []
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {

        let invalidStateErrors = [];
        if (!this.props.resultsData || !this.props.resultsData.length > 0) {
            invalidStateErrors.push("At least one item must be selected.");
        }
        else {
            let data = getSelectedItems(this.props.resultsData, this.props.selectedItemIndexes);
            let {header, prompt, action, onActionComplete} = this.props.actionProps;
            let columns = this.props.resultsColumns;
            setData(this, data, columns, () => {
            });
            this.setState({header, prompt, action, onActionComplete});
        }

        this.setState({invalidStateErrors});
    };

    enableAction = () => {
        return this.state.valid && this.state.action && !this.state.actionsComplete;
    };

    handleSubmit = () => {
        this.state.action(this.state.data, this.state.user.id)
            .then(result => {
                this.setState({alertMsg: result, success: true, actionsComplete: true});
                this.state.onActionComplete(this);
            })
            .catch(error => {
                this.setState({alertMsg: error, success: false, actionsComplete: true});
            });
    };

    onCancel = () => {
        this.props.history.goBack();
    };

    render() {
        let btnToolbarStyle = {
            display: "flex",
            justifyContent: "center",
            marginTop: "30px"
        };

        let cancelButtonText = () => {
            if (this.state.success) {
                return "Done";
            } else if (!this.state.success) {
                return "Go Back"
            }
        };

        let handleAction = () => {
            this.props.history.push("/");
        };

        let alertMessage = this.state.invalidStateErrors.join("\n");

        if (this.state.invalidStateErrors.length > 0) {
            return <AlertDismissable handleAction={handleAction} alertMessage={alertMessage}/>
        }

        return (
            <div>
                {this.state.alertMsg && this.state.alertMsg.length !== 0
                    ? <Alert bsStyle={this.state.success ? "success" : "danger"}><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                <h1>{this.state.header}</h1>
                <h3>{this.state.prompt}</h3>
                <br/>
                <br/>
                <Grid>
                    <Row>
                        <div>
                            <strong>Selected Items:</strong>
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
                    <Row>
                        <ButtonToolbar style={btnToolbarStyle}>
                            <Button onClick={this.onCancel}> {cancelButtonText()} </Button>
                            <Button bsStyle="warning" disabled={!this.enableAction()}
                                    onClick={this.handleSubmit}>Confirm</Button>
                        </ButtonToolbar>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ConfirmAction;
