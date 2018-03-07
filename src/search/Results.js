import React, {Component} from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getRecordsByNumber} from "../APIs/RecordsApi";
import Search from "./Search";

const CheckboxTable = checkboxHOC(ReactTable);
function getMockContainers() {
    return [
        {
            "containerId": 10749,
            "container": "2006.001-TES",
            "title": "Sample Container",
            "consignmentCode": "362817350",
            "createdAt": 1063677156,
            "updatedAt": 1063677156,
            "notes": "This is a note!",
            'Destruction Date': 1063677156
        },
        {
            "containerId": 99999,
            "container": "2006.001-TES",
            "title": "Sample Container 2",
            "consignmentCode": "111111",
            "createdAt": 1063677156,
            "updatedAt": 1063677156,
            "notes": "This is a note!",
            'Destruction Date': 1063677156
        }
    ];
}

class SelectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rdata: [],
            cdata: [],
            columns: [],
            selection: [],
            selectAll: false,
            tray: [],
            addbtntext: 'Add to Tray',
            selectvalue: 'none',
            userId: '5',
            onItemSelectCallback: props.onItemSelect,
            onDataUpdateCallback: props.onDataUpdate
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

    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
    }

    search = (searchString) => {
        getRecordsByNumber(searchString)
            .then(response => {
                //console.log(response);
                return response.json()
            })
            .then(data => {
                if (data && data.length > 0) {
                    //this.setData(data);
                    let rdata = data;
                    let cdata = getMockContainers();
                    this.setState({rdata, cdata});
                    this.setData(rdata.concat(cdata));
                } else {
                    this.setTableState([], []);
                }
            })
            .catch(err => {
                console.error("Error loading search results: " + err.message);
            });
    };

    setTableState = (data, columns) => {
        this.setState({
            data: data,
            columns: columns,
            selectAll: false,
            selection: []
        }, () => {
            this.state.onItemSelectCallback(this.state.selection);
            this.state.onDataUpdateCallback(this.state.data, this.state.columns);
        });
    };

    componentWillReceiveProps(newProps) {
        let searchString = newProps.match.params.searchString;
        if (searchString !== this.props.match.params.searchString) {
            this.search(searchString);
        }
    };


    setData = (data) => {
        const rowdata = data.map((item, index) => {
            /*let keys = Object.keys(item);
            keys.forEach(key => {
                if (key.endsWith("At")) {
                    item[key] = new Date(item[key]).toTimeString();
                }
            });*/

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
                                this.handleClick(key, e.row._original.id, 'record')
                            }}> {e.value} </a>
                        });
                        break;
                    }
                    case 'container': {
                        columns.push({
                            accessor: key,
                            Header: key,
                            Cell: e => <a onClick={() => {
                                this.handleClick(key, e.row._original.containerId, 'container')
                            }}> {e.value} </a>
                        });
                        break;
                    }
                    case 'title':
                    case 'type':
                    case 'state':
                    case 'location':
                    case 'scheduleYear':
                    case 'consignmentCode': {
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

    handleClick = (key, id, type) => {
        let subPath = "";
        if (type === 'record') {
            subPath = "/viewRecord/";
        } else if (type === 'container') {
            subPath = "/viewContainer/";
        }

        if (subPath.length > 0) {
            let routePath = subPath + id;
            this.props.history.push(routePath);
        }
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
        this.setState({selection}, () => this.state.onItemSelectCallback(this.state.selection));
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
        // update the state
        this.setState({selectAll, selection}, () => this.state.onItemSelectCallback(this.state.selection));
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
            this.setState({tray, addbtntext: 'Success'});
            //console.log("tray after: "+JSON.stringify(this.state.tray));
            sessionStorage.setItem("tray" + this.state.userId, JSON.stringify(tray));
            //console.log(sessionStorage.getItem("tray"+this.state.userId));
            setTimeout(() => {this.setState({addbtntext: 'Add to Tray'});}, 700);
        }
        else {
            this.setState({addbtntext: 'Added'});
            setTimeout(() => {this.setState({addbtntext: 'Add to Tray'});}, 700);
        }
    };
    addStyle = () => {
        switch (this.state.addbtntext) {
            default: {
                return styles.addbtn;
            }
            case 'Success': {
                return styles.addbtn2;
            }
            case 'Added': {
                return styles.addbtn3;
            }
        }
    };

    handleSelectChange = (e) => {
        this.setState({
            'selectvalue': e.target.value
        });
        switch (e.target.value) {
            case 'records': {
                this.setData(this.state.rdata);
                break;
            }
            case 'containers': {
                this.setData(this.state.cdata);
                break;
            }
            default: {
                this.setData(this.state.rdata.concat(this.state.cdata));
                break;
            }
        }
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
        return (
            <div style={styles.container}>
                <div style={{marginBottom: '1cm'}}>
                    <Search searchValue={this.props.match.params.searchString}/>
                </div>
                <div style={styles.btncontainer}>
                    <button className='btn btn-s' style={this.addStyle()} onClick={updateTray}>{this.state.addbtntext}</button>
                    <div style={styles.filter}>
                        <h4 style={{float: 'left'}}>Filter:</h4>
                        <select onChange={this.handleSelectChange} style={styles.sel}>
                            <option value='none' selected>None</option>
                            <option value='records'>Records</option>
                            <option value='containers'>Containers</option>
                        </select>
                    </div>
                </div>
                <div style={styles.tablestyle}>
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

let styles = {
    container: {
        padding: '5%'
    },
    tablestyle: {
        //border: '5px solid gray'
        marginTop: '5px',
    },
    btncontainer: {
        //border: '2px solid blue',
        alignItems: 'center',
        height: '1cm'
    },
    addbtn: {
        float: 'left',
        width: '2.5cm',
        backgroundColor: '#b5ff87',
        borderColor: '#FFFFFF',
    },
    addbtn2: {
        float: 'left',
        width: '2.5cm',
        backgroundColor: '#8bffec',
    },
    addbtn3: {
        float: 'left',
        width: '2.5cm',
        backgroundColor: '#ff9c81',
    },
    filter: {
        marginLeft: '0.5cm',
        float: 'left',
        height: '100%',
    },
    sel: {
        marginLeft: '5px',
        marginTop: '3px',
        float: 'left',
        height: '85%',
    },
};

export default SelectTable;
