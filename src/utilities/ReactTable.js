import React from 'react';

export const accessorHeaderMapping = {
    number: "Number",
    title: "Title",
    type: "Type",
    state: "State",
    containerNumber: "Container",
    classifications: "Classifications",
    location: "Location",
    createdAt: "Created",
    updatedAt: "Updated",
    closedAt: "Closed",
    consignmentCode: "Consignment Code",
    schedule: "Schedule"
};

export function getColumns(context, accessors) {
    const columns = [];
    columns.push({
        accessor: "icon",
        sortable: false,
        resizable: false,
        width: 25,
        Cell: e => <div>{
            e.value === "record" ?
                <i className="fa fa-folder-o" style={{color: '#6de23e'}}/> :
                <i className="fa fa-cube" style={{color: '#3cb5ff'}}/>
        }</div>
    });

    context.handleClick = handleClick;
    if (accessors) {
        accessors.forEach((accessor) => {
            if (accessor === "number") {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    maxWidth: 150,
                    Cell: e => <div style={{textAlign: 'left', paddingLeft: '3px'}}>
                        <a onClick={() => {
                            context.handleClick(accessor, e.row._original.id, 'record')
                        }}> {e.value} </a>
                    </div>
                });
            } else if (accessor === "containerNumber") {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    maxWidth: 150,
                    Cell: e => <a onClick={() => {
                        context.handleClick(accessor, e.row._original.containerId, 'container')
                    }}> {e.value} </a>
                });
            } else if (accessor === "title") {
                columns.push({
                    accessor: accessor,
                    minWidth: 250,
                    Header: accessorHeaderMapping[accessor],
                    Cell: e => <div style={{textAlign: 'left', paddingLeft: '3px'}}>{e.value}</div>
                });
            } else if (accessor === "type") {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    minWidth: 140,
                    //Cell: e => <div style={{textAlign: 'left', paddingLeft: '3px'}}>{e.value}</div>
                });
            } else if (accessor === "consignmentCode") {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    minWidth: 140,
                });
            }
            else {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    maxWidth: 130,
                });
            }
        });
    }
    return columns;
}

export function handleClick(key, id, type) {
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
}

export function setTableState(context, data, columns, callback) {
    context.setState({
        data: data,
        columns: columns,
        selectAll: false,
        selection: []
    }, callback);
    if (!callback) {
        console.warn("You are likely missing a callback to update the navigation bar context!");
    }
}

export function setData(context, data, columns, callback) {
    let rowdata = [];
    if (data) {
        rowdata = data.map((item, index) => {
            const _id = index;
            const icon = item.hasOwnProperty("number") ? "record" : "container";
            return {
                _id,
                icon,
                ...item,
            }
        });
    }
    setTableState(context, rowdata, columns, callback);
}
