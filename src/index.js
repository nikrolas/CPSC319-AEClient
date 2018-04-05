import 'babel-polyfill';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import App from './App';
import {unregister} from './registerServiceWorker';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

unregister();
ReactDOM.render(<Router><App/></Router>, document.getElementById('root'));
