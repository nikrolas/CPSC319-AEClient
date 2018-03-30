import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import banner_logo from './images/AE_Logo.png';
import {Nav, Navbar, NavItem} from "react-bootstrap";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.userData,
        }
    }

    render() {
        let userInfo = null;
        let search = null;
        let workTray = null;
        let newRecord = null;
        let locations = "";
        if (this.state.user !== undefined && this.state.user !== null && this.state.user !== "") {
            for (let i = 0; i < this.state.user.locations.length; i ++ ){
                if (i === 0) {
                    locations += this.state.user.locations[i].locationName
                }
                else {
                    locations += ", " + this.state.user.locations[i].locationName
                }
            }
        }
        if (this.state.user !== undefined && this.state.user !== null && this.state.user !== "") {
            userInfo =
                <Nav pullRight={true}>
                    <NavItem>
                        {this.state.user.firstName} {this.state.user.lastName} ({this.state.user.role})
                        <br/>
                        Location: {locations}
                    </NavItem>
                </Nav>;

            if (this.state.user.role === "General") {
                search =
                    <NavItem componentClass={Link}
                             href="/results"
                             to="/results">
                        Search
                    </NavItem>;
            }

            if (this.state.user.role === "Administrator" || this.state.user.role === "RMC") {
                search =
                    <NavItem componentClass={Link}
                             href="/results"
                             to="/results">
                        Search
                    </NavItem>;
                workTray =
                    <NavItem componentClass={Link}
                             href="/worktray"
                             to="/worktray">
                        Work Tray
                    </NavItem>;
                newRecord =
                    <NavItem componentClass={Link}
                             href="/createRecord"
                             to="/createRecord">
                        New Record
                    </NavItem>;
            }
        }

        return (
            <Navbar inverse fluid>
                <Nav>
                    <NavItem className="logo-container" componentClass={Link} href="/" to="/">
                        <img src={banner_logo} className="App-logo" alt="logo"/>
                    </NavItem>
                    {search}
                    {workTray}
                    {newRecord}
                </Nav>
                {userInfo}
            </Navbar>

        );
    }
}


export default NavigationBar;
