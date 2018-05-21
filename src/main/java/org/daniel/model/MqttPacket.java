package org.daniel.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.internal.wire.MqttWireMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class MqttPacket {
    private final boolean isSent;
    private final Type type;
    private final MqttWireMessage wireMessage;

    public static MqttPacket fromWireMessage(MqttWireMessage mqttWireMessage) {
        int typeCode = mqttWireMessage.getType();
        Type type = Type.fromCode(typeCode);
        return new MqttPacket(checkIfSent(type), type, mqttWireMessage);
    }

    private static final List<Type> SENT_TYPES = new ArrayList<>();
    static {
        SENT_TYPES.add(Type.CONNECT);
        SENT_TYPES.add(Type.PUBLISH);
        SENT_TYPES.add(Type.PUBREC);
        SENT_TYPES.add(Type.PUBREL);
        SENT_TYPES.add(Type.SUBSCRIBE);
        SENT_TYPES.add(Type.SUBSCRIBE);
        SENT_TYPES.add(Type.UNSUBSCRIBE);
        SENT_TYPES.add(Type.PINGREQ);
        SENT_TYPES.add(Type.DISCONNECT);
    }

    private static boolean checkIfSent(Type type) {
        return SENT_TYPES.contains(type);
    }

    private enum Type {
        CONNECT(1),
        CONNACK(2),
        PUBLISH(3),
        PUBACK(4),
        PUBREC(5),
        PUBREL(6),
        PUBCOMP(7),
        SUBSCRIBE(8),
        SUBACK(9),
        UNSUBSCRIBE(10),
        UNSUBACK(11),
        PINGREQ(12),
        PINGRESP(13),
        DISCONNECT(14);

        private final int code;

        Type(int code) {
            this.code = code;
        }

        private static Map<Integer, Type> codeToType = new HashMap<>();
        static {
            for (Type type : Type.values()) {
                codeToType.put(type.code, type);
            }
        }

        static Type fromCode(int code) {
            return codeToType.get(code);
        }
    }
}
