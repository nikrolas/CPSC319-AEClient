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

const CheckboxTable = checkboxHOC(ReactTable);

export const recordsResultsAccessors = ["number", "title", "type", "state", "location", "containerNumber", "consignmentCode"];
export const containersResultsAccessors = ["containerNumber", "title", "state", "location", "consignmentCode"];

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
            addbtntext: 'Add to Tray',
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
        let stored = sessionStorage.getItem("tray" + this.state.user.id);
        if (stored) {
            let tray = JSON.parse(stored);
            this.setState({tray});
        }
    }

    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
    }

    componentWillReceiveProps(newProps) {
        let searchString = newProps.match.params.searchString;
        if (searchString !== this.props.match.params.searchString) {
            this.setState({selectvalue: 'none', record: true, container: true,}, () =>
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
            this.setState({loading: true,}, () => {
                    searchByNumber(searchString, searchOptions, page + 1, pageSize, this.state.user.id)
                        .then(response => {
                            return response.json()
                        })
                        .then((res) => {
                            if (res.error) {
                                let msg = res.status + ": " + res.error;
                                this.setState({alertMsg: msg});
                                window.scrollTo(0, 0)
                            }
                            else if (res.status && res.status !== 200) {
                                //console.log(JSON.stringify(data));
                                this.setState({alertMsg: res.message});
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
                            this.setState({alertMsg: error, loading: false,});
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
            this.setState({tray, addbtntext: 'Success'});
            console.log(this.state.user.id);
            sessionStorage.setItem("tray" + this.state.user.id, JSON.stringify(tray));
            setTimeout(() => {
                this.setState({addbtntext: 'Add to Tray'});
            }, 700);
        }
        else if (this.state.selection.length > 0) {
            this.setState({addbtntext: 'Added'});
            setTimeout(() => {
                this.setState({addbtntext: 'Add to Tray'});
            }, 700);
        }
    };
    addStyle = () => {
        switch (this.state.addbtntext) {
            default: {
                return styles.addbtn;
            }
            case 'Success': {
                return styles.addbtn2;
            }
            case 'Added': {
                return styles.addbtn3;
            }
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
        this.setState({selectvalue: e.target.value, record, container}, () => {
            this.search(this.state.page, this.state.pageSize)
        });
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, updateTray} = this;
        const {data, columns, selectAll, selection, selectvalue, addbtntext, loading, pages, pageSize, alertMsg} = this.state;
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
                    <Search searchValue={this.props.match.params.searchString}/>
                </div>
                <div style={styles.btncontainer}>
                    <button className='btn btn-s'
                            style={this.addStyle()}
                            disabled={!selection.length}
                            onClick={updateTray}>{addbtntext}</button>
                    <ContextualActions {...this.props}
                                       selectedItemIndexes={selection}
                                       resultsData={data}
                                       columns={columns}/>
                    <div style={styles.filter}>
                        <h4 style={{float: 'left'}}>Filter:</h4>
                        <select style={styles.sel}
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
                        pages={pages}
                        defaultPageSize={pageSize}
                        onPageChange={(page) => this.setState({page})}
                        onPageSizeChange={(pageSize, page) => this.setState({pageSize, page})}
                        onFetchData={(state) => this.search(state.page, state.pageSize)}
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
    tablecontainer: {
            //border: '5px solid gray'
            marginTop: '5px',
        },
        btncontainer: {
            //border: '2px solid blue',
            alignItems: 'center',
            height: '1cm'
        },
        addbtn: {
            float: 'left',
            width: '2.5cm',
            backgroundColor: '#b5ff87',
            borderColor: '#FFFFFF',
            marginRight: '0.5cm'
        },
        addbtn2: {
            float: 'left',
            width: '2.5cm',
            backgroundColor: '#8bffec',
            marginRight: '0.5cm'
        },
        addbtn3: {
            float: 'left',
            width: '2.5cm',
            backgroundColor: '#ff9c81',
            marginRight: '0.5cm'
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
