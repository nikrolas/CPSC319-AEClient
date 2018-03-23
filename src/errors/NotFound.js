import React, {Component} from 'react';
import {Jumbotron} from 'react-bootstrap'
import {Link} from 'react-router-dom';


class NotFound extends Component {
    render() {
        return (
            <Jumbotron>
                <h1>Not Found</h1>
                <p>
                    Sorry, the page you are trying to access does not exist.
                </p>
                <p>
                    <Link to="/">Go back to home</Link>
                </p>
            </Jumbotron>
        )
    }
}

export default NotFound;
