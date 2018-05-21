package org.daniel.model;

import org.eclipse.paho.client.mqttv3.internal.wire.MqttWireMessage;

public interface MqttMessageSentListener {
    void messageSent(MqttWireMessage message);
}
