import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import CreateRecord from './record/CreateRecord';
import ViewRecord from './record/ViewRecord';
import UpdateRecord from './record/UpdateRecord';
import CreateContainer from "./container/CreateContainer";
import CreateVolume from "./volume/CreateVolume";
import SelectTable from "./search/Results";
import WorkTray from "./search/WorkTray";
import Home from "./search/Home";
import NavigationBar from "./banner/NavigationBar";
import ViewContainer from "./container/ViewContainer";
import UpdateContainer from "./container/UpdateContainer";
import ConfirmAction from "./bulk/ConfirmAction";

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
            selectedItemIndexes: [],
            confirmAction: () => {}
        };
    }

    setselectedItemIndexes = (items) => {
        this.setState({selectedItemIndexes: items});
    };

    setResultsStates = (data, columns) => {
        this.setState({resultsData: data, resultsColumns: columns});
    };

    setConfirmAction = (confirmAction) => {
        this.setState({confirmAction});
    };

    render() {
        return (
            <div className="App">
                <NavigationBar selectedItemIndexes={this.state.selectedItemIndexes} resultsData={this.state.resultsData} onSelectAction={this.setConfirmAction}/>
                <Route exact path='/' component={Home}/>
                <Route path='/createRecord/' component={CreateRecord} />
                <Route path='/viewRecord/:recordId?' component={ViewRecord}/>
                <Route path='/updateRecord/:recordId?' component={UpdateRecord}/>
                <Route path='/viewContainer/:containerId?' component={ViewContainer}/>
                <Route path='/updateContainer/:containerId?' component={UpdateContainer}/>
                <RouteWrapper path="/results/:searchString?" onItemSelect={this.setselectedItemIndexes} onDataUpdate={this.setResultsStates} component={SelectTable}/>
                <RouteWrapper path="/worktray" onItemSelect={this.setselectedItemIndexes} onDataUpdate={this.setResultsStates} component={WorkTray}/>
                <RouteWrapper path='/createContainer/' selectedItemIndexes={this.state.selectedItemIndexes} resultsData={this.state.resultsData} resultsColumns={this.state.resultsColumns} component={CreateContainer}/>
                <RouteWrapper path='/createVolume/' selectedItemIndexes={this.state.selectedItemIndexes} resultsData={this.state.resultsData} resultsColumns={this.state.resultsColumns} component={CreateVolume}/>
                <RouteWrapper path='/confirmAction' selectedItemIndexes={this.state.selectedItemIndexes} resultsData={this.state.resultsData} resultsColumns={this.state.resultsColumns} component={ConfirmAction} action={this.state.confirmAction}/>
            </div>
        );
    }
}

export default App;
