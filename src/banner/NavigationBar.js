import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import banner_logo from './images/AE_Logo.png';
import {Navbar, Nav, NavItem} from "react-bootstrap";

class NavigationBar extends Component {

    renderContainerButton = () => {
        if (this.props.selectedItems && this.props.selectedItems.length > 0) {
            let hasRecords = false;
            this.props.selectedItems.forEach((index) => {
                if (this.props.resultsData[index].hasOwnProperty('number')) {
                    hasRecords = true;
                    return;
                }
            });
            if (hasRecords)
                return <NavItem componentClass={Link} href="/createContainer" to="/createContainer">
                    Contain Records
                </NavItem>;
        }
    };

    render() {
        return (
            <Navbar inverse fluid>
                <Nav>
                    <NavItem className="logo-container" componentClass={Link} href="/" to="/">
                        <img src={banner_logo} className="App-logo" alt="logo"/>
                    </NavItem>
                    <NavItem componentClass={Link} href="/createRecord" to="/createRecord">
                        New Record
                    </NavItem>
                    {this.renderContainerButton()}
                </Nav>
            </Navbar>
        );
    }
}


export default NavigationBar;
