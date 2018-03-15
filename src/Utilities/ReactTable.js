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
    context.handleClick = handleClick;
    if (accessors) {
        accessors.forEach((accessor) => {
            if (accessor === "number") {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    Cell: e => <a onClick={() => {
                        context.handleClick(accessor, e.row._original.id, 'record')
                    }}> {e.value} </a>
                });
            } else if (accessor === "containerNumber") {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor],
                    Cell: e => <a onClick={() => {
                        context.handleClick(accessor, e.row._original.containerId, 'container')
                    }}> {e.value} </a>
                });
            } else {
                columns.push({
                    accessor: accessor,
                    Header: accessorHeaderMapping[accessor]
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
    const rowdata = data.map((item, index) => {
        const _id = index;
        return {
            _id,
            ...item,
        }
    });
    setTableState(context, rowdata, columns, callback);
}
