import React, { Component } from 'react';
import banner_logo from './images/img_ae_wordmark+tagline_colour.png';
import Banner from 'react-banner'
import 'react-banner/dist/style.css'

class LayoutBanner extends Component {
    render() {
        return (
                <Banner
                    search = {false}
                    logo= {<img src={banner_logo} className="App-logo" alt="logo" />}
                    url={ window.location.pathname }
                    links={[
                        { "title": "Search", "url": "/results" },
                        { "title": "Work Tray", "url": "/worktray" },
                        { "title": "New Record", "url": "/createRecord" },

                    ]} />
        );
    }
}

export default LayoutBanner;
