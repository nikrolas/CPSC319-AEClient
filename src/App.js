import React, {Component} from 'react';
import './App.css';
import RecordSearchInput from './search/RecordSearchInput';
import CreateRecord from './record/CreateRecord';
import ViewRecord from './record/ViewRecord';
import UpdateRecord from './record/UpdateRecord';
import LayoutBanner from './banner/LayoutBanner';
import {
    Route,
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className="App">
                <LayoutBanner/>
                <Route path='/createRecord/' component={CreateRecord} />
                <Route path='/viewRecord/:recordId?' component={ViewRecord}/>
                <Route path='/updateRecord/:recordId?' component={UpdateRecord}/>
            </div>
        );
    }
}

export default App;
