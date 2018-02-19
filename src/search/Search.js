import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
/*const routes = (
    <Route exact path='/' component={Search}>
        <Route path="result" component={SelectTable}>
            <Route path="worktray" component={WorkTray}/>
        </Route>
    </Route>
);*/

class Search extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchvalue: '',
            selectvalue: 'records',
            searchPath: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleInputChange = (e) => {
        let encodedSearchString = encodeURIComponent(e.target.value);
        this.setState({
            'searchvalue': e.target.value,
            'searchPath': '/results/' + encodedSearchString
        });
    };
    handleSelectChange = (e) => {
         this.setState({
             'selectvalue': e.target.value
         });
     };

    handleSubmit = (e) => {};

    render() {
        let container = {
            //border: '2px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -40%)',
            //height: '1cm',
            width: '100%',
        };
        let s1 = {
            //border: '2px solid green',
            display: 'inline-flex',
            height: '1cm',
        };
        let sel = {
            height: '1cm'
        };
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
            <div style={container}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <form onSubmit={this.handleSubmit}>
                    <div style={s1}>
                        <select value={this.state.value} onChange={this.handleSelectChange} style={sel}>
                            <option value='all'>All</option>
                            <option value='records'  selected>Records</option>
                            <option value='containers'>Containers</option>
                            <option value='users'>Users</option>
                        </select>
                    </div>

                    <div style={searchwrap}>
                        <i class="fa fa-search" style={searchicon}/>
                        <input type="text"  value={this.state.value} onChange={this.handleInputChange} placeholder="Search..." style={searchbox}/>
                        <Link to={this.state.searchPath}>
                            <button type="submit" value="Submit" className='btn btn-default' style={submitbtn}>
                                {/*<i class="fa fa-arrow-right" style={submiticon}></i>*/}
                                <i class="material-icons" style={submiticon}>keyboard_arrow_right</i>
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}
export default Search;
