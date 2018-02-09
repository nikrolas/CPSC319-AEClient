import React, { Component } from 'react';
import './App.css';
import RecordSearchInput from './search/RecordSearchInput';
import LayoutBanner from './banner/LayoutBanner'
import SelectTable from "./search/Results";
import WorkTray from "./search/WorkTray";


class App extends Component {
  render() {
    return (
      <div className="App">
          <LayoutBanner/>
        <br/>
      <RecordSearchInput/>
          <SelectTable/>
          <WorkTray/>
      </div>
    );
  }
}

export default App;
