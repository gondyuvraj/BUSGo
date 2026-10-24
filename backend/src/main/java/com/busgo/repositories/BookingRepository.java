package com.busgo.repositories;

import com.busgo.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByBookingTimeDesc(Long userId);
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByScheduleIdAndJourneyDateAndBookingStatus(Long scheduleId, LocalDate journeyDate, String bookingStatus);
    long countByBookingStatus(String bookingStatus);
}
