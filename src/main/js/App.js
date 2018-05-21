import React, { Component } from 'react';
import './App.css';
import MqttPanel from './mqtt/MqttPanel';
import logo from './logo/react.svg';
import mqttorg from './logo/mqttorg.svg';
import akamai from './logo/akamai.svg';

class App extends Component {

    render() {
        return (
            <div className="App">
                <header>
                {/*<header className="App-header">*/}
                    {/*<img src={logo} className="App-logo-spinning" alt="react" />*/}
                    {/*<img src={mqttorg} className="App-logo" alt="mqttorg" />*/}
                    {/*<img src={akamai} className="App-logo" alt="akamai" />*/}
                    <h1 className="App-title">MQTT Assistant</h1>
                </header>
                {/*<p className="App-intro">*/}
                    {/*MQTT Assistant*/}
                {/*</p>*/}
                <MqttPanel/>
            </div>
        );
    }
}

export default App;
