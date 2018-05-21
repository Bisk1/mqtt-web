package org.daniel.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MqttSessionState {
    private ConnectionStatus connectionStatus = ConnectionStatus.DISCONNECTED;
    private List<String> subscribedTopics = new ArrayList<>();


    public enum ConnectionStatus {
        CONNECTING,
        CONNECTED,
        DISCONNECTING,
        DISCONNECTED
    }
}