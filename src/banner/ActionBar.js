import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class ActionBar extends Component {

    renderContainerButton = () => {
        if (this.props.selectedItems && this.props.selectedItems.length > 0) {
            return <LinkContainer to="/createContainer">
                <NavItem eventKey={2}>
                    Contain Records
                </NavItem>
            </LinkContainer>;
        }
    };

    render() {
        return (
            <Navbar>
                <Nav>
                    <LinkContainer to="/createRecord">
                        <NavItem eventKey={1}>
                            New Record
                        </NavItem>
                    </LinkContainer>
                    {this.renderContainerButton()}
                </Nav>
            </Navbar>
        );
    }
}

export default ActionBar;
