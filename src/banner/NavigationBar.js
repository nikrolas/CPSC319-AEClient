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
        if (this.state.records > 0 && this.state.containers === 0){
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
        console.log(this.props);
        let userLoginStyle = {
            color:'white'
        }
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
                <h1 style = {userLoginStyle}></h1>
            </Navbar>

        );
    }
}


export default NavigationBar;
