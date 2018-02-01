import React, { Component } from 'react';
import './App.css';
import RecordSearchInput from './search/RecordSearchInput';
import CreateRecord from './record/CreateRecord';
import LayoutBanner from './banner/LayoutBanner'


class App extends Component {
  render() {
    return (
      <div className="App">
          <LayoutBanner/>
        <br/>
      <RecordSearchInput/>
          <CreateRecord/>
      </div>
    );
  }
}

export default App;
