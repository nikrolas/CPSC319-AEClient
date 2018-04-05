import React, {Component} from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import Search from "./Search";
import {getColumns, setData} from "../utilities/ReactTable";
import ContextualActions from '../context/ContextualActions';
import {searchByNumber} from "../api/SearchApi";
import {Alert} from 'react-bootstrap';
import {isAContainerItem, isARecordItem} from "../utilities/Items";

const CheckboxTable = checkboxHOC(ReactTable);

export const recordsResultsAccessors = ["number", "title", "type", "state", "location", "containerNumber", "consignmentCode"];
export const containersResultsAccessors = ["containerNumber", "title", "state", "locationName", "consignmentCode"];

class SelectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.userData,
            alertMsg: "",
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            tray: [],
            addbtnstate: '',
            selectvalue: 'none',
            record: true,
            container: true,
            loading: false,
            page: 0,
            pages: -1,
            pageSize: 10,
            onItemSelectCallback: props.onItemSelect,
            onDataUpdateCallback: props.onDataUpdate
        };
    }

    componentWillMount() {
        let stored = localStorage.getItem("tray" + this.state.user.id);
        if (stored) {
            let tray = JSON.parse(stored);
            this.setState({tray});
        }
        this.search(this.state.page, this.state.pageSize)
    }

    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
    }

    componentWillReceiveProps(newProps) {
        let searchString = newProps.match.params.searchString;
        if (searchString !== this.props.match.params.searchString) {
            this.setState({selectvalue: 'none', record: true, container: true, page: 0}, () =>
                this.search(this.state.page, this.state.pageSize, searchString)
            );
        }
    }

    tableDataAndSelectionCallback = () => {
        this.state.onItemSelectCallback(this.state.selection);
        this.state.onDataUpdateCallback(this.state.data, this.state.columns);
    };

    search(page, pageSize, num) {
        let searchOptions = {record: this.state.record, container: this.state.container};
        let searchString = num ? num : this.props.match.params.searchString;
        if (searchString && page >= 0) {
            this.setState({loading: true, page, pageSize}, () => {
                    searchByNumber(searchString, searchOptions, page + 1, pageSize, this.state.user.id)
                        .then(response => {
                            return response.json()
                        })
                        .then((res) => {
                            if (res.error || (res.status && res.status !== 200)) {
                                let status = res.status ? res.status : "";
                                let err = res.error ? " " + res.error : "";
                                let msg = res.message ? ": " + res.message : "";
                                let alertMsg = status + err + msg;
                                this.setState({alertMsg});
                                window.scrollTo(0, 0)
                            }
                            else {
                                let accessor = !this.state.record ? containersResultsAccessors : recordsResultsAccessors;
                                let columns = getColumns(this, accessor);
                                setData(this, res.results, columns, () => {
                                    this.tableDataAndSelectionCallback();
                                });
                            }

                            let selectvalue = num ? 'none' : this.state.selectvalue;
                            let pages = res.pageCount ? res.pageCount : -1;
                            this.setState({loading: false, pages, selectvalue, page, pageSize});
                        })
                        .catch(error => {
                            this.setState({alertMsg: error, loading: false});
                            window.scrollTo(0, 0)
                        });
                }
            );
        }
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
        let tray = [...this.state.tray];
        let updated = false;
        this.state.selection.forEach((id) => {
            let selected = Object.assign({}, this.state.data[id]);
            let intray = tray.some((item) => {
                if (isARecordItem(item) && !isAContainerItem(item)) {
                    return item["id"] === selected["id"];
                } else if (isAContainerItem(item)) {
                    return item["containerId"] === selected["containerId"];
                } else {
                    return false;
                }
            });
            if (!intray) {
                //delete selected._id;
                tray.push(selected);
                updated = true;
            }
        });
        if (updated) {
            this.setState({tray, addbtnstate: 'success'});
            localStorage.setItem("tray" + this.state.user.id, JSON.stringify(tray));
            setTimeout(() => {
                this.setState({addbtnstate: ''});
            }, 500);
        }
        else if (this.state.selection.length > 0) {
            this.setState({addbtnstate: 'fail'});
            setTimeout(() => {
                this.setState({addbtnstate: ''});
            }, 500);
        }
    };
    trayBtnText = () => {
        let icon = {
            marginRight: 5,
            color: colors.white,
            transform: 'scale(1.4, 1.4)',
        };
        switch (this.state.addbtnstate) {
            case 'success':
                return <span><i className="fa fa-check" style={icon}/>Success</span>;
            case 'fail':
                return <span><i className="fa fa-remove" style={icon}/>Added</span>;
            default:
                return "Add to Tray";
        }
    };
    addStyle = () => {
        let style = {
            float: 'left',
            width: '2.5cm',
            backgroundColor: colors.lime,
            borderColor: '#FFFFFF',
            marginRight: '0.5cm',
        };
        switch (this.state.addbtnstate) {
            default:
                return style;
            case 'success':
                style["color"] = colors.white;
                style.backgroundColor = colors.green;
                return style;
            case 'fail':
                style["color"] = colors.white;
                style.backgroundColor = colors.red;
                return style;
        }
    };

    handleSelectChange = (e) => {
        let record = true;
        let container = true;
        switch (e.target.value) {
            case 'records': {
                //let columns = getColumns(this, recordsResultsAccessors);
                //setData(this, this.state.rdata, columns, this.tableDataAndSelectionCallback);
                record = true;
                container = false;
                break;
            }
            case 'containers': {
                /*let columns = getColumns(this, containersResultsAccessors);
                setData(this, this.state.cdata, columns, this.tableDataAndSelectionCallback);*/
                record = false;
                container = true;
                break;
            }
            default: {
                /*let columns = getColumns(this, recordsResultsAccessors);
                setData(this, this.state.rdata.concat(this.state.cdata), columns, this.tableDataAndSelectionCallback);*/
                break;
            }
        }
        this.setState({selectvalue: e.target.value, record, container, page: 0}, () => {
            this.search(this.state.page, this.state.pageSize)
        });
    };

    getDecodedSearchString = () => {
        let decodedString = "";
        let searchString = this.props.match.params.searchString;
        if (searchString) {
            decodedString = decodeURIComponent(searchString);
        }
        return decodedString;
    };

    sortThisColumn = (id, desc) => {
        let data = [...this.state.data];
        data.sort((a, b) => this.defaultSortMethod(a[id], b[id]));
        if (desc) data.reverse();
        this.setState({data});
    };
    defaultSortMethod = (a, b, desc) => {
        // force null and undefined to the bottom
        a = (a === null || a === undefined) ? -Infinity : a
        b = (b === null || b === undefined) ? -Infinity : b
        // force any string values to lowercase
        a = typeof a === 'string' ? a.toLowerCase() : a
        b = typeof b === 'string' ? b.toLowerCase() : b
        // Return either 1 or -1 to indicate a sort priority
        if (a > b) {
            return 1
        }
        if (a < b) {
            return -1
        }
        // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
        return 0
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, updateTray} = this;
        const {data, columns, selectAll, selection, selectvalue, addbtnstate, loading, page, pages, pageSize, alertMsg} = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        return (
            <div style={styles.container}>
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
                <div style={{marginBottom: '1cm'}}>
                    <Search searchValue={this.getDecodedSearchString()}/>
                </div>
                <div style={styles.btncontainer}>
                    <button className='btn btn-s'
                            style={this.addStyle()}
                            disabled={!selection.length || !this.state.user || this.state.user.role === "General"}
                            onClick={updateTray}>{addbtnstate ? this.trayBtnText() : "Add to Tray"}</button>
                    <ContextualActions {...this.props}
                                       selectedItemIndexes={selection}
                                       resultsData={data}
                                       columns={columns}/>
                    <div style={styles.filter}>
                        <h4 style={{float: 'left'}}>Filter:</h4>
                        <select
                            id="filterSelect"
                            style={styles.sel}
                            className="form-control"
                            onChange={this.handleSelectChange}
                            value={selectvalue}>
                            <option value='none' selected>None</option>
                            <option value='records'>Records</option>
                            <option value='containers'>Containers</option>
                        </select>
                    </div>
                </div>
                <div style={styles.tablecontainer}>
                    <CheckboxTable
                        manual
                        className="-striped -highlight"
                        ref={(r) => this.checkboxTable = r}
                        data={data}
                        columns={columns}
                        loading={loading}
                        page={page}
                        pages={pages}
                        defaultPageSize={pageSize}
                        onPageChange={(page) => this.setState({page}, () => this.search(page, pageSize))}
                        onPageSizeChange={(pageSize) => this.setState({pageSize}, () => this.search(page, pageSize))}
                        onSortedChange={(newSorted) => this.sortThisColumn(newSorted[0].id, newSorted[0].desc)}
                        {...checkboxProps}
                    />
                </div>
            </div>
        );
    }
}

const colors = {
    blue: '#007aff',
    gray: '#d8d8d8',
    green: '#4cd964',
    red: '#ff3b30',
    white: '#ffffff',
    lime: '#b5ff87',
    cyan: '#8bffec',
    palered: '#ff9c81'
};
let styles = {
    container: {
        padding: '5%'
    },
    tablecontainer: {
        //border: '5px solid gray'
        marginTop: '5px',
    },
    btncontainer: {
        //border: '2px solid blue',
        alignItems: 'center',
        height: '1cm'
    },
    filter: {
        //marginRight: '0.5cm',
        float: 'right',
        height: '100%',
    },
    sel: {
        marginLeft: '5px',
        marginTop: '3px',
        float: 'left',
        height: '85%',
        width: 'auto',
    },
};

export default SelectTable;
