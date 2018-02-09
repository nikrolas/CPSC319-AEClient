import React, { Component } from 'react';
import banner_logo from './images/AE_Logo.png';
import Banner from 'react-banner'
import 'react-banner/dist/style.css'

class LayoutBanner extends Component {
    render() {
        return (
            <div>
                <Banner
                    logo= {<img src={banner_logo} className="App-logo" alt="logo" />}
                    url={ window.location.pathname }
                    links={[
                        { "title": "New Record", "url": "/createRecord" },
                        { "title": "Another", "url": "/another" },
                        { "title": "Link w/ Children", "url": "/children", "children": [
                                { "title": "John", "url": "/children/john" },
                                { "title": "Jill", "url": "/children/jill" },
                                { "title": "Jack", "url": "/children/jack" }
                            ]}
                    ]} />
            </div>
        );
    }
}

export default LayoutBanner;
