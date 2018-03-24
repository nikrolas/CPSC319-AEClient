import React, {Component} from 'react';
import {isARecordItem} from "../utilities/Items";
import {MdCreateNewFolder, MdRemoveCircle} from 'react-icons/lib/md';
import {deleteAction, destroyAction, removeRecordsFromContainerAction} from "../bulk/Action";

export function goTo(props, url) {
    props.history.push(url);
}

class ContextualActions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            records: 0,
            containers: 0,
            user: props.userData
        }
    }

    componentWillMount() {
        this.updateCounts(this.props);
    }

    countItemTypes = (selectedItemIndexes, data) => {
        let records = 0;
        let containers = 0;

        selectedItemIndexes.forEach((index) => {
            if (isARecordItem(data[index])) {
                records++;
            } else {
                containers++;
            }
        });

        return {records, containers};
    };

    componentWillReceiveProps(newProps) {
        this.updateCounts(newProps);
    }

    updateCounts = (newProps) => {
        let newCounts = this.countItemTypes(newProps.selectedItemIndexes, newProps.resultsData);
        this.setState(newCounts);
    };

    recordsWithAContainer = () => {
        return this.state.records > 0 && this.state.containers === 1;
    };

    recordsOnly = () => {
        return this.state.records > 0 && this.state.containers === 0;
    };

    anySelection = () => {
        return this.state.records > 0 || this.state.containers > 0;
    };

    enableCreateVolume = () => {
        if (this.state.records > 0 && this.state.containers === 0) {
            let {selectedItemIndexes, resultsData} = this.props;
            let index = -1;
            for (let i = 0; i < selectedItemIndexes.length; i++) {
                if (resultsData[selectedItemIndexes[i]].number.split(":").length <= 2) {
                    index = i;
                    break;
                }
            }
            if (index < 0)
                return false;

            let record = resultsData[selectedItemIndexes[index]];
            let num = record.number.split(":")[0];
            for (let i of selectedItemIndexes) {
                if (resultsData[i].number &&
                    resultsData[i].number.split(":")[0] !== num)
                    return false;
            }
            return true;
        }
        else return false;
    };

    bulkAction = (action) => {
        this.props.onSelectAction(action);
        goTo(this.props, "/confirmAction");
    };


    render() {
        let styles = {
            container: {
                padding: '2% 5% 5% 5%'
            },
            tablestyle: {
                marginTop: '5px',
            },
            btncontainer: {
                marginRight: 'auto',
                verticalAlign: 'baseline',
                height: '1cm'
            },
            delbtn: {
                float: 'left',
                marginRight: '0.5cm',
                backgroundColor: '#ff6c60',
                borderColor: 'white',
                color: 'white',
                fontSize: '13px',
            },
            destroybtn: {
                float: 'left',
                marginRight: '0.5cm',
                backgroundColor: '#ffea65',
                borderColor: 'white',
                color: 'black',
                fontSize: '13px',
            },
            bluebtn: {
                float: 'left',
                marginRight: '0.5cm',
                backgroundColor: '#2f8bff',
                borderColor: 'white',
                color: 'white',
                fontSize: '13px',
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
            },
            volumeicon: {
                marginRight: '5px',
                transform: 'scale(1.55, 1.45)',
                verticalAlign: 'baseline',
            },
        };

        return (
            <div style={styles.btncontainer}>
                <button className='btn btn-s'
                        style={styles.bluebtn}
                        disabled={!this.enableCreateVolume()}
                        onClick={() => {
                            goTo(this.props, "/createVolume")
                        }}>
                    <MdCreateNewFolder style={styles.volumeicon}/>
                    Volume
                </button>
                <button className='btn btn-s'
                        style={styles.bluebtn}
                        disabled={!this.recordsOnly()}
                        onClick={() => {
                            goTo(this.props, "/createContainer")
                        }}>
                    <MdCreateNewFolder style={styles.volumeicon}/>
                    Contain Records
                </button>
                <button className='btn btn-s'
                        style={styles.bluebtn}
                        disabled={!this.recordsWithAContainer()}
                        onClick={() => {
                            goTo(this.props, "/addToContainer")
                        }}>
                    <MdCreateNewFolder style={styles.volumeicon}/>
                    Add to container
                </button>
                <button className='btn btn-s'
                        style={styles.bluebtn}
                        disabled={!this.recordsOnly()}
                        onClick={() => this.bulkAction(removeRecordsFromContainerAction)}>
                    <MdRemoveCircle style={styles.volumeicon}/>
                    Remove from container
                </button>
                <button className='btn btn-s'
                        style={styles.destroybtn}
                        disabled={!this.anySelection()}
                        onClick={() => this.bulkAction(destroyAction)}>
                    <i className="fa fa-flag" style={{marginRight: '5px'}}/>
                    Destroy
                </button>
                <button className='btn btn-s'
                        style={styles.delbtn}
                        disabled={!this.anySelection()}
                        onClick={() => this.bulkAction(deleteAction)}>
                    <i className="fa fa-trash-o" style={{marginRight: '5px'}}/>
                    Delete
                </button>
            </div>

        );
    }
}


export default ContextualActions;
