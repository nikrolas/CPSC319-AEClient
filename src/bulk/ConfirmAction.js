import React, {Component} from 'react';
import {Row, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import ReactTable from "react-table";
import {getSelectedItems} from "../utilities/Items";


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
                actionsComplete: false
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let data = getSelectedItems(this.props.resultsData, this.props.selectedItemIndexes);
        let {header, prompt, action, onActionComplete} = this.props.actionProps;
        let columns = this.props.resultsColumns;

        this.setState({data, columns, header, prompt, action, onActionComplete});
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

        return (
            <div>
                {this.state.alertMsg && this.state.alertMsg.length !== 0
                    ? <Alert bsStyle={this.state.success ? "success":"danger"}><h4>{this.state.alertMsg}</h4></Alert>
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
