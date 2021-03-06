import React, {Component} from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getColumns} from "../utilities/ReactTable";
import {recordsResultsAccessors} from "./Results";
import ContextualActions from "../context/ContextualActions";
import {Alert} from 'react-bootstrap';
import {getRecordsByIds} from "../api/RecordsApi";
import {getContainersByIds} from "../api/ContainersApi";

const CheckboxTable = checkboxHOC(ReactTable);

class WorkTray extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            alertMsgs: [],
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            page: 0,
            pageSize: 10,
            user: props.userData,
            onItemSelectCallback: props.onItemSelect,
            onDataUpdateCallback: props.onDataUpdate
        };
    }

    componentWillMount() {
        let stored = localStorage.getItem("tray" + this.state.user.id);
        if (stored && stored.length > 0) {
            stored = JSON.parse(stored);
            let ids = {records: [], containers: []};
            stored.forEach((item) => {
                let type = item["icon"] + "s";
                let id = item["icon"] === "record" ? "id" : "containerId";
                if (ids[type] && item[id])
                    ids[type].push(item[id]);
            });
            this.searchandupdate(ids);
        }
    }

    searchandupdate = (ids) => {
        //console.log(JSON.stringify(ids));
        if (ids) {
            let r = (ids.records && ids.records.length > 0) ? JSON.stringify(ids.records) : "";
            let c = (ids.containers && ids.containers.length > 0) ? JSON.stringify(ids.containers) : "";
            let recordsIds = r ? r.substring(1, r.length - 1) : "";
            let containersIds = c ? c.substring(1, c.length - 1) : "";
            let recordsPromise = recordsIds
                ? getRecordsByIds(recordsIds, this.state.user.id)
                    .then(response => response.json())
                    .then(res => {
                        if (res.error || (res.status && res.status !== 200)) {
                            let status = res.status ? res.status : "";
                            let err = res.error ? " " + res.error : "";
                            let msg = res.message ? ": " + res.message : "";
                            let alertMsgs = [...this.state.alertMsgs];
                            alertMsgs.push("Record: " + status + err + msg);
                            this.setState({alertMsgs});
                            window.scrollTo(0, 0)
                        }
                        else return res;
                    })
                : [];
            let containersPromise = containersIds
                ? getContainersByIds(containersIds, this.state.user.id)
                    .then(response => response.json())
                    .then(res => {
                        if (res.error || (res.status && res.status !== 200)) {
                            let status = res.status ? res.status : "";
                            let err = res.error ? " " + res.error : "";
                            let msg = res.message ? ": " + res.message : "";
                            let alertMsgs = [...this.state.alertMsgs];
                            alertMsgs.push("Container: " + status + err + msg);
                            this.setState({alertMsgs});
                            window.scrollTo(0, 0)
                        }
                        else return res;
                    })
                : [];
            Promise.all([recordsPromise, containersPromise])
                .then(res => {
                    let data = res[0].concat(res[1]).map((item, index) => {
                        const _id = index;
                        const icon = item.hasOwnProperty("number") ? "record" : "container";
                        return {
                            _id,
                            icon,
                            ...item,
                        }
                    });
                    let columns = this.getWorkTrayColumns();
                    this.setState({data, columns}, () => {
                        this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
                        //let data = this.state.data.map((item) => {delete item._id; return item;});
                        localStorage.setItem("tray" + this.state.user.id, JSON.stringify(data));
                        //console.log(localStorage.getItem("tray" + this.state.user.id));
                    });
                })
                .catch(err => console.log(".catch err: " + JSON.stringify(err)));
        }
    };

    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
    }

    getWorkTrayColumns = () => {
        const columns = getColumns(this, recordsResultsAccessors);
        columns.push({
            Header: <button className='btn btn-s'
                            style={styles.removeselbtn}
                            onMouseOver={(e) => {
                                e.target.style.borderColor = '#ff6c60'
                            }}
                            onMouseOut={(e) => {
                                e.target.style.borderColor = 'white'
                            }}
                            onClick={this.removeSelected}>
                <i className="fa fa-remove" style={styles.removeicon}/>
                Selected
            </button>,
            sortable: false,
            resizable: false,
            width: 100,
            Cell: e => <button className="btn btn-xs" onClick={() => {
                this.removeRow(e)
            }} style={{background: 'transparent'}}><i className="fa fa-remove" style={styles.removerowbtn}/></button>
        });
        return columns;
    };

    removeDeleteColumn = (columns) => {
        let columnsCopy = [];
        columns.forEach(col => {
            columnsCopy.push(Object.assign({}, col));
        });
        //remove delete from worktray column (last column)
        columnsCopy.splice(-1, 1);
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
        let rowindex = e.row._index;
        let data = [...this.state.data];
        let original = [...this.state.selection];
        let selection = [];

        data.splice(rowindex, 1);
        data.forEach((item, index) => {
            if (original.includes(item._id)) {
                if (item._id >= rowindex)
                    selection.push(index);
                else selection.push(item._id);
            }
            //recalculate index
            item._id = index;
        });
        this.setState({selection, data}, () => {
            this.state.onItemSelectCallback(this.state.selection);
            this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
        });
        //console.log(JSON.stringify(this.state.data));

        let stored = JSON.parse(localStorage.getItem("tray" + this.state.user.id));
        stored.splice(rowindex, 1);
        localStorage.setItem("tray" + this.state.user.id, JSON.stringify(stored));
        //console.log(JSON.stringify(stored));
    };

    removeAll = () => {
        localStorage.removeItem("tray" + this.state.user.id);
        this.setState({data: [], columns: [], selection: [], selectAll: false}, () => {
            this.state.onItemSelectCallback(this.state.selection);
            this.state.onDataUpdateCallback(this.state.data, this.removeDeleteColumn(this.state.columns));
        });
    };

    removeSelected = () => {
        let selection = [...this.state.selection];
        let stored = [...JSON.parse(localStorage.getItem("tray" + this.state.user.id))];

        let data = stored.filter((item, index) => selection.indexOf(index) < 0);
        localStorage.setItem("tray" + this.state.user.id, JSON.stringify(data));

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
        let selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            let init = this.state.page * this.state.pageSize;
            let final = init + this.state.pageSize - 1;
            currentRecords.forEach((item, index) => {
                if (index >= init && index <= final) selection.push(item._original._id);
            })
        }
        this.setState({selectAll, selection}, () => this.state.onItemSelectCallback(this.state.selection));
    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, removeAll} = this;
        const {data, columns, selectAll, selection, page, pageSize, alertMsgs} = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        let displaymsgs = () => {
            console.log(JSON.stringify(alertMsgs));
            if (alertMsgs.length > 0)
                return alertMsgs.map((msg, index) => {
                    return <h3 key={index}>{msg}</h3>;
                });
        };


        if (this.state.user !== undefined && this.state.user !== null && this.state.user !== "" && this.state.user.role !== "General")
            return (
                <div style={styles.container}>
                    {alertMsgs.length !== 0 && !this.state.success
                        ? <Alert bsStyle="danger">
                            {displaymsgs()}
                            <button onClick={() => {
                                this.setState({alertMsgs: []})
                            }}>Close
                            </button>
                        </Alert>
                        : null
                    }
                    <h1>Work Tray</h1>
                    <div style={styles.btncontainer}>
                        <ContextualActions {...this.props}
                                           selectedItemIndexes={selection}
                                           resultsData={data}
                                           columns={columns}/>
                        <button className='btn btn-s'
                                style={styles.clearbtn}
                                onClick={removeAll}>
                            <i className="fa fa-remove" style={styles.removeiconwhite}/>
                            All
                        </button>
                    </div>
                    <div style={styles.tablecontainer}>
                        <CheckboxTable
                            ref={(r) => this.checkboxTable = r}
                            data={data}
                            columns={columns}
                            page={page}
                            defaultPageSize={pageSize}
                            onPageChange={(page) => this.setState({
                                page,
                                selection: [],
                                selectAll: false
                            }, () => this.state.onItemSelectCallback(this.state.selection))}
                            onPageSizeChange={(pageSize) => this.setState({
                                pageSize,
                                page: 0,
                                selection: [],
                                selectAll: false
                            }, () => this.state.onItemSelectCallback(this.state.selection))}
                            className="-striped -highlight"

                            {...checkboxProps}
                        />
                    </div>
                </div>
            );
        else return null;
    }
}

let styles = {
    container: {
        padding: '2% 5% 5% 5%'
    },
    tablecontainer: {
        marginTop: '5px',
    },
    btncontainer: {
        alignItems: 'center',
        verticalAlign: 'baseline',
        height: '1cm',
        display: 'flex'
    },
    clearbtn: {
        float: 'right',
        marginRight: '0.5cm',
        width: 'auto',
        background: '#ff4e44',
        borderColor: 'white',
        color: 'white',
        fontSize: '13px',
    },
    removerowbtn: {
        color: '#ff6c60',
        transform: 'scale(2,2)',
    },
    removeselbtn: {
        height: '25px',
        padding: '4px',
        width: 'auto',
        backgroundColor: 'white',
    },
    removeicon: {
        color: '#ff6c60',
        background: 'inherit',
        backgroundColor: 'inherit',
        transform: 'scale(1.5,1.5)',
        verticalAlign: 'top',
        marginRight: '5px',
    },
    removeiconwhite: {
        color: 'white',
        background: 'inherit',
        backgroundColor: 'inherit',
        transform: 'scale(1.5,1.5)',
        marginRight: '5px',
    }
};

export default WorkTray;
