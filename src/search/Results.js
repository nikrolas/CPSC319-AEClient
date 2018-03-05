import React, {Component} from 'react';
import ReactTable from 'react-table';
import {Link} from 'react-router-dom';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getRecordsByNumber} from "../APIs/RecordsApi";
import Search from "./Search";

const CheckboxTable = checkboxHOC(ReactTable);

/*function getMockData() {
        return [
            {
                "title": "Marvin LLC - Dignissimos qui cumque qui omnis ut",
                "number": "20125555.00.P.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "1R 936 1818",
                "containerId": 183236,
                "locationId": 50,
                "classifications": "PROJECT MANAGEMENT/ENGINEERING AGREEMENTS",
                "notes": null,
                "id": 113802,
                "stateId": 4,
                "createdAt": 1352419200000,
                "updatedAt": 1491177600000,
                "closedAt": 1379030400000,
                "location": "St. Catharines",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2015/070-STC",
                "scheduleYear": 15
            },
            {
                "title": "Lindgren - Pollich - Cumque adipisci est incidunt - Fugit ipsa non",
                "number": "20125555.00.P.02.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "1R 936 1818",
                "containerId": 183236,
                "locationId": 50,
                "classifications": "PROJECT MANAGEMENT/PROJECT PLANNING",
                "notes": null,
                "id": 113803,
                "stateId": 4,
                "createdAt": 1352419200000,
                "updatedAt": 1491177600000,
                "closedAt": 1379030400000,
                "location": "St. Catharines",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2015/070-STC",
                "scheduleYear": 15
            },
            {
                "title": "Volkman, Wuckert and Hessel - Dolorum sit nobis sit labore",
                "number": "20125555.00.A.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "1R 936 1818",
                "containerId": 183236,
                "locationId": 50,
                "classifications": "ADVISORY SERVICES/ADVICE",
                "notes": null,
                "id": 113806,
                "stateId": 4,
                "createdAt": 1352419200000,
                "updatedAt": 1491177600000,
                "closedAt": 1379030400000,
                "location": "St. Catharines",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2015/070-STC",
                "scheduleYear": 15
            },
            {
                "title": "Hauck - Klocko - Numquam corrupti",
                "number": "20125555.00.P.03.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "1R 936 1818",
                "containerId": 183236,
                "locationId": 50,
                "classifications": "PROJECT MANAGEMENT/INVOICING AND REPORTING",
                "notes": null,
                "id": 113804,
                "stateId": 4,
                "createdAt": 1352419200000,
                "updatedAt": 1491177600000,
                "closedAt": 1379030400000,
                "location": "St. Catharines",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2015/070-STC",
                "scheduleYear": 15
            },
            {
                "title": "Pouros LLC - Eos ea adipisci dolorem sit - Alias nesciunt id consequatur distinctio rerum ut praesentium",
                "number": "20125555.00.P.04.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "1R 936 1818",
                "containerId": 183236,
                "locationId": 50,
                "classifications": "PROJECT MANAGEMENT/MEETINGS (PROJECT)",
                "notes": null,
                "id": 113805,
                "stateId": 4,
                "createdAt": 1352419200000,
                "updatedAt": 1491177600000,
                "closedAt": 1379030400000,
                "location": "St. Catharines",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2015/070-STC",
                "scheduleYear": 15
            }
        ];
}*/

function getMockContainers() {
    return [
        {
            "containerId":10749,
            "container":"2006.001-TES",
            "title":"Sample Container",
            "consignmentCode":"362817350",
            "createdAt":1063677156,
            "updatedAt":1063677156,
            "notes":"This is a note!",
            'Destruction Date': 1063677156
        },
        {
            "containerId":99999,
            "container":"2006.001-TES",
            "title":"Sample Container 2",
            "consignmentCode":"111111",
            "createdAt":1063677156,
            "updatedAt":1063677156,
            "notes":"This is a note!",
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
            selectvalue: 'all',
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
        getRecordsByNumber(searchString, this.state.userId)
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

        /*let rdata = getMockData();
        let cdata = getMockContainers();
        this.setState({rdata, cdata});
        this.setData(rdata.concat(cdata));*/
    };

    setTableState = (data, columns) => {
        this.setState({
            data: data,
            columns: columns
        }, () => {
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
        this.setState({selectAll, selection}, () => this.state.onItemSelectCallback(this.state.selection))
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
        return (
            <div style={container}>
                <div style={{marginBottom: '1cm'}}>
                    <Search searchValue={this.props.match.params.searchString}/>
                </div>
                <h1>Results</h1>
                <div style={btncontainer}>
                    <button style={addbtn} className='btn btn-s' onClick={updateTray}>Add to Tray</button>
                    <select onChange={this.handleSelectChange} style={sel}>
                        <option value='all' selected>All</option>
                        <option value='records'>Records</option>
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
