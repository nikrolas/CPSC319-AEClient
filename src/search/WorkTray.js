import React, { Component } from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getColumns} from "../Utilities/ReactTable";
import {recordsResultsAccessors} from "./Results";
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
            const columns = this.getWorkTrayColumns();
            this.setState({data, columns}, () => {
                this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
            });
        }
    }
    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
    }

    getWorkTrayColumns = () => {
        const columns = getColumns(this, recordsResultsAccessors);
        columns.push({
            Header: <button className="btn btn-xs"
                            onClick={this.deleteAll}
                            onMouseOver={(e) => {e.target.style.backgroundColor = '#ff9c81'}}
                            onMouseLeave={(e) => {e.target.style.backgroundColor = 'white'}}
                            style={styles.clearbtn}>Clear All</button>,
            sortable: false,
            resizable: false,
            width: 100,
            Cell: e => <button className="btn btn-xs" onClick={()=>{this.deleteRow(e)}} style={styles.delbtn}><i className="fa fa-trash-o"/></button>
        });
        return columns;
    };

    removeDeleteColumn = (columns) => {
        let columnsCopy = JSON.parse(JSON.stringify(columns));
        let index = columnsCopy.findIndex(column => {
            return column.id === 'xbutton';
        });
        columnsCopy.splice(index, 1);
        return columnsCopy;
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
        let data = [...this.state.data];

        //TODO: we may want to keep selection
        this.setState({selection: [], selectAll: false}, () => {
            this.state.onItemSelectCallback(this.state.selection);
        });

        data.splice(index, 1);
        data.forEach((item, index) => {
           //recalculate index
           item._id = index;
        });
        this.setState({data}, () => {
            this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
        });
        //console.log(JSON.stringify(this.state.data));

        let stored = JSON.parse(sessionStorage.getItem("tray"+this.state.userId));
        stored.splice(index, 1);
        sessionStorage.setItem("tray"+this.state.userId, JSON.stringify(stored));
        //console.log(JSON.stringify(stored));
    };

    deleteAll = () => {
        sessionStorage.removeItem("tray"+this.state.userId);
        this.setState({data: [], columns: [], selection: [], selectAll: false}, () => {
            this.state.onItemSelectCallback(this.state.selection);
            this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
        });
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
        return (
            <div style={styles.container}>
                <h1>Work Tray</h1>
                <div style={styles.btncontainer}></div>
                <div style={styles.tablestyle}>
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

let styles = {
    container: {
        padding: '5%'
    },
    tablestyle: {
        //border: '5px solid gray'
        marginTop: '5px',
    },

    delbtn: {
        backgroundColor: '#ff6c60',
        borderColor: '#ff6c60',
        color: 'white'
    },
    btncontainer: {
        //border: '2px solid blue',
        alignItems: 'center',
        height: '1cm'
    },
    clearbtn: {
        //backgroundColor: '#ff9c81',
        backgroundColor: 'white',
        borderColor: '#ff9c81',
    },
};

export default WorkTray;
