import React, {Component} from 'react';
import {Alert, Button, Glyphicon} from 'react-bootstrap'

class AlertDismissable extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleAction = props.handleAction;
        this.alertMessage = props.alertMessage;

        this.state = {
            show: true
        };
    }

    handleDismiss = () => {
        this.setState({show: false});
    };

    render() {
        if (this.state.show) {
            return (
                <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                    <h4><Glyphicon glyph="exclamation-sign"/> Oops</h4>
                    <p>
                        {this.alertMessage}
                    </p>
                    <p>
                        <Button onClick={this.handleAction}>Return to home</Button>
                    </p>
                </Alert>
            );
        } else {
            return (<div></div>);
        }
    }
}

export default AlertDismissable;

