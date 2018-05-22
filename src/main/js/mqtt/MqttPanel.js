import React, { Component } from 'react';
import ConfigurationForm from './ConfigurationForm';
import ControlPanel from './ControlPanel';
import ErrorsTable from './ErrorsTable';
import PacketsTable from './PacketsTable';
import Summary from './Summary';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Badge from 'material-ui/Badge';

const axios = require('axios');
const stompClient = require('../utils/websocket-listener');

axios.defaults.headers.post['Content-Type'] = 'application/json';

class MqttPanel extends Component {

    state = {
        config: {
            protocol: 'ssl',
            clientId: 'TestClient' + Math.random().toString().substr(2, 6),
            broker: '',
            port: 8883,
            jwt: '',
            spoof: false,
            hostHeader: ''
        },
        session: {
            connectionStatus: 'DISCONNECTED'
        },
        errors: [],
        unreadErrors: 0,
        packets: [],
        unreadPackets: 0,
        activeTab: 0
    };

    setupStompConnection = sessionId => {
        this.myStompClient = stompClient.register(
            [
                {route: `/topic/${sessionId}/state`, callback: r => this.handleSessionChange(JSON.parse(r.body))},
                {route: `/topic/${sessionId}/errors`, callback: r => this.handleNewError(JSON.parse(r.body))},
                {route: `/topic/${sessionId}/packets`, callback: r => this.handleNewPacket(JSON.parse(r.body))}
            ]);
    };

    componentDidMount() {
        const self = this;
        axios.get('session')
            .then(function (response) {
                const sessionId = response.data;
                self.sessionId = sessionId;
                self.setupStompConnection(sessionId);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleConnect = () => {
        this.myStompClient.send(`/app/${this.sessionId}/connect`, {}, JSON.stringify(this.state.config));
    };

    handleDisconnect = () => {
        this.myStompClient.send(`/app/${this.sessionId}/config`, {}, JSON.stringify(this.state.config));
    };

    handleNewPacket = entry => {
        const unreadPackets = this.isPacketsTabActive() ? 0 : this.state.unreadPackets + 1;
        this.setState({
            packets:[entry].concat(this.state.packets),
            unreadPackets: unreadPackets
        });
    };

    handleNewError = entry => {
        const unreadErrors = this.isLogsTabActive() ? 0 : this.state.unreadErrors + 1;
        this.setState({
            errors:[entry].concat(this.state.errors),
            unreadErrors: unreadErrors
        });
    };

    handleSessionChange = session => {
        this.setState({
            session: session
        });
    };

    handleChange = containerName => event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        if (!name) {
            name = target.id; // TODO: use name everywhere
        }

        let newState = Object.assign({}, this.state);
        newState[containerName][name] = value;
        this.setState(newState);
    };

    isLogsTabActive = (activeTab = this.state.activeTab) => {
        return activeTab === 1
    };

    isPacketsTabActive = (activeTab = this.state.activeTab) => {
        return activeTab === 2
    };

    handleTabChange = (event, value) => {
        const activeTab = value;
        const unreadLogs = this.isLogsTabActive(activeTab) ? 0 : this.state.unreadErrors;
        const unreadPackets = this.isPacketsTabActive(activeTab) ? 0 : this.state.unreadPackets;
        this.setState({
            activeTab: activeTab,
            unreadErrors: unreadLogs,
            unreadPackets: unreadPackets
        });
    };

    render() {
        const activeTab = this.state.activeTab;
        return (
            <div className="App">
                <AppBar position="static">
                    <Tabs value={activeTab} onChange={this.handleTabChange}>
                        <Tab label="Configuration" />
                        <Tab label={this.state.unreadErrors > 0 ?
                            <Badge color="secondary" badgeContent={this.state.unreadErrors}>
                                Logs
                            </Badge>
                            : "Errors"
                        }
                        />
                        <Tab label={this.state.unreadPackets > 0 ?
                            <Badge color="secondary" badgeContent={this.state.unreadPackets}>
                                Packets
                            </Badge>
                            : "Packets"
                        } />
                    </Tabs>
                </AppBar>
                <ControlPanel
                    session={this.state.session}
                    onConnect={this.handleConnect}
                    onDisconnect={this.handleDisconnect}/>
                <Summary
                    session={this.state.session}/>
                {activeTab === 0 && <ConfigurationForm
                    config={this.state.config}
                    onChange={this.handleChange('config')}/>}
                {activeTab === 1 && <PacketsTable packets={this.state.packets} />}
                {activeTab === 2 && <ErrorsTable errors={this.state.errors} />}
            </div>
        );
    }
}

export default MqttPanel;
