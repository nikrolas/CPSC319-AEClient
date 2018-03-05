import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import CreateRecord from './record/CreateRecord';
import ViewRecord from './record/ViewRecord';
import UpdateRecord from './record/UpdateRecord';
import CreateContainer from "./container/CreateContainer";
import SelectTable from "./search/Results";
import WorkTray from "./search/WorkTray";
import Home from "./search/Home";
import NavigationBar from "./banner/NavigationBar";

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
};

const RouteWrapper = ({ component, ...rest }) => {
    return (
        <Route {...rest} render={routeProps => {
            return renderMergedProps(component, routeProps, rest);
        }}/>
    );
};

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resultsData: [],
            resultsColumns: [],
            selectedItems: []
        };
    }

    setSelectedItems = (items) => {
        this.setState({selectedItems: items});
    };

    setResultsStates = (data, columns) => {
        this.setState({resultsData: data, resultsColumns: columns});
    };

    render() {
        return (
            <div className="App">
                <NavigationBar selectedItems={this.state.selectedItems} resultsData={this.state.resultsData}/>
                <Route path='/createRecord/' component={CreateRecord} />
                <Route path='/viewRecord/:recordId?' component={ViewRecord}/>
                <Route path='/updateRecord/:recordId?' component={UpdateRecord}/>
                <Route exact path='/' component={Home}/>
                <RouteWrapper path="/results/:searchString?" onItemSelect={this.setSelectedItems} onDataUpdate={this.setResultsStates} component={SelectTable}/>
                <RouteWrapper path="/worktray" onItemSelect={this.setSelectedItems} onDataUpdate={this.setResultsStates} component={SelectTable} component={WorkTray}/>
                <RouteWrapper path='/createContainer/' selectedItems={this.state.selectedItems} resultsData={this.state.resultsData} resultsColumns={this.state.resultsColumns} component={CreateContainer}/>
            </div>
        );
    }
}

export default App;
