import React, { Component } from 'react';
import ConfigurationForm from './ConfigurationForm';
import ControlPanel from './ControlPanel';
import LogsTable from './LogsTable';
import PacketsTable from './PacketsTable';
import Summary from './Summary';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Badge from 'material-ui/Badge';

const axios = require('axios');
const stompClient = require('../websocket-listener');

axios.defaults.headers.post['Content-Type'] = 'application/json';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

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
        logs: [],
        unreadLogs: 0,
        packets: [],
        unreadPackets: 0,
        activeTab: 0
    };

    setupStompConnection = sessionId => {
        this.myStompClient = stompClient.register(
            [
                {route: `/topic/${sessionId}/state`, callback: r => this.handleSessionChange(JSON.parse(r.body))},
                {route: `/topic/${sessionId}/log`, callback: r => this.handleNewLogEntry(JSON.parse(r.body))},
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

    handleNewLogEntry = entry => {
        const unreadLogs = this.isLogsTabActive() ? 0 : this.state.unreadLogs + 1;
        this.setState({
            logs:[entry].concat(this.state.logs),
            unreadLogs: unreadLogs
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
        const unreadLogs = this.isLogsTabActive(activeTab) ? 0 : this.state.unreadLogs;
        const unreadPackets = this.isPacketsTabActive(activeTab) ? 0 : this.state.unreadPackets;
        this.setState({
            activeTab: activeTab,
            unreadLogs: unreadLogs,
            unreadPackets: unreadPackets
        });
    };

    render() {
        const activeTab = this.state.activeTab;
        return (
            <div className="App">
                <ControlPanel
                    session={this.state.session}
                    onConnect={this.handleConnect}
                    onDisconnect={this.handleDisconnect}/>
                <Summary
                    session={this.state.session}/>
                <AppBar position="static">
                    <Tabs value={activeTab} onChange={this.handleTabChange}>
                        <Tab label="Configuration" />
                        <Tab label={this.state.unreadLogs > 0 ?
                            <Badge color="secondary" badgeContent={this.state.unreadLogs}>
                                Logs
                            </Badge>
                            : "Logs"
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
                {activeTab === 0 && <ConfigurationForm
                    config={this.state.config}
                    onChange={this.handleChange('config')}/>}
                {activeTab === 1 && <LogsTable logs={this.state.logs} />}
                {activeTab === 2 && <PacketsTable packets={this.state.packets} />}
            </div>
        );
    }
}

export default MqttPanel;
