import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Search from "./Search";

class Home extends Component {
    render() {
        let container = {
            //border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10%',
            height: '1cm',
        };
        return (
            <div style={container}>
                <Search/>
            </div>
        );
    }
}

export default Home;