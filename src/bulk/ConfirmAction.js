import React, {Component} from 'react';
import {Row, Grid, Button, ButtonToolbar, Alert, Form, Checkbox} from 'react-bootstrap'
import ReactTable from "react-table";
import {getSelectedItems} from "../utilities/Items";


class ConfirmAction extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                alertMsg: "",
                success: false,
                data: [],
                columns: [],
                header: "",
                prompt: "",
                valid: true,
                checked: false
            };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let data = getSelectedItems(this.props.resultsData, this.props.selectedItemIndexes);
        let {header, prompt, option, action} = this.props.actionProps;
        let columns = this.props.resultsColumns;

        this.setState({data, columns, header, prompt, option, action});
    };

    enableAction = () => {
        return this.state.valid && this.state.action;
    };

    handleSubmit = () => {
        this.state.action(this.state.data, this.state.checked)
            .then(result => {
                this.setState({alertMsg: result, success: true});
            })
            .catch(error => {
                this.setState({alertMsg: error, success: false});
            });
    };

    onCancel = () => {
        this.props.history.goBack();
    };

    render() {
        let option = null;
        if (this.state.option) {
            option =
                <Form>
                    <Checkbox
                        checked={this.state.checked}
                        onChange={(e) => this.setState({checked: e.target.checked})}>
                        {this.state.option}
                    </Checkbox>
                </Form>
        }

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
                        {option}
                    </Row>
                    <Row>
                        <ButtonToolbar style={btnStyle}>
                            <Button bsStyle="primary" onClick={this.onCancel}> Cancel </Button>
                            <Button bsStyle="danger" disabled={!this.enableAction()}
                                    onClick={this.handleSubmit}>Confirm</Button>
                        </ButtonToolbar>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ConfirmAction;
