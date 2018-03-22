import React, {Component} from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getColumns} from "../Utilities/ReactTable";
import {recordsResultsAccessors} from "./Results";
//import {deleteRecordByIds} from "../APIs/RecordsApi";
import {Alert} from 'react-bootstrap';

const CheckboxTable = checkboxHOC(ReactTable);

class WorkTray extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            alertMsg: "",
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            user: props.userData,
            onItemSelectCallback: props.onItemSelect,
            onDataUpdateCallback: props.onDataUpdate
        };
    }

    componentDidMount() {
        //const data = this.props.location.state.traydata;
        let stored = sessionStorage.getItem("tray" + this.state.user.id);
        if (stored) {
            //console.log("stored: " + stored);
            const data = JSON.parse(stored).map((item, index) => {
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
                            onClick={this.removeAll}
                            onMouseOver={(e) => {e.target.style.backgroundColor = '#ff9c81'}}
                            onMouseLeave={(e) => {e.target.style.backgroundColor = 'white'}}
                            style={styles.clearbtn}>Clear All</button>,
            sortable: false,
            resizable: false,
            width: 100,
            Cell: e => <button className="btn btn-xs" onClick={() => {
                this.removeRow(e)
            }} style={styles.trashbtn}><i className="fa fa-trash-o"/></button>
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

    removeRow = (e) => {
        let index = e.row._index;
        let data = [...this.state.data];
        let selection = [...this.state.selection];

        selection.splice(-1,1);
        data.splice(index, 1);
        data.forEach((item, index) => {
           //recalculate index
           item._id = index;
        });
        this.setState({selection, data}, () => {
            this.state.onItemSelectCallback(this.state.selection);
            this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
        });
        //console.log(JSON.stringify(this.state.data));

        let stored = JSON.parse(sessionStorage.getItem("tray" + this.state.user.id));
        stored.splice(index, 1);
        sessionStorage.setItem("tray" + this.state.user.id, JSON.stringify(stored));
        //console.log(JSON.stringify(stored));
    };

    removeAll = () => {
        sessionStorage.removeItem("tray" + this.state.user.id);
        this.setState({data: [], columns: [], selection: [], selectAll: false}, () => {
            this.state.onItemSelectCallback(this.state.selection);
            this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
        });
    };

    removeSelected = () => {
        let selection = [...this.state.selection];
        let stored = [...JSON.parse(sessionStorage.getItem("tray" + this.state.user.id))];

        let data = stored.filter((item, index) => selection.indexOf(index) < 0);
        sessionStorage.setItem("tray" + this.state.user.id, JSON.stringify(data));

        data.forEach((item, index) => {
            //recalculate index
            item._id = index;
        });
        this.setState({selection: [], data, selectAll: false}, () => {
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

    deleteSelected = () => {
        let data = [...this.state.data];
        let selection = [...this.state.selection];
        let recordIds = [];
        selection.forEach((i) => {
            recordIds.push(data[i].id);
        });

        this.setState({alertMsg: "WIP"});
        window.scrollTo(0, 0);

        /*deleteRecordByIds(recordIds, this.state.user.id)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    let msg = data.status + ": " + data.error;
                    this.setState({alertMsg: msg});
                    window.scrollTo(0, 0)
                }
                else if(data.status && data.status !== 200) {
                    //console.log(JSON.stringify(data));
                    this.setState({alertMsg: data.message});
                    window.scrollTo(0, 0)
                }
                else if (data.status === 500) {
                    this.setState({alertMsg: data.message});
                    window.scrollTo(0, 0)
                }
                else {
                    this.removeSelected();
                }
            })
            .catch(error => console.log('Error: ', error));*/
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, removeSelected, deleteSelected} = this;
        const {data, columns, selectAll, selection, alertMsg} = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };

        return (
            <div>
                {alertMsg.length !== 0 && !this.state.success
                    ? <Alert bsStyle="danger">
                        <h3>{alertMsg}</h3>
                        <button onClick={() => {
                            this.setState({alertMsg: ""})
                        }}>Close
                        </button>
                    </Alert>
                    : null
                }
                <div style={styles.container}>
                    <h1>Work Tray</h1>
                    <div style={styles.btncontainer}>
                        <button className='btn btn-s'
                                style={styles.removeselbtn}
                                disabled={!selection.length}
                                onClick={removeSelected}>
                            <i className="fa fa-trash-o" style={{marginRight: '5px'}}/>
                            Selected
                        </button>
                        <button className='btn btn-s'
                                style={styles.delbtn}
                            //disabled="true"
                                disabled={!selection.length}
                                onClick={deleteSelected}>
                            <i className="fa fa-exclamation-triangle" style={{marginRight: '5px'}}/>
                            Delete
                        </button>
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
            </div>
        );
    }
}

let styles = {
    container: {
        padding: '2% 5% 5% 5%'
    },
    tablestyle: {
        //border: '5px solid gray'
        marginTop: '5px',
    },

    trashbtn: {
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
    removeselbtn: {
        float: 'left',
        width: 'auto',
        backgroundColor: '#ff6c60',
        borderColor: '#FFFFFF',
        color: 'white',
        fontSize: '13px',
    },
    delbtn: {
        float: 'left',
        width: 'auto',
        marginLeft: '0.5cm',
        backgroundColor: '#ffea65',
        borderColor: '#FFFFFF',
        fontSize: '13px',
    }
};

export default WorkTray;
