import React, {Component} from 'react';
import {Row, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import ReactTable from "react-table";
import {getSelectedItems} from "../Utilities/Items";


class ConfirmAction extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                alertMsg: "",
                success: false,
                data: [],
                columns: props.resultsColumns,
                header: "",
                prompt: "",
                action: null
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let data = getSelectedItems(this.props.resultsData, this.props.selectedItemIndexes);
        let action = this.props.confirmAction;
        this.setState({data, action});
    };

    enableAction = () => {
        return this.state.action != null;
    };

    handleSubmit = () => {
        if (this.state.action != null) {
            this.state.action(this, this.state.data)
                .then(result => {
                    this.setState({alertMsg: result, success: true});
                })
                .catch(error => {
                    this.setState({alertMsg: error, success: false});
                });
        }
    };

    onCancel = () => {
        this.props.history.goBack();
    };

    render() {

        let btnStyle = {
            display: "flex",
            justifyContent: "center"
        };

        return (
            <div>
                {this.state.alertMsg.length !== 0
                    ? <Alert bsStyle="danger"><h4>{this.state.alertMsg}</h4></Alert>
                    : null
                }
                <h1>{this.state.header}</h1>
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
                        <ButtonToolbar style={btnStyle}>
                            <Button bsStyle="primary" onClick={this.onCancel}> Cancel </Button>
                            <Button bsStyle="danger" disabled={!this.enableAction()} onClick={this.handleSubmit()}>Confirm</Button>
                        </ButtonToolbar>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ConfirmAction;
