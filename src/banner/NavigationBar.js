import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import banner_logo from './images/AE_Logo.png';
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {isARecordItem} from "../Utilities/Items";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            records: [],
            containers: [],
            user: props.userData,
        }
    }

    componentWillMount() {
        this.updateCounts(this.props);
    }

    countItemTypes = (selectedItemIndexes, data) => {
        let records = 0;
        let containers = 0;

        selectedItemIndexes.forEach((index) => {
            if (isARecordItem(data[index])) {
                records++;
            } else {
                containers++;
            }
        });

        return {records, containers};
    };

    componentWillReceiveProps(newProps) {
        this.updateCounts(newProps);
    }


    updateCounts = (newProps) => {
        let newCounts = this.countItemTypes(newProps.selectedItemIndexes, newProps.resultsData);
        this.setState(newCounts);
    };

    enableContainRecords = () => {
        return this.state.records > 0 && this.state.containers === 0;
    };

    enableAddToContainer = () => {
        return this.state.records > 0 && this.state.containers === 1;
    };

    recordsOnly = () => {
        return this.state.records > 0 && this.state.containers === 0;
    };

    enableCreateVolume = () => {
        if (this.state.records > 0 && this.state.containers === 0) {
            let {selectedItemIndexes, resultsData} = this.props;
            let index = -1;
            for (let i = 0; i < selectedItemIndexes.length; i++) {
                if (resultsData[selectedItemIndexes[i]].number.split(":").length <= 2) {
                    index = i;
                    break;
                }
            }
            if (index < 0)
                return false;

            let record = resultsData[selectedItemIndexes[index]];
            let num = record.number.split(":")[0];
            for (let i of selectedItemIndexes) {
                if (resultsData[i].number &&
                    resultsData[i].number.split(":")[0] !== num)
                    return false;
            }
            return true;
        }
        else return false;
    };

    render() {
        let userInfo = null;
        let search = null;
        let workTray = null;
        let newRecord = null;
        let containRecords = null;
        let createVolume = null;
        let removeFromContainer = null;
        if (this.state.user !== undefined && this.state.user !== null && this.state.user !== "") {
            userInfo =
                <Nav pullRight={true}>
                    <NavItem>
                        Signed in as: {this.state.user.firstName} {this.state.user.lastName} ({this.state.user.role})
                        <br/>
                        Location: {this.state.user.locations[0].locationName}
                    </NavItem>
                </Nav>;
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
                containRecords =
                    <NavItem componentClass={Link}
                             disabled={!this.enableContainRecords()}
                             href="/createContainer"
                             to="/createContainer">
                        Contain Records
                    </NavItem>
                createVolume =
                    <NavItem componentClass={Link}
                             disabled={!this.enableCreateVolume()}
                             href="/createVolume"
                             to="/createVolume">
                        Create Volume
                    </NavItem>;
                removeFromContainer =
                    <NavItem componentClass={Link}
                             disabled={!this.recordsOnly()}
                             onClick={() => this.props.onSelectAction("RemoveFromContainer")}
                             href="/confirmAction" to="/confirmAction">
                        Remove from Container
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
                    {containRecords}
                    {removeFromContainer}
                    {createVolume}
                </Nav>
                {userInfo}
            </Navbar>

        );
    }
}


export default NavigationBar;
