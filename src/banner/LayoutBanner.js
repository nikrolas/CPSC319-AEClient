import React, { Component } from 'react';
import banner_logo from './images/AE_Logo.png';
import Banner from 'react-banner'
import 'react-banner/dist/style.css'

class LayoutBanner extends Component {
    render() {
        return (
            <div>
                <Banner
                    search = {false}
                    logo= {<img src={banner_logo} className="App-logo" alt="logo" />}
                    url={ window.location.pathname }
                    />
            </div>
        );
    }
}

export default LayoutBanner;
