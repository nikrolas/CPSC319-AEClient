import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import CreateRecord from './record/CreateRecord';
import ViewRecord from './record/ViewRecord';
import UpdateRecord from './record/UpdateRecord';
import CreateContainer from "./container/CreateContainer";
import CreateVolume from "./volume/CreateVolume";
import SelectTable from "./search/Results";
import WorkTray from "./search/WorkTray";
import Home from "./search/Home";
import NavigationBar from "./banner/NavigationBar";
import ViewContainer from "./container/ViewContainer";
import UpdateContainer from "./container/UpdateContainer";
import ConfirmAction from "./bulk/ConfirmAction";
import NotAuthenticated from "./errors/NotAuthenticated"
import NotFound from "./errors/NotFound"
import {serviceRoot} from "./api/ServiceRoot";
import {LoadingOverlay} from 'react-load-overlay'
import EmptyNavigationBar from "./banner/EmptyNavigationBar";

import AddToContainer from "./container/AddToContainer";

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
};

const PrivateRoute = ({component, redirectTo, authenticated, general, ...rest}) => {
    return (
        <Route {...rest} render={routeProps => {
            if(authenticated) {
                if (general) {
                    return renderMergedProps(NotAuthenticated)
                }
                else {
                    return renderMergedProps(component, routeProps, rest)
                }
            }
            else {
                return renderMergedProps(NotAuthenticated)
            }
        }}/>
    );
};

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            resultsData: [],
            resultsColumns: [],
            selectedItemIndexes: [],
            confirmActionProps: {},
            userData: null,
            isLogin: false,
            isGeneral:false
        };
    }

    componentWillMount() {
        let user = sessionStorage.getItem('user');
        const search = window.location.search.substr(1);
        const params = new URLSearchParams(search);
        const userId = params.get('userId');
        if (user !== null) {
            let userJson = JSON.parse(user);
            if (userId !== null) {
                if (userId === userJson.id.toString()) {
                    this.userExists(userJson);
                }
                else {
                    this.userChange(userId);
                }
            }
            else {
                this.userExists(userJson);
            }
        }
        else {
            this.userChange(userId);
        }
    }

    userExists(userJson) {
        this.setState({userData: userJson});
        if (userJson.role === "Administrator" || userJson.role === "RMC" || userJson.role === "General") {
            this.setState({
                isLogin: true,
            });
            if( userJson.role === "General") {
                this.setState({
                   isGeneral:true,
                });
            }
        }
        else {
            this.setState({
                isLogin: false,
                isGeneral:false,
            });
        }
    }

    userChange(userId) {
        if (userId !== null) {
            this.setState({loading: true});
            fetch(serviceRoot + "/users/" + userId)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 404) {
                        //TODO display error message?
                        sessionStorage.clear();
                        setTimeout(() => {
                            this.setState({loading: false});
                        }, 1000);
                    }
                    else {
                        sessionStorage.setItem("user", JSON.stringify(data));
                        this.setState({
                            userData: data,
                        });
                        if (data.role === "Administrator" || data.role === "RMC"|| data.role ==="General") {
                            this.setState({
                                isLogin: true,
                            });
                            if( data.role === "General") {
                                this.setState({
                                    isGeneral:true,
                                });
                            }
                        }
                        else {
                            this.setState({
                                isLogin: false,
                                isGeneral:false,
                            });
                        }
                        setTimeout(() => {
                            this.setState({loading: false});
                        }, 1000);
                    }
                })
                .catch(err => {
                    console.error("Error loading record: " + err.message);
                    this.setState({alertMsg: "The application was unable to connect to the server. Please try again later."})
                });
        }
    }

    setselectedItemIndexes = (items) => {
        this.setState({selectedItemIndexes: items});
    };

    setResultsStates = (data, columns) => {
        this.setState({resultsData: data, resultsColumns: columns});
    };

    setConfirmAction = (confirmAction) => {
        this.setState({confirmActionProps: confirmAction});
    };

    render() {
        let overlaySize = {
            width: '100%',
            height: '100',
            zIndex: '10',
            top: '0',
            left: '0',
            position: 'fixed',
        };

        if (this.state.loading) {
            return (
                <LoadingOverlay
                    loading={this.state.loading}
                    spinner={
                        <div>
                            <i className="fa fa-cog fa-spin fa-4x fa-fw"/>
                            <p>Loading user...</p>
                        </div>
                    }
                    overlayStyle={overlaySize}
                >
                    <EmptyNavigationBar/>
                </LoadingOverlay>
            );
        }
        else {
            return (
                <div className="App">
                    <NavigationBar selectedItemIndexes={this.state.selectedItemIndexes}
                                   resultsData={this.state.resultsData}
                                   userData={this.state.userData}
                                   authenticated={this.state.isLogin}/>
                    <Switch>
                        <PrivateRoute exact path='/'
                                      component={Home}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                        />
                        <PrivateRoute path='/createRecord/'
                                      component={CreateRecord}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/viewRecord/:recordId?'
                                      component={ViewRecord}
                                      onItemSelect={this.setselectedItemIndexes}
                                      onDataUpdate={this.setResultsStates}
                                      onSelectAction={this.setConfirmAction}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}

                        />
                        <PrivateRoute path='/updateRecord/:recordId?'
                                      component={UpdateRecord}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/viewContainer/:containerId?'
                                      component={ViewContainer}
                                      onItemSelect={this.setselectedItemIndexes}
                                      onDataUpdate={this.setResultsStates}
                                      onSelectAction={this.setConfirmAction}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/updateContainer/:containerId?'
                                      component={UpdateContainer}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/notAuthorized/'
                                      component={NotAuthenticated}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}

                        />
                        <PrivateRoute path="/results/:searchString?"
                                      component={SelectTable}
                                      onItemSelect={this.setselectedItemIndexes}
                                      onDataUpdate={this.setResultsStates}
                                      onSelectAction={this.setConfirmAction}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}

                        />
                        <PrivateRoute path="/worktray/"
                                      component={WorkTray}
                                      onItemSelect={this.setselectedItemIndexes}
                                      onDataUpdate={this.setResultsStates}
                                      onSelectAction={this.setConfirmAction}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/createContainer/'
                                      component={CreateContainer}
                                      selectedItemIndexes={this.state.selectedItemIndexes}
                                      resultsData={this.state.resultsData}
                                      resultsColumns={this.state.resultsColumns}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/addToContainer/'
                                      component={AddToContainer}
                                      selectedItemIndexes={this.state.selectedItemIndexes}
                                      resultsData={this.state.resultsData}
                                      resultsColumns={this.state.resultsColumns}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/createVolume/'
                                      component={CreateVolume}
                                      selectedItemIndexes={this.state.selectedItemIndexes}
                                      resultsData={this.state.resultsData}
                                      resultsColumns={this.state.resultsColumns}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}

                        />
                        <PrivateRoute path='/confirmAction'
                                      selectedItemIndexes={this.state.selectedItemIndexes}
                                      resultsData={this.state.resultsData}
                                      resultsColumns={this.state.resultsColumns}
                                      component={ConfirmAction}
                                      actionProps={this.state.confirmActionProps}
                                      userData={this.state.userData}
                                      authenticated={this.state.isLogin}
                                      general = {this.state.isGeneral}
                        />
                        <Route path='/notFound' component={NotFound}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            );
        }
    }
}

export default App;
