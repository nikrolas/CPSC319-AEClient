import React, { Component } from 'react';
import ReactTable from 'react-table'
import "react-table/react-table.css";
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import Chance from 'chance';

const CheckboxTable = checkboxHOC(ReactTable);
const chance = new Chance();


//https://react-table.js.org/#/story/select-table-hoc

function getData() {
    //TODO
    const testData = [
        {'Record #': 'EDM-2003/001',
            Title: 'Laboriosam at sapiente temporibus',
            Type: 'Subject',
            State: 'Destroyed',
            Container: '2007/014-EDM',
            Location: 'Edmonton',
            Updated: '2003-12-31'
        },
        {'Record #': 'EDM-2003/017:1',
            Title: 'Consequatur culpa aute',
            Type: 'Subject',
            State: 'Archived - Interim',
            Container: '2016/181-EDM',
            Location: 'AE Corporate Office - Burnaby - Accounting',
            Updated: '2015-12-31'
        }];
    return testData.map((item)=>{
        const _id = chance.guid();
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
        if(key!=='_id')
        {
            if(key === 'Record #' || key === 'Container') {
                columns.push({
                    accessor: key,
                    Header: key,
                    Cell: e => <a href="#" onClick={()=>{View(key, e.value)}}> {e.value} </a>
                })
            }
            else {
                columns.push({
                    accessor: key,
                    Header: key,
                })
            }
        }
    });
    columns.push({
        Header: '',
        id: 'xbutton',
        Cell: e => <button className="btn btn-del btn-xs"><i className="fa fa-trash-o"></i></button>
    });
    return columns;
}

class WorkTray extends Component {
    constructor() {
        super();
        const data = getData();
        const columns = getColumns(data);
        this.state = {
            data,
            columns,
            selection: [],
            selectAll: false,
        };
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

    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { data, columns, selectAll, } = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        let divstyle = {
            margin: '50px'
        };
        return (
            <div style={divstyle}>
                <CheckboxTable
                    ref={(r)=>this.checkboxTable=r}
                    data={data}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"

                    {...checkboxProps}
                />
            </div>
        );
    }
}

export default WorkTray;