package org.daniel.model;

import lombok.Data;

@Data
public class MqttConfig {
    private String protocol;
	private String clientId;
    private String broker;
    private int port;
    private String jwt;
    private boolean spoof;
    private String hostHeader;
}