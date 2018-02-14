import React, { Component } from 'react';
import ReactTable from 'react-table';
import {Link} from 'react-router-dom';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getRecordsByNumber} from "../APIs/RecordsApi";
const CheckboxTable = checkboxHOC(ReactTable);

//https://react-table.js.org/#/story/select-table-hoc


function getMockData() {
    //TODO
    const testData = [
        {RecordNum: 'EDM-2003/001',
            Title: 'Laboriosam at sapiente temporibus',
            Type: 'Subject',
            State: 'Destroyed',
            Container: '2007/014-EDM',
            Location: 'Edmonton',
            Updated: '2003-12-31'
        },
        {RecordNum: 'EDM-2003/017:1',
            Title: 'Consequatur culpa aute',
            Type: 'Subject',
            State: 'Archived - Interim',
            Container: '2016/181-EDM',
            Location: 'AE Corporate Office - Burnaby - Accounting',
            Updated: '2015-12-31'
        }];
    return testData.map((item)=>{
        const _id = item.RecordNum;
        return {
            _id,
            ...item,
        }
    });
}

function View(key, val) {
    //TODO
    console.log("key: ", key, " val: ",val);
}

function getColumns(data) {
    const columns = [];
    const sample = data[0];
    Object.keys(sample).forEach((key)=>{
        if(key!=='id' && !key.endsWith("Id"))
        {
            switch(key) {
                case 'number': {
                    columns.push({
                        accessor: key,
                        Header: 'Record #',
                        Cell: e => <a href="#" onClick={()=>{View(key, e.value)}}> {e.value} </a>
                    });
                    break;
                }
                case 'RecordNum': {
                    columns.push({
                        accessor: key,
                        Header: 'Record #',
                        Cell: e => <a href="#" onClick={()=>{View(key, e.value)}}> {e.value} </a>
                    });
                    break;
                }
                case 'Container': {
                    columns.push({
                        accessor: key,
                        Header: key,
                        Cell: e => <a href="#" onClick={()=>{View(key, e.value)}}> {e.value} </a>
                    });
                    break;
                }
                default: {
                    columns.push({
                        accessor: key,
                        Header: key,
                    })
                }
            }
        }
    });
/*    let delbtn = {
        'background-color': '#ff6c60',
        'border-color': '#ff6c60',
        color: '#FFFFFF'
    };
    columns.push({
        Header: '',
        id: 'xbutton',
        Cell: e => <button className="btn btn-xs" style={delbtn}><i className="fa fa-trash-o"></i></button>
    });*/
    return columns;
}

class SelectTable extends Component {
    constructor() {
        super();
        const data = getMockData();
        const columns = getColumns(data);
        this.state = {
            data,
            columns,
            selection: [],
            selectAll: false,
        };
    }

    componentWillMount() {
        let setData = this.setData;
        let that = this;
        getRecordsByNumber(this.props.match.params.searchString, 5)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    setData(that, data);
                }
            })
            .catch(err => {
           console.error("Error loading search results: " + err.message);
        });
    }

    setData = (context, data) => {

        data.forEach(result => {
            let keys = Object.keys(result);
            keys.forEach(key => {
                if (key.endsWith("At")) {
                    result[key] = new Date(result[key]).toTimeString();
                }
            })
        });

        const columns = getColumns(data);
        context.setState({
            data,
            columns,
            selection: [],
            selectAll: false
        });
    }

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
        //TODO
        let filtered = this.state.data.filter((item) => {
            return this.isSelected(item._id);
        });
        console.log('selection: ', this.state.selection);
        console.log(JSON.stringify(filtered));
    };

    render() {
        const { toggleSelection, toggleAll, isSelected, updateTray } = this;
        const { data, columns, selectAll, } = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        let divstyle = {
            padding: '50px',
        };
        let tablestyle = {
            //'margin-top': '35px',
            paddingTop: '35px',
            //border: '5px solid gray'
        };
        let addbtnstyle = {
            float: 'left',
            display: 'block',
            'background-color': '#b5ff87',
            'border-color': '#FFFFFF',
        };
        let h1style = {
            //display: 'inline',
        };
        return (
            <div style={divstyle}>
                <h1 style={h1style}>Results</h1>
                <Link to="/worktray">
                    <button style={addbtnstyle} className='btn btn-s' onClick={updateTray}>Add to Tray</button>
                </Link>
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
                {this.props.children}
            </div>
        );
    }
}

export default SelectTable;
