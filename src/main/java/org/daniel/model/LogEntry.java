package org.daniel.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.Instant;

@Data
@RequiredArgsConstructor
public class LogEntry {
    private final String time;
    private final String message;
    private final String detail;
}
