import React, {Component} from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import {getRecordsByNumber} from "../APIs/RecordsApi";
import {getContainersByNumber} from "../APIs/ContainersApi";
import Search from "./Search";
import {getColumns, setData, setTableState} from "../Utilities/ReactTable";

const CheckboxTable = checkboxHOC(ReactTable);

export const resultsAccessors = ["number", "title", "type", "state", "location", "containerNumber", "consignmentCode", "schedule"];

class SelectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rdata: [],
            cdata: [],
            columns: [],
            selection: [],
            selectAll: false,
            tray: [],
            addbtntext: 'Add to Tray',
            selectvalue: 'none',
            userId: '5',
            onItemSelectCallback: props.onItemSelect,
            onDataUpdateCallback: props.onDataUpdate
        };
    }

    componentWillMount() {
        let stored = sessionStorage.getItem("tray" + this.state.userId);
        //console.log("get stored: " + stored);
        if (stored) {
            /*let tray = JSON.parse(stored);
            this.setState({ tray });*/
            /*console.log("get stored stringify: " + JSON.stringify(stored));
            console.log("get stored parsed: " + JSON.parse(stored));*/
            let tray = JSON.parse(stored);
            this.setState({tray});
            //console.log(tray);
            //console.log("tray: "+JSON.stringify(this.state.tray));
        }
        //this.setData(getMockData());
        this.search(this.props.match.params.searchString);
    }

    componentWillUnmount() {
        this.state.onItemSelectCallback([]);
    }

    tableDataAndSelectionCallback = () => {
        this.state.onItemSelectCallback(this.state.selection);
        this.state.onDataUpdateCallback(this.state.data, this.state.columns);
    };


    search = (searchString) => {
        let recordsPromise = getRecordsByNumber(searchString)
            .then(response => {
                return response.json()
            });
        let containersPromise = getContainersByNumber(searchString)
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
                    this.setState({rdata, cdata});
                    let columns = getColumns(this, resultsAccessors);
                    setData(this, rdata.concat(cdata), columns, this.tableDataAndSelectionCallback);
                } else {
                    setTableState(this, [], [], this.tableDataAndSelectionCallback);
                }
            });
    }

    componentWillReceiveProps(newProps) {
        let searchString = newProps.match.params.searchString;
        if (searchString !== this.props.match.params.searchString) {
            this.search(searchString);
        }
    }
    ;

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
            //console.log("tray after: "+JSON.stringify(this.state.tray));
            sessionStorage.setItem("tray" + this.state.userId, JSON.stringify(tray));
            //console.log(sessionStorage.getItem("tray"+this.state.userId));
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
        this.setState({
            'selectvalue': e.target.value
        });
        switch (e.target.value) {
            case 'records': {
                setData(this, this.state.rdata, this.state.columns);
                break;
            }
            case 'containers': {
                setData(this, this.state.cdata, this.state.columns);
                break;
            }
            default: {
                setData(this, this.state.rdata.concat(this.state.cdata), this.state.columns);
                break;
            }
        }
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, updateTray} = this;
        const {data, columns, selectAll} = this.state;
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
                    <button className='btn btn-s' style={this.addStyle()}
                            onClick={updateTray}>{this.state.addbtntext}</button>
                    <div style={styles.filter}>
                        <h4 style={{float: 'left'}}>Filter:</h4>
                        <select onChange={this.handleSelectChange} style={styles.sel}>
                            <option value='none' selected>None</option>
                            <option value='records'>Records</option>
                            <option value='containers'>Containers</option>
                        </select>
                    </div>
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
        );
    }
}

let
    styles = {
        container: {
            padding: '5%'
        },
        tablestyle: {
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
        },
        addbtn2: {
            float: 'left',
            width: '2.5cm',
            backgroundColor: '#8bffec',
        },
        addbtn3: {
            float: 'left',
            width: '2.5cm',
            backgroundColor: '#ff9c81',
        },
        filter: {
            marginLeft: '0.5cm',
            float: 'left',
            height: '100%',
        },
        sel: {
            marginLeft: '5px',
            marginTop: '3px',
            float: 'left',
            height: '85%',
        },
    };

export default SelectTable;
