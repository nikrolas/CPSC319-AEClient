import React, {Component} from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import Search from "./Search";
import {getColumns, setData} from "../utilities/ReactTable";
import ContextualActions from '../context/ContextualActions';
import {searchByNumber} from "../api/SearchApi";

const CheckboxTable = checkboxHOC(ReactTable);

export const recordsResultsAccessors = ["number", "title", "type", "state", "location", "containerNumber", "consignmentCode"];
export const containersResultsAccessors = ["containerNumber", "title", "state", "location", "consignmentCode"];

class SelectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.userData,
            data: [],
            columns: [],
            selection: [],
            selectAll: false,
            tray: [],
            addbtntext: 'Add to Tray',
            selectvalue: 'none',
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
            this.search(this.state, true, true, searchString);
        }
    }

    tableDataAndSelectionCallback = () => {
        this.state.onItemSelectCallback(this.state.selection);
        this.state.onDataUpdateCallback(this.state.data, this.state.columns);
    };


    /*search = (searchString) => {
        let recordsPromise = getRecordsByNumber(searchString, this.state.user.id)
            .then(response => {
                return response.json()
            });
        let containersPromise = getContainersByNumber(searchString, this.state.user.id)
            .then(response => {
                //console.log(response);
                return response.json()
            });
        let recordsAndContainers = [recordsPromise, containersPromise];
        Promise.all(recordsAndContainers)
            .then(data => {
                if (data && data.length === 2) {
                    let rdata = data[0];
                    let cdata = data[1];
                    let selectvalue = 'none';
                    this.setState({rdata, cdata, selectvalue});
                    let columns = getColumns(this, recordsResultsAccessors);
                    setData(this, rdata.concat(cdata), columns, this.tableDataAndSelectionCallback);
                } else {
                    setTableState(this, [], [], this.tableDataAndSelectionCallback);
                }
            })
            .catch(err => {
                setTableState(this, [], [], this.tableDataAndSelectionCallback);
            });
    };*/
    search(state, record, container, str) {
        this.setState({loading: true});
        let searchString = str ? str : this.props.match.params.searchString;
        let searchOptions = {record: record, container: container};
        searchByNumber(
            searchString,
            searchOptions,
            state.page + 1,
            state.pageSize,
            this.state.user.id
        )
            .then(response => {
                return response.json()
            })
            .then((res) => {
                let accessor = !record ? containersResultsAccessors : recordsResultsAccessors;
                let columns = getColumns(this, accessor);
                setData(this, res.results, columns, () => {
                    this.tableDataAndSelectionCallback();
                });

                let selectvalue = str ? 'none' : this.state.selectvalue;
                this.setState({
                    pages: res.pageCount,
                    loading: false,
                    selectvalue
                });
            })
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
        this.setState({
            selectvalue: e.target.value
        }, this.search(this.state, record, container));
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, updateTray} = this;
        const {data, columns, selectAll, selection, selectvalue, addbtntext, loading, pages, pageSize} = this.state;
        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        return (
            <div style={styles.container}>
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
                        onFetchData={(state) => this.search(state, true, true)}
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
