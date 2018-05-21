package org.daniel.controller;

import lombok.RequiredArgsConstructor;
import org.daniel.MqttService;
import org.daniel.model.MqttConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.IdGenerator;
import org.springframework.util.SimpleIdGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;

@Controller
public class SessionController {
    private final IdGenerator idGenerator = new SimpleIdGenerator();

    @GetMapping(value = "/session")
    public ResponseEntity<Object> createSession() {
        return ResponseEntity.accepted().body(idGenerator.generateId());
    }

}