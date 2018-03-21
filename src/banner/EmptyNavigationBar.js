import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import banner_logo from './images/AE_Logo.png';
import {Navbar, Nav, NavItem} from "react-bootstrap";



class EmptyNavigationBar extends Component {
    render() {
        return (
            <Navbar inverse fluid>
                <Nav>
                    <NavItem className="logo-container" componentClass={Link} href="/" to="/">
                        <img src={banner_logo} className="App-logo" alt="logo"/>
                    </NavItem>
                </Nav>
            </Navbar>

        );
    }
}

export default EmptyNavigationBar;
