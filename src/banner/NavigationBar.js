import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import banner_logo from './images/AE_Logo.png';
import {Navbar, Nav, NavItem} from "react-bootstrap";

export function isARecordItem(obj) {
    return obj.hasOwnProperty('number');
}

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = this.countItemTypes(props.selectedItemIndexes, props.resultsData);
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
        let newCounts = this.countItemTypes(newProps.selectedItemIndexes, newProps.resultsData);
        this.setState(newCounts);
    }


    enableContainRecords = () => {
        return this.state.records > 0 && this.state.containers <= 1;
    };

    enableCreateVolume = () => {
        if (this.state.records >= 1 && this.state.containers === 0){
            let i = 0;
            for (let index of this.props.selectedItemIndexes) {
                if (Number(this.props.resultsData[index].number.split(":")[1]) >= 10) {
                    i = index;
                    break;
                }
            }
            let record = this.props.resultsData[i];
            let arr = record.number.split(":");
            let first = arr[0];
            let volume = arr[1];
            for (let i of this.props.selectedItemIndexes) {
                if (this.props.resultsData[i].number &&
                    this.props.resultsData[i].number.split(":")[0] !== first)
                    return false;
            }
            if (volume)
                return volume.startsWith("0") || (Number(volume) >= 10);
            else return true;
        }
        else return false;
    };

    render() {
        return (
            <Navbar inverse fluid>
                <Nav>
                    <NavItem className="logo-container" componentClass={Link} href="/" to="/">
                        <img src={banner_logo} className="App-logo" alt="logo"/>
                    </NavItem>
                    <NavItem componentClass={Link} href="/results" to="/results">
                        Search
                    </NavItem>
                    <NavItem componentClass={Link} href="/worktray" to="/worktray">
                        Work Tray
                    </NavItem>
                    <NavItem componentClass={Link} href="/createRecord" to="/createRecord">
                        New Record
                    </NavItem>
                    <NavItem componentClass={Link} disabled={!this.enableContainRecords()} href="/createContainer"
                             to="/createContainer">
                        Contain Records
                    </NavItem>;
                    <NavItem componentClass={Link} disabled={!this.enableCreateVolume()} href="/createVolume"
                             to="/createVolume">
                        Create Volume
                    </NavItem>;
                </Nav>
            </Navbar>
        );
    }
}


export default NavigationBar;
