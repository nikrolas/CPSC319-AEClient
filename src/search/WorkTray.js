import React, { Component } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
const CheckboxTable = checkboxHOC(ReactTable);

//https://react-table.js.org/#/story/select-table-hoc


/*function getColumns(data) {
    console.log(JSON.stringify(data));
    let columns = [];
    if (!data || data.length === 0) {
        return columns;
    }
    let first = data[0];
    let last = data.slice(-1)[0];
    let keyset = new Set(Object.keys(first).concat(Object.keys(last))); //removes duplicates
    Array.from(keyset).forEach((key)=>{
        if(key!=='_id')
        {
            switch(key) {
                case 'RecordNum': {
                    columns.push({
                        accessor: key,
                        Header: 'Record #',
                        Cell: e => <a onClick={()=>{View(key, e.value)}}> {e.value} </a>
                    });
                    break;
                }
                case 'Container': {
                    columns.push({
                        accessor: key,
                        Header: key,
                        Cell: e => <a onClick={()=>{View(key, e.value)}}> {e.value} </a>
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
    let delbtn = {
        'background-color': '#ff6c60',
        'border-color': '#ff6c60',
        color: '#FFFFFF'
    };
    columns.push({
        Header: '',
        id: 'xbutton',
        Cell: e => <button className="btn btn-xs" onClick={} style={delbtn}><i className="fa fa-trash-o"/></button>
    });
    return columns;
}*/

class WorkTray extends Component {
    constructor(props) {
        super(props);
        //console.log(JSON.stringify(this.props.location.state.traydata));
        this.state = {
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            userId: '5'
        };
    }

    componentWillMount() {}
    componentDidMount() {
        const data = this.props.location.state.traydata;
        const columns = this.getColumns(data);
        this.setState( {data, columns} );
    }

    getColumns = (data) => {
        const columns = [];
        if (!data || data.length < 1) {
            return columns;
        }
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
        let delbtn = {
            'background-color': '#ff6c60',
            'border-color': '#ff6c60',
            color: '#FFFFFF'
        };
        columns.push({
            Header: '',
            id: 'xbutton',
            Cell: e => <button className="btn btn-xs" onClick={()=>{this.deleteRow(e)}} style={delbtn}><i className="fa fa-trash-o"/></button>
        });
        return columns;
    };

    handleClick = (key, val, id) => {
        let routePath = "/viewRecord/" + id;
        this.props.history.push(routePath);
        console.log("key: ", key, " val: ", val, " id: ", id);
    };

    deleteRow = (e) => {
        let index = e.row._index;
        console.log(e.row);
        let data = this.state.data;
        data.splice(index, 1);
        this.setState({data});
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
            padding: '50px',
        };
        let tablestyle = {
            //'margin-top': '35px',
            paddingTop: '20px',
            //border: '5px solid gray'
        };
        // let addbtnstyle = {
        //     float: 'left',
        //     display: 'block',
        //     'background-color': '#b5ff87',
        //     'border-color': '#FFFFFF',
        // };
        let h1style = {
            //display: 'inline',
        };
        return (
            <div style={divstyle}>
                <h1 style={h1style}>Work Tray</h1>
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

export default WorkTray;
