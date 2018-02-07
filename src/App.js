import React, { Component } from 'react';
import './App.css';
import RecordSearchInput from './search/RecordSearchInput';
import LayoutBanner from './banner/LayoutBanner'


class App extends Component {
  render() {
    return (
      <div className="App">
          <LayoutBanner/>
        <br/>
      <RecordSearchInput/>
      </div>
    );
  }
}

export default App;
