package com.busgo.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookingReference; // e.g. "BG-910482"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(nullable = false)
    private LocalDate journeyDate;

    @Column(nullable = false)
    private String seatNumbers; // "L1, L2"

    @Column(columnDefinition = "TEXT")
    private String passengerDetails; // JSON array of passenger objects

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String paymentStatus; // "COMPLETED", "PENDING", "REFUNDED"

    @Column(nullable = false)
    private String bookingStatus; // "CONFIRMED", "CANCELLED"

    private LocalDateTime bookingTime = LocalDateTime.now();

    private Double refundAmount = 0.0;

    @Column(length = 40)
    private String cancellationReason;

    @Column(length = 500)
    private String cancellationReasonDetails;

    public Booking() {}

    public Booking(String bookingReference, User user, Schedule schedule, LocalDate journeyDate,
                   String seatNumbers, String passengerDetails, Double totalAmount,
                   String paymentStatus, String bookingStatus) {
        this.bookingReference = bookingReference;
        this.user = user;
        this.schedule = schedule;
        this.journeyDate = journeyDate;
        this.seatNumbers = seatNumbers;
        this.passengerDetails = passengerDetails;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.bookingStatus = bookingStatus;
        this.bookingTime = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public LocalDate getJourneyDate() { return journeyDate; }
    public void setJourneyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; }

    public String getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }

    public String getPassengerDetails() { return passengerDetails; }
    public void setPassengerDetails(String passengerDetails) { this.passengerDetails = passengerDetails; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getCancellationReasonDetails() { return cancellationReasonDetails; }
    public void setCancellationReasonDetails(String cancellationReasonDetails) {
        this.cancellationReasonDetails = cancellationReasonDetails;
    }
}
