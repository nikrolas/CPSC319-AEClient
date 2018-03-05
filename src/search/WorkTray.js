import React, { Component } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
const CheckboxTable = checkboxHOC(ReactTable);

class WorkTray extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            userId: '5',
            onItemSelectCallback: props.onItemSelect,
            onDataUpdateCallback: props.onDataUpdate
        };
    }

    componentWillMount() {}
    componentDidMount() {
        //const data = this.props.location.state.traydata;
        let stored = sessionStorage.getItem("tray"+this.state.userId);
        if (stored) {
            //console.log("stored: " + stored);
            const data = JSON.parse(stored).map((item, index)=>{
                const _id = index;
                return {
                    _id,
                    ...item,
                }
            });
            const columns = this.getColumns(data);
            this.setState({data, columns}, () => {
                this.state.onDataUpdateCallback(this.state.data, this.state.columns);
            });
        }
    }
    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
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
        let delbtn = {
            backgroundColor: '#ff6c60',
            borderColor: '#ff6c60',
            color: '#FFFFFF'
        };
        columns.push({
            Header: '',
            id: 'xbutton',
            Cell: e => <button className="btn btn-xs" onClick={()=>{this.deleteRow(e)}} style={delbtn}><i className="fa fa-trash-o"/></button>
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

    deleteRow = (e) => {
        let index = e.row._index;
        //console.log(e.row);

        let data = [...this.state.data];
        data.splice(index, 1);
        this.setState({data}, () => {
            this.state.onDataUpdateCallback(this.state.data, this.state.columns);
        });
        //console.log(JSON.stringify(this.state.data));

        let stored = JSON.parse(sessionStorage.getItem("tray"+this.state.userId));
        stored.splice(index, 1);
        sessionStorage.setItem("tray"+this.state.userId, JSON.stringify(stored));
        //console.log(JSON.stringify(stored));
    };

    getRecordsFromRowIds = (rowIds) => {
        let records = [];
        rowIds.forEach((rowId) => {
            let record = Object.assign({}, this.state.data[rowId]);
            delete record._id;
            records.push(record);
        });
        return records;
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
        this.setState({selectAll, selection}, () => this.state.onItemSelectCallback(this.state.selection));
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
        let container = {
            padding: '5%'
        };
        let tablestyle = {
            //border: '5px solid gray'
            marginTop: '5%',
        };
        return (
            <div style={container}>
                <h1>Work Tray</h1>
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
