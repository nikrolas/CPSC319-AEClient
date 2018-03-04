import React, {Component} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = this.createStateFromInput(props.searchValue);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (e) => {
        this.setState(this.createStateFromInput(e.target.value));
    };

    createStateFromInput = (value) => {
        let result = {
            searchValue: '',
            searchPath: ''
        };

        if (value) {
            value = value.trim();
            let encodedSearchString = encodeURIComponent(value);
            result = {
                searchValue: value,
                searchPath: '/results/' + encodedSearchString
            };
        }

        return result;
    };

    render() {
        let searchwrap = {
            //border: '2px solid blue',
            display: 'inline-flex',
            position: 'relative',
            margin: '0px 10px 0px',
            width: '15cm',
            height: '1cm'
        };
        let searchicon = {
            //border: '2px solid red',
            position: 'absolute',
            float: 'left',
            marginTop: '8px',
            marginLeft: '10px',
            fontSize: '20px',
            fill: 'rgba(0, 0, 0, 0)',
            opacity: '0.3',
        };
        let searchbox = {
            width: '100%',
            height: '100%',
            paddingLeft: '1cm',
            paddingRight: '0.5cm',
            fontSize: '15px',
        };
        let submitbtn = {
            //border: '2px solid red',
            float: 'right',
            marginLeft: '0',
            //width: '1.5cm',
            width: '1.2cm',
            height: '100%',
            fill: 'rgba(0, 0, 0, 0)',
            padding: '6px',
        };
        let submiticon = {
            fontSize: '20px',
            //transform: 'scaleX(1.1)',
            transform: 'scale(1.5, 1.5)',
            fill: 'rgba(0, 0, 0, 0)',
            color: '#FFF'
        };

        return (
            <div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <form onSubmit={this.handleSubmit}>
                    <div style={searchwrap}>
                        <i className="fa fa-search" style={searchicon}/>
                        <input type="text" defaultValue={this.state.searchValue} value={this.state.value}
                               onChange={this.handleInputChange} placeholder="Search..." style={searchbox}/>
                        <Link to={this.state.searchPath}>
                            <button type="submit" value="Submit" className='btn btn-default' style={submitbtn}>
                                <i className="material-icons" style={submiticon}>keyboard_arrow_right</i>
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}

export default Search;
