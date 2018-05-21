package org.daniel.stomp;

import lombok.RequiredArgsConstructor;
import org.daniel.MqttService;
import org.daniel.model.MqttConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@Controller
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StompReceiver {

    private final MqttService mqttService;

    @MessageMapping("/{sessionId}/connect")
    public void handleConfig(@DestinationVariable UUID sessionId, @RequestBody MqttConfig config) {
        System.out.println("received connect for session: " + sessionId);
        mqttService.createOrReplaceMqttSessionAndConnect(sessionId, config);
    }

    @MessageMapping("/{sessionId}/disconnect")
    public void handleConfig(@DestinationVariable UUID sessionId) {
        System.out.println("received disconnect for session: " + sessionId);
        mqttService.delete(sessionId);
    }
}