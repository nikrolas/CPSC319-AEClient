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
        if (this.state.records === 1) {
            let record = this.props.resultsData[this.props.selectedItemIndexes[0]];
            let volume = record.number.split(":")[1];
            if (volume)
                return volume.startsWith("0");
            else return true;
        }
        else if (this.state.records > 1){
            let first = this.props.resultsData[this.props.selectedItemIndexes[0]].number.split(":")[0];
            for (let i of this.props.selectedItemIndexes) {
                if (this.props.resultsData[i].number &&
                    this.props.resultsData[i].number.split(":")[0] !== first)
                    return false;
            }
            return true;
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
