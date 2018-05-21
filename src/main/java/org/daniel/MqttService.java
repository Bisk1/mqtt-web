package org.daniel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.daniel.model.MqttConfig;
import org.daniel.stomp.StompSender;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MqttService {
    private final StompSender stompSender;
    private final Map<UUID, MqttSession> sessions = new HashMap<>();

    private static Pattern CLIENT_ID_ALLOWED_CHARS = Pattern.compile("[0-9a-zA-Z]+");

    public void createOrReplaceMqttSessionAndConnect(UUID sessionId, MqttConfig config) {
        if (sessions.containsKey(sessionId)) {
            delete(sessionId);
        }
        MqttSession session = createMqttSession(sessionId, config);
        sessions.put(sessionId, session);
        session.connect();
    }

    private MqttSession createMqttSession(UUID sessionId, MqttConfig config) {
        validateClientId(config.getClientId());
        String broker = config.getProtocol() + "://" + config.getBroker() + ":" + config.getPort();
        String clientId = config.getClientId();
        MemoryPersistence persistence = new MemoryPersistence();

        try {
            log.info("Creating session for client id: " + config.getClientId());
            MqttAsyncClient client = new MqttAsyncClient(broker, clientId, persistence);
            return new MqttSession(client, sessionId, config, stompSender, this);
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private void validateClientId(String clientId) {
        if (clientId == null) {
            throw new IllegalArgumentException("Client ID must not be null");
        }
        if (!CLIENT_ID_ALLOWED_CHARS.matcher(clientId).matches()) {
            throw new IllegalArgumentException("Client ID: '" + clientId + "' contains invalid characters, only " + CLIENT_ID_ALLOWED_CHARS.toString() + " allowed");
        }
    }

    public MqttSession getSession(UUID id) {
        if (sessions.containsKey(id)) {
            MqttSession session = sessions.get(id);
            session.setLastAction(Instant.now());
            return session;
        } else {
            throw new ResourceNotFoundException();
        }
    }

    private static Duration SESSION_TIMEOUT = Duration.ofMinutes(10);

    @Scheduled(fixedDelay = 60000) // every 1 min
    public void deleteInactiveSessions() {
        List<UUID> toRemove = sessions
                .entrySet().stream()
                .filter(entry -> entry.getValue().getLastAction().plus(SESSION_TIMEOUT).isBefore(Instant.now()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        toRemove.forEach(this::delete);
        if (!toRemove.isEmpty()) {
            log.info("Deleted " + toRemove.size() + " inactive sessions");
        }
    }

    public void delete(UUID sessionId) {
        sessions.get(sessionId).close();
        sessions.remove(sessionId);
    }

    public void connect(UUID sessionId) {
        sessions.get(sessionId).connect();
    }

}
