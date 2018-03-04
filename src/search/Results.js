import React, { Component } from 'react';
import ReactTable from 'react-table';
import {Link} from 'react-router-dom';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getRecordsByNumber} from "../APIs/RecordsApi";
import Search from "./Search";
const CheckboxTable = checkboxHOC(ReactTable);

/*function getMockData() {
        const testData = [
            {
                "id": 31865,
                "title": "Pfeffer, Haag and Kihn - Et commodi at - Voluptatem consequuntur et ut sapiente dolor",
                "number": "20073454.00.P.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507202590",
                "stateId": 4,
                "containerId": 45719,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1233100800000,
                "closedAt": 1224460800000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2008/259-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31866,
                "title": "Frami Group - Sed soluta ut vitae quia omnis",
                "number": "20073454.00.P.01.02",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507202590",
                "stateId": 4,
                "containerId": 45719,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1233100800000,
                "closedAt": 1224460800000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2008/259-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31867,
                "title": "Block and Sons - Dolore et debitis - Ex quos ut quasi",
                "number": "20073454.00.P.03.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507202590",
                "stateId": 4,
                "containerId": 45719,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1233100800000,
                "closedAt": 1224460800000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2008/259-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31868,
                "title": "Orn - Wuckert - Vitae nesciunt dolor ea ea quia",
                "number": "20073454.00.C.05.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507202590",
                "stateId": 4,
                "containerId": 45719,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1233100800000,
                "closedAt": 1224460800000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2008/259-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31869,
                "title": "Denesik - Orn - Rem ea - Rem quasi est temporibus quisquam ut corporis necessitatibus",
                "number": "20073454.00.C.05.03",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507202590",
                "stateId": 4,
                "containerId": 45719,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1233100800000,
                "closedAt": 1224460800000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2008/259-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31870,
                "title": "Klocko, Watsica and Collier - Officiis aut",
                "number": "20073454.00.C.05.08",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507202590",
                "stateId": 4,
                "containerId": 45719,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1233100800000,
                "closedAt": 1224460800000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2008/259-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31859,
                "title": "Cummings - Connelly - Consequatur totam - Ipsum ut",
                "number": "20073453.00.P.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206324",
                "stateId": 4,
                "containerId": 71610,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1281484800000,
                "closedAt": 1277251200000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/217-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31860,
                "title": "Hauck Group - Impedit eligendi est omnis quis",
                "number": "20073453.00.P.01.01",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206324",
                "stateId": 4,
                "containerId": 71610,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1281484800000,
                "closedAt": 1277251200000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/217-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31861,
                "title": "Kris, Schiller and Turcotte - Quis impedit quas et - Ut in facilis praesentium",
                "number": "20073453.00.P.03.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206324",
                "stateId": 4,
                "containerId": 71610,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1281484800000,
                "closedAt": 1277251200000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/217-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31862,
                "title": "Lind - Roberts - Quae omnis quos quidem ipsa fugiat",
                "number": "20073453.00.A.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206324",
                "stateId": 4,
                "containerId": 71610,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1281484800000,
                "closedAt": 1277251200000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/217-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31863,
                "title": "Littel, Lueilwitz and Reichert - Sint reprehenderit soluta in - Harum et eum officia et",
                "number": "20073453.00.A.01.02",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206324",
                "stateId": 4,
                "containerId": 71610,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1281484800000,
                "closedAt": 1277251200000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/217-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 31864,
                "title": "Greenfelder - Cole - Voluptatem consequuntur",
                "number": "20073453.00.E.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206324",
                "stateId": 4,
                "containerId": 71610,
                "locationId": 5,
                "createdAt": 1192147200000,
                "updatedAt": 1281484800000,
                "closedAt": 1277251200000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/217-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 32813,
                "title": "Bahringer - Jakubowski - Eligendi alias - Laboriosam maiores ut",
                "number": "20073452.00.A.02.00",
                "scheduleId": 639,
                "typeId": 83,
                "consignmentCode": "507206384",
                "stateId": 4,
                "containerId": 75890,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1294617600000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 30 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/277-EDM",
                "scheduleYear": "30"
            },
            {
                "id": 32817,
                "title": "Renner Inc - Minus rerum - Sint esse numquam quia et nihil",
                "number": "20073452.00.E.05.00",
                "scheduleId": 639,
                "typeId": 83,
                "consignmentCode": "507206384",
                "stateId": 4,
                "containerId": 75890,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1294617600000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 30 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2010/277-EDM",
                "scheduleYear": "30"
            },
            {
                "id": 32810,
                "title": "Bergstrom Inc - Unde cupiditate deleniti et",
                "number": "20073452.00.P.03.01",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206431",
                "stateId": 4,
                "containerId": 79995,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1295568000000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2011/002-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 32811,
                "title": "Kihn - Crist - Alias voluptas veniam magnam mollitia - Doloremque sed",
                "number": "20073452.00.P.04.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206431",
                "stateId": 4,
                "containerId": 79995,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1295568000000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2011/002-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 32812,
                "title": "Rau - Reichel - Est distinctio ad ea molestiae",
                "number": "20073452.00.A.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206431",
                "stateId": 4,
                "containerId": 79995,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1295568000000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2011/002-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 32815,
                "title": "Carroll Inc - Deserunt nemo debitis ratione - Voluptatem eos adipisci natus ducimus accusamus eum et",
                "number": "20073452.00.E.01.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206431",
                "stateId": 4,
                "containerId": 79995,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1295568000000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2011/002-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 32816,
                "title": "Hansen Group - Itaque sunt rerum molestiae nihil consectetur",
                "number": "20073452.00.E.02.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206431",
                "stateId": 4,
                "containerId": 79995,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1295568000000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2011/002-EDM",
                "scheduleYear": "15"
            },
            {
                "id": 32818,
                "title": "Watsica - Kautzer - Incidunt aut ex id voluptas",
                "number": "20073452.00.E.06.00",
                "scheduleId": 638,
                "typeId": 83,
                "consignmentCode": "507206431",
                "stateId": 4,
                "containerId": 79995,
                "locationId": 5,
                "createdAt": 1193356800000,
                "updatedAt": 1295568000000,
                "closedAt": 1294617600000,
                "location": "Edmonton",
                "schedule": "PROJECT RECORDS WITH 15 YEAR RETENTION",
                "type": "Project",
                "state": "Archived - Interim",
                "container": "2011/002-EDM",
                "scheduleYear": "15"
            }
        ];
        return testData;
}*/

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
        let stored = sessionStorage.getItem("tray"+this.state.userId);
        //console.log("get stored: " + stored);
        if (stored) {
            /*let tray = JSON.parse(stored);
            this.setState({ tray });*/
            /*console.log("get stored stringify: " + JSON.stringify(stored));
            console.log("get stored parsed: " + JSON.parse(stored));*/
            let tray = JSON.parse(stored);
            this.setState( { tray } );
            //console.log(tray);
            //console.log("tray: "+JSON.stringify(this.state.tray));
        }
        //this.setData(getMockData());
        this.search(this.props.match.params.searchString);
    }

    search = (searchString) => {
        if (searchString !== this.state.searchStringOfData) {
            getRecordsByNumber(searchString, this.state.userId)
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
        }
    };

    setTableState = (data, columns) => {
        this.setState({
            data: data,
            columns: columns
        });
    };

    componentWillReceiveProps(newProps) {
        let searchString = newProps.match.params.searchString;
        this.search(searchString);
    };


    setData = (data) => {
        const rowdata = data.map((item, index)=>{
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
                            Cell: e => <a onClick={() => {this.handleClick(key, e.value, e.row._original.id)}}> {e.value} </a>
                        });
                        break;
                    }
                    case 'container': {
                        columns.push({
                            accessor: key,
                            Header: key,
                            Cell: e => <a onClick={() => {this.handleClick(key, e.value)}}> {e.value} </a>
                        });
                        break;
                    }
                    case 'title': case 'type': case 'state': case 'location': case 'updatedAt': {
                        columns.push({
                            accessor: key,
                            Header: key,
                        });
                        break;
                    }
                    default: break;
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
        this.setState({ selection });
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
        this.setState({ selectAll, selection })
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
            sessionStorage.setItem("tray"+this.state.userId, JSON.stringify(tray));
            //console.log(sessionStorage.getItem("tray"+this.state.userId));
        }
    };

    handleSelectChange = (e) => {
        this.setState({
            'selectvalue': e.target.value
        });
    };

    render() {
        const { toggleSelection, toggleAll, isSelected, updateTray } = this;
        const { data, columns, selectAll} = this.state;
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
                <h1>Results</h1>
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
                        ref={(r)=>this.checkboxTable=r}
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
