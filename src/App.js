import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import CreateRecord from './record/CreateRecord';
import ViewRecord from './record/ViewRecord';
import UpdateRecord from './record/UpdateRecord';
import LayoutBanner from './banner/LayoutBanner';
import Search from './search/Search';
import SelectTable from "./search/Results";
import WorkTray from "./search/WorkTray";

class App extends Component {
    render() {
        return (
            <div className="App">
                <LayoutBanner/>
                <Route path='/createRecord/' component={CreateRecord} />
                <Route path='/viewRecord/:recordId?' component={ViewRecord}/>
                <Route path='/updateRecord/:recordId?' component={UpdateRecord}/>
                <Route exact path='/' component={Search}/>
                <Route path="/result" component={SelectTable}/>
                <Route path="/worktray" component={WorkTray}/>
            </div>
        );
    }
}

export default App;
