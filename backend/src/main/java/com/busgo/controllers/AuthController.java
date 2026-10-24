package com.busgo.controllers;

import com.busgo.config.JwtTokenProvider;
import com.busgo.dto.AuthDtos.*;
import com.busgo.models.User;
import com.busgo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already registered!"));
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                "ROLE_USER"
        );

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getEmail(), saved.getRole());

        return ResponseEntity.ok(new AuthResponse(
                token, saved.getId(), saved.getName(), saved.getEmail(), saved.getPhone(), saved.getRole()
        ));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password. Please try again."));
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(new AuthResponse(
                token, user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole()
        ));
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("id", user.getId());
        resp.put("name", user.getName());
        resp.put("email", user.getEmail());
        resp.put("phone", user.getPhone() != null ? user.getPhone() : "");
        resp.put("role", user.getRole());
        resp.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/user/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user, @RequestBody UpdateProfileRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        User dbUser = userRepository.findById(user.getId()).orElse(user);
        if (request.getName() != null && !request.getName().isBlank()) {
            dbUser.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            dbUser.setPhone(request.getPhone().trim());
        }
        User saved = userRepository.save(dbUser);

        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("message", "Profile updated successfully!");
        resp.put("name", saved.getName());
        resp.put("phone", saved.getPhone() != null ? saved.getPhone() : "");
        resp.put("email", saved.getEmail());
        resp.put("role", saved.getRole());
        return ResponseEntity.ok(resp);
    }
}
