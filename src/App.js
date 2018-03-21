import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
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
import NotAuthenticated from "./errors/NotAuthenticated"
import NotFound from "./errors/NotFound"
import {serviceRoot} from "./APIs/ServiceRoot";
import {LoadingOverlay} from 'react-load-overlay'


const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
};

const RouteWrapper = ({component, redirectTo, authenticated, ...rest}) => {
    return (
        <Route {...rest} render={routeProps => {
            return authenticated ? (
                renderMergedProps(component, routeProps, rest)
            ) : (
                renderMergedProps(NotAuthenticated)
            );
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
            userData: null,
            userAuthenticated: false,
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
        if (userJson.role === "Administrator" || userJson.role === "RMC") {
            this.setState({
                userAuthenticated: true,
            });
        }
        else {
            this.setState({
                userAuthenticated: false,
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
                        if (data.role === "Administrator" || data.role === "RMC") {
                            this.setState({
                                userAuthenticated: true,
                            });
                        }
                        else {
                            this.setState({
                                userAuthenticated: false,
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

    render() {

        let overlaySize = {
            width: '100%',
            height: '100',
            zIndex: '10',
            top: '0',
            left: '0',
            position: 'fixed',
        }
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
                </LoadingOverlay>
            );
        }
        else {
            return (
                <div className="App">
                    <NavigationBar selectedItemIndexes={this.state.selectedItemIndexes}
                                   resultsData={this.state.resultsData} userData={this.state.userData}/>
                    <Switch>
                        <RouteWrapper exact path='/' component={Home} authenticated={this.state.userAuthenticated}/>
                        <RouteWrapper path='/createRecord/' component={CreateRecord} userData={this.state.userData}/>
                        <RouteWrapper path='/viewRecord/:recordId?' component={ViewRecord}
                                      userData={this.state.userData}/>
                        <RouteWrapper path='/updateRecord/:recordId?' component={UpdateRecord}
                                      userData={this.state.userData}/>
                        <RouteWrapper path='/viewContainer/:containerId?' component={ViewContainer}/>
                        <RouteWrapper path='/updateContainer/:containerId?' component={UpdateContainer}/>
                        <RouteWrapper path='/notAuthorized/' component={NotAuthenticated}/>
                        <RouteWrapper path="/results/:searchString?" onItemSelect={this.setselectedItemIndexes}
                                      onDataUpdate={this.setResultsStates} component={SelectTable}
                                      userData={this.state.userData} authenticated={this.state.userAuthenticated}/>
                        <RouteWrapper path="/worktray" onItemSelect={this.setselectedItemIndexes}
                                      onDataUpdate={this.setResultsStates} component={WorkTray} userData={this.state.userData} authenticated={this.state.userAuthenticated}/>
                        <RouteWrapper path='/createContainer/' selectedItemIndexes={this.state.selectedItemIndexes}
                                      resultsData={this.state.resultsData} resultsColumns={this.state.resultsColumns}
                                      component={CreateContainer}/>
                        <RouteWrapper path='/createVolume/' selectedItemIndexes={this.state.selectedItemIndexes}
                                      resultsData={this.state.resultsData} resultsColumns={this.state.resultsColumns}
                                      component={CreateVolume} userData={this.state.userData}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            );
        }
    }
}

export default App;
