package org.daniel;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.daniel.model.MqttConfig;
import org.daniel.model.MqttMessageSentListener;
import org.daniel.model.MqttSessionState;
import org.daniel.stomp.StompSender;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.internal.wire.MqttWireMessage;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
public class MqttSession {
    private final MqttAsyncClient client;
    @Getter
    private final UUID id;
    private final MqttConfig config;
    private final StompSender stompSender;
    private final MqttService mqttService;
    @Getter @Setter
    private Instant lastAction = Instant.now();
    private MqttSessionState state = new MqttSessionState();
    private MqttMessageSentListener mqttMessageSentListener = this::pushMessage;

    public void connect() {
        try {
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setUserName(config.getClientId());
            options.setPassword(config.getJwt().toCharArray());
            updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.CONNECTING);
            client.connect(options, null, mqttMessageSentListener, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    log.info("MQTT connect success");
                    try {
                        asyncActionToken.waitForCompletion();
                        log.info(asyncActionToken.getResponse().toString());
                        updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.CONNECTED);
                        stompSender.sendPacket(id, asyncActionToken.getResponse());
                    } catch (MqttException e) {
                        e.printStackTrace();
                        throw new RuntimeException(e);
                    }
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    log.info("MQTT connect failure");
                    try {
                        asyncActionToken.waitForCompletion();
                        log.info(asyncActionToken.getResponse().toString());
                    } catch (MqttException e) {
                        stompSender.sendLog(id, e);
                        e.printStackTrace();
                        mqttService.delete(id);
                    }
                    updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.DISCONNECTED);
                }
            });
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        log.info("MQTT connect sent");

        updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.CONNECTING);
    }


    public void close() {
        try {
            if (client.isConnected()) {
                updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.DISCONNECTING);
                client.disconnect(null, new IMqttActionListener() {
                    @Override
                    public void onSuccess(IMqttToken asyncActionToken) {
                        updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.DISCONNECTED);
                    }

                    @Override
                    public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                        stompSender.sendLog(id, exception);
                        updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus.DISCONNECTED);
                    }
                });
            }
            client.close();
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void subscribe(String topic, int qos) {
        try {
            client.subscribe(topic, qos, null, mqttMessageSentListener, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    log.info("MQTT subscribe success");
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {

                }
            });

        } catch (MqttException e) {
            stompSender.sendLog(id, e);
            e.printStackTrace();
        }
    }

    private void updateAndPushConnectionStatus(MqttSessionState.ConnectionStatus connectionStatus) {
        state.setConnectionStatus(connectionStatus);
        pushState();
    }

    private void pushState() {
        stompSender.sendState(id, state);
    }

    private void pushMessage(MqttWireMessage mqttWireMessage) {
        stompSender.sendPacket(id, mqttWireMessage);
    }

}
