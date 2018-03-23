import React, {Component} from 'react';
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
        return (
            <div>
                <form onSubmit={this.handleSubmit} style={styles.searchwrap}>
                    <i className="fa fa-search" style={styles.searchicon}/>
                    <input type="text"
                           id="search"
                           defaultValue={this.state.searchValue}
                           value={this.state.value}
                           onChange={this.handleInputChange}
                           placeholder="Search by record number. e.g. VAN"
                           style={styles.searchbox}/>
                    <Link to={this.state.searchPath}>
                        <button type="submit" value="Submit" className='btn btn-default' style={styles.submitbtn}>
                            <i className="fa fa-angle-right" style={styles.submiticon}/>
                        </button>
                    </Link>
                </form>
            </div>
        )
    }
}

let styles = {
    searchwrap: {
        display: 'inline-flex',
        position: 'relative',
        margin: '0px 10px 0px',
        width: '15cm',
        height: '1cm',
    },
    searchicon: {
        position: 'absolute',
        float: 'left',
        marginTop: '8px',
        marginLeft: '10px',
        fontSize: '20px',
        color: '#2f8bff',
        opacity: '0.7',
    },
    searchbox: {
        width: '100%',
        height: '100%',
        paddingLeft: '1cm',
        paddingRight: '0.5cm',
        fontSize: '15px',
    },
    submitbtn: {
        float: 'right',
        marginLeft: '0',
        width: '1.2cm',
        height: '100%',
        padding: '6px',
        border: 'white',
    },
    submiticon: {
        fontSize: '25px',
        transform: 'scale(1.5, 1.5)',
        fill: 'rgba(87,180,49, 0)',
        color: '#79ff46'
    },
};

export default Search;
