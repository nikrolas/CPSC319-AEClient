import React, {Component} from 'react';
import {Row, Grid, Button, ButtonToolbar, Alert} from 'react-bootstrap'
import {Confirm} from 'react-confirm-bootstrap'
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
                action: ""
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let data = getSelectedItems(this.props.resultsData, this.props.selectedItemIndexes);
        this.setState({data});
    };

    handleSubmit() {

    }

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
                            <Confirm
                                onConfirm={this.handleSubmit}
                                body={"Are you sure you want to delete?"}
                                confirmText="Confirm Delete"
                                title="Deleting Container">
                                <Button bsStyle="danger">Confirm</Button>
                            </Confirm>
                        </ButtonToolbar>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ConfirmAction;
