package com.busgo.controllers;

import com.busgo.dto.BookingDtos.*;
import com.busgo.models.User;
import com.busgo.services.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal User user, @RequestBody CreateBookingRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User must be authenticated to book tickets"));
        }
        try {
            BookingResponseDto response = bookingService.createBooking(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        List<BookingResponseDto> list = bookingService.getUserBookings(user.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{reference}")
    public ResponseEntity<?> getBookingByRef(@PathVariable String reference) {
        try {
            return ResponseEntity.ok(bookingService.getBookingByReference(reference));
        } catch (Exception ex) {
            return ResponseEntity.status(404).body(Map.of("message", "Booking reference not found"));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CancelBookingRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            BookingResponseDto cancelled = bookingService.cancelBooking(id, user, request);
            return ResponseEntity.ok(cancelled);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
