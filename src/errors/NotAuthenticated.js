import React, {Component} from 'react';
import {Jumbotron} from 'react-bootstrap'
import {Link} from 'react-router-dom';



class NotAuthenticated extends Component {
    render() {
        return (
            <Jumbotron>
                <h1>Not Authorized</h1>
                <p>
                    Sorry, you do not have authorization to access this page.
                </p>
                <p>
                    <Link to="/">Go back to home</Link>
                </p>
            </Jumbotron>
        )
    }
}

export default NotAuthenticated;
