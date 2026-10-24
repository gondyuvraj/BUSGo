package com.busgo.services;

import com.busgo.dto.BookingDtos.*;
import com.busgo.models.*;
import com.busgo.repositories.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public BookingResponseDto createBooking(User user, CreateBookingRequest request) {
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        LocalDate journeyDate = request.getJourneyDate() != null ? request.getJourneyDate() : LocalDate.now();

        if (request.getSeatNumbers() == null || request.getSeatNumbers().isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected to proceed with booking.");
        }

        // 1. REVALIDATE SEAT AVAILABILITY ON SERVER (Prevents double booking race conditions)
        List<Booking> existingActiveBookings = bookingRepository.findByScheduleIdAndJourneyDateAndBookingStatus(
                schedule.getId(), journeyDate, "CONFIRMED");

        Set<String> alreadyBookedSeats = new HashSet<>();
        for (Booking b : existingActiveBookings) {
            if (b.getSeatNumbers() != null) {
                for (String s : b.getSeatNumbers().split(",")) {
                    alreadyBookedSeats.add(s.trim());
                }
            }
        }

        for (String requestedSeat : request.getSeatNumbers()) {
            if (alreadyBookedSeats.contains(requestedSeat.trim())) {
                throw new RuntimeException("Seat " + requestedSeat + " has just been booked by another passenger. Please select alternative seats.");
            }
        }

        // 2. Generate unique booking reference and transaction ID
        String bookingRef = "BG-" + (100000 + new Random().nextInt(900000));
        String txnId = "TXN-" + System.currentTimeMillis();

        String passengerDetailsJson;
        try {
            passengerDetailsJson = objectMapper.writeValueAsString(request.getPassengers());
        } catch (JsonProcessingException e) {
            passengerDetailsJson = "[]";
        }

        String seatNumbersJoined = String.join(", ", request.getSeatNumbers());

        Booking booking = new Booking();
        booking.setBookingReference(bookingRef);
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setJourneyDate(journeyDate);
        booking.setSeatNumbers(seatNumbersJoined);
        booking.setPassengerDetails(passengerDetailsJson);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setPaymentStatus("COMPLETED");
        booking.setBookingStatus("CONFIRMED");
        booking.setBookingTime(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // 3. Record payment
        Payment payment = new Payment(savedBooking, txnId,
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI",
                request.getTotalAmount(), "SUCCESS");
        paymentRepository.save(payment);

        return mapToDto(savedBooking, txnId);
    }

    public List<BookingResponseDto> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingTimeDesc(userId);
        return bookings.stream().map(b -> {
            Optional<Payment> p = paymentRepository.findByBookingId(b.getId());
            String txn = p.map(Payment::getTransactionId).orElse("TXN-DEMO");
            return mapToDto(b, txn);
        }).collect(Collectors.toList());
    }

    public BookingResponseDto getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking reference not found: " + reference));
        Optional<Payment> p = paymentRepository.findByBookingId(booking.getId());
        String txn = p.map(Payment::getTransactionId).orElse("TXN-DEMO");
        return mapToDto(booking, txn);
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, User user, CancelBookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Unauthorized: Cannot cancel another user's booking");
        }

        if ("CANCELLED".equals(booking.getBookingStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (request.getReason() == CancellationReason.OTHER
                && (request.getDetails() == null || request.getDetails().isBlank())) {
            throw new IllegalArgumentException("Please provide details for the other cancellation reason");
        }

        booking.setBookingStatus("CANCELLED");
        booking.setPaymentStatus("REFUNDED");
        booking.setCancellationReason(request.getReason().name());
        booking.setCancellationReasonDetails(request.getReason() == CancellationReason.OTHER
                ? request.getDetails().trim()
                : null);
        // Standard policy: 90% refund if cancelled before travel date
        double refund = Math.round(booking.getTotalAmount() * 0.90 * 100.0) / 100.0;
        booking.setRefundAmount(refund);

        Booking updated = bookingRepository.save(booking);
        Optional<Payment> p = paymentRepository.findByBookingId(updated.getId());
        String txn = p.map(Payment::getTransactionId).orElse("TXN-REFUNDED");
        return mapToDto(updated, txn);
    }

    private BookingResponseDto mapToDto(Booking b, String txnId) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(b.getId());
        dto.setBookingReference(b.getBookingReference());
        dto.setOperatorName(b.getSchedule().getBus().getOperatorName());
        dto.setBusType(b.getSchedule().getBus().getBusType());
        dto.setSourceCity(b.getSchedule().getRoute().getSourceCity());
        dto.setDestinationCity(b.getSchedule().getRoute().getDestinationCity());
        dto.setDepartureTime(b.getSchedule().getDepartureTime());
        dto.setArrivalTime(b.getSchedule().getArrivalTime());
        dto.setJourneyDate(b.getJourneyDate());
        dto.setSeatNumbers(b.getSeatNumbers());
        dto.setPassengerDetails(b.getPassengerDetails());
        dto.setTotalAmount(b.getTotalAmount());
        dto.setPaymentStatus(b.getPaymentStatus());
        dto.setBookingStatus(b.getBookingStatus());
        dto.setTransactionId(txnId);
        dto.setBoardingPoint(b.getSchedule().getBoardingPoint());
        dto.setDroppingPoint(b.getSchedule().getDroppingPoint());
        dto.setCancellationReason(b.getCancellationReason());
        dto.setCancellationReasonDetails(b.getCancellationReasonDetails());
        dto.setRefundAmount(b.getRefundAmount() != null ? b.getRefundAmount() : 0.0);
        return dto;
    }
}
