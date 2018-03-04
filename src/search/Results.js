import React, {Component} from 'react';
import ReactTable from 'react-table';
import {Link} from 'react-router-dom';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getRecordsByNumber} from "../APIs/RecordsApi";
import Search from "./Search";

const CheckboxTable = checkboxHOC(ReactTable);

class SelectTable extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            tray: [],
            selectvalue: 'records',
            userId: '5',
            searchStringOfData: ''
        };
    }

    componentWillMount() {
        let stored = sessionStorage.getItem("tray" + this.state.userId);
        //console.log("get stored: " + stored);
        if (stored) {
            /*let tray = JSON.parse(stored);
            this.setState({ tray });*/
            /*console.log("get stored stringify: " + JSON.stringify(stored));
            console.log("get stored parsed: " + JSON.parse(stored));*/
            let tray = JSON.parse(stored);
            this.setState({tray});
            //console.log(tray);
            //console.log("tray: "+JSON.stringify(this.state.tray));
        }
        //this.setData(getMockData());
        this.search(this.props.match.params.searchString);
    }

    search = (searchString) => {
        getRecordsByNumber(searchString)
            .then(response => {
                //console.log(response);
                return response.json()
            })
            .then(data => {
                if (data && data.length > 0) {
                    this.setData(data);
                } else {
                    this.setTableState([], []);
                }
                this.setState({searchStringOfData: searchString});
            })
            .catch(err => {
                console.error("Error loading search results: " + err.message);
            });
    };

    setTableState = (data, columns) => {
        this.setState({
            data: data,
            columns: columns
        });
    };

    componentWillReceiveProps(newProps) {
        let searchString = newProps.match.params.searchString;
        if (searchString !== this.state.searchStringOfData) {
            this.search(searchString);
        }
    };


    setData = (data) => {
        const rowdata = data.map((item, index) => {
            let keys = Object.keys(item);
            keys.forEach(key => {
                if (key.endsWith("At")) {
                    item[key] = new Date(item[key]).toTimeString();
                }
            });

            const _id = index;
            return {
                _id,
                ...item,
            }
        });
        const columns = this.getColumns(rowdata);
        this.setTableState(rowdata, columns);
    };

    getColumns = (data) => {
        const columns = [];
        let first = data[0];
        let last = data.slice(-1)[0];
        let keyset = new Set(Object.keys(first).concat(Object.keys(last))); //removes duplicates
        Array.from(keyset).forEach((key) => {
            if (key !== '_id') {
                switch (key) {
                    case 'number': {
                        columns.push({
                            accessor: key,
                            Header: key,
                            Cell: e => <a onClick={() => {
                                this.handleClick(key, e.value, e.row._original.id)
                            }}> {e.value} </a>
                        });
                        break;
                    }
                    case 'container': {
                        columns.push({
                            accessor: key,
                            Header: key,
                            Cell: e => <a onClick={() => {
                                this.handleClick(key, e.value)
                            }}> {e.value} </a>
                        });
                        break;
                    }
                    case 'title':
                    case 'type':
                    case 'state':
                    case 'location':
                    case 'updatedAt': {
                        columns.push({
                            accessor: key,
                            Header: key,
                        });
                        break;
                    }
                    default:
                        break;
                }
            }
        });
        return columns;
    };

    handleClick = (key, val, id) => {
        let routePath = "/viewRecord/" + id;
        this.props.history.push(routePath);
        //console.log("key: ", key, " val: ", val, " id: ", id);
    };

    toggleSelection = (key) => {
        // start off with the existing state
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) { // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ]
        } else { // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({selection});
    };

    toggleAll = () => {
        const selectAll = !this.state.selectAll;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach((item) => {
                selection.push(item._original._id);
            })
        }
        this.setState({selectAll, selection})
    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };

    updateTray = () => {
        //console.log('selection: ', this.state.selection);
        //console.log("tray: "+JSON.stringify(this.state.tray));
        let tray = [...this.state.tray];
        let updated = false;
        this.state.selection.forEach((id) => {
            let selected = Object.assign({}, this.state.data[id]);
            delete selected._id;
            let intray = tray.some((item) => {
                return JSON.stringify(item) === JSON.stringify(selected);
            });
            if (!intray) {
                tray.push(selected);
                updated = true;
            }
        });
        if (updated) {
            this.setState({tray});
            //console.log("tray after: "+JSON.stringify(this.state.tray));
            sessionStorage.setItem("tray" + this.state.userId, JSON.stringify(tray));
            //console.log(sessionStorage.getItem("tray"+this.state.userId));
        }
    };

    handleSelectChange = (e) => {
        this.setState({
            'selectvalue': e.target.value
        });
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, updateTray} = this;
        const {data, columns, selectAll} = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        let container = {
            padding: '5%'
        };
        let tablestyle = {
            //border: '5px solid gray'
            marginTop: '10px',
        };
        let btncontainer = {
            //border: '2px solid blue',
            alignItems: 'center',
            height: '1cm'
        };
        let addbtn = {
            float: 'left',
            backgroundColor: '#b5ff87',
            borderColor: '#FFFFFF',
        };
        let sel = {
            marginLeft: '1cm',
            float: 'left',
            height: '85%',
        };
        /*let h1style = {
            //display: 'inline',
        };*/
        return (
            <div style={container}>
                <div style={{marginBottom: '1cm'}}>
                    <Search searchValue={this.props.match.params.searchString}/>
                </div>
                <div style={btncontainer}>
                    <button style={addbtn} className='btn btn-s' onClick={updateTray}>Add to Tray</button>
                    <select onChange={this.handleSelectChange} style={sel}>
                        <option value='all'>All</option>
                        <option value='records' selected>Records</option>
                        <option value='containers'>Containers</option>
                    </select>
                    <div style={{float: 'left', marginLeft: '1cm', display: 'inline-flex',}}>
                        {/*<Link to={{ pathname: '/worktray/', state: {traydata: tray} }}>Work Tray</Link>*/}
                        <Link to='/worktray/'>Work Tray</Link>
                    </div>
                </div>
                <div style={tablestyle}>
                    <CheckboxTable
                        ref={(r) => this.checkboxTable = r}
                        data={data}
                        columns={columns}
                        defaultPageSize={10}
                        className="-striped -highlight"

                        {...checkboxProps}
                    />
                </div>
            </div>
        );
    }
}

export default SelectTable;
