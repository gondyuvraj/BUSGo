package com.busgo.controllers;

import com.busgo.services.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AiAssistantController {

    @Autowired
    private AiAssistantService aiService;

    @PostMapping("/ai/chat")
    public ResponseEntity<?> chatWithAi(@RequestBody Map<String, String> body) {
        String prompt = body.get("message");
        String reply = aiService.generateTravelAnswer(prompt);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "app", "BusGo Backend API",
                "version", "1.0.0",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
