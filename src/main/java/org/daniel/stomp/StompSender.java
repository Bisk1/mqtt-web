package org.daniel.stomp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.daniel.model.LogEntry;
import org.daniel.model.MqttPacket;
import org.daniel.model.MqttSessionState;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.internal.wire.MqttWireMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StompSender {

    private static final SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss.SSS");

    private final SimpMessagingTemplate websocket;

    public void sendLog(UUID sessionId, Throwable e) {
        this.websocket.convertAndSend("/topic/" + sessionId + "/log", new LogEntry(formatter.format(new Date()),
                e.getMessage(), e.getCause() == null ? "" : e.getCause().getClass().getSimpleName() + " - " + e.getCause().getMessage()));
    }

    public void sendState(UUID sessionId, MqttSessionState mqttSessionState) {
        log.info("Sending state: " + mqttSessionState);
        this.websocket.convertAndSend("/topic/" + sessionId + "/state", mqttSessionState);
    }

    public void sendPacket(UUID sessionId, MqttWireMessage mqttWireMessage) {
        log.info("Sending packet: " + mqttWireMessage);
        this.websocket.convertAndSend("/topic/" + sessionId + "/packets", MqttPacket.fromWireMessage(mqttWireMessage));
    }
}