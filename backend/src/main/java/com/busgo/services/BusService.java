package com.busgo.services;

import com.busgo.dto.BusSearchDto.*;
import com.busgo.models.*;
import com.busgo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class BusService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<BusSearchResultDto> searchBuses(String source, String destination, LocalDate journeyDate) {
        List<Schedule> schedules;
        if (source != null && !source.isBlank() && destination != null && !destination.isBlank()) {
            schedules = scheduleRepository.findBySourceAndDestination(source.trim(), destination.trim());
        } else {
            schedules = scheduleRepository.findAll();
        }

        List<BusSearchResultDto> results = new ArrayList<>();
        LocalDate targetDate = (journeyDate != null) ? journeyDate : LocalDate.now();

        for (Schedule s : schedules) {
            BusSearchResultDto dto = new BusSearchResultDto();
            dto.setScheduleId(s.getId());
            dto.setBusId(s.getBus().getId());
            dto.setBusNumber(s.getBus().getBusNumber());
            dto.setOperatorName(s.getBus().getOperatorName());
            dto.setBusType(s.getBus().getBusType());
            dto.setRating(s.getBus().getRating());
            dto.setReviewsCount(s.getBus().getReviewsCount());
            dto.setAmenities(s.getBus().getAmenities());
            dto.setSourceCity(s.getRoute().getSourceCity());
            dto.setDestinationCity(s.getRoute().getDestinationCity());
            dto.setDepartureTime(s.getDepartureTime());
            dto.setArrivalTime(s.getArrivalTime());
            dto.setDurationHours(s.getRoute().getEstimatedDurationHours());
            dto.setFare(s.getFare());
            dto.setBoardingPoint(s.getBoardingPoint());
            dto.setDroppingPoint(s.getDroppingPoint());
            dto.setTotalSeats(s.getBus().getTotalSeats());
            dto.setBusModel(s.getBus().getBusModel());
            dto.setEngineType(s.getBus().getEngineType());

            // Check how many seats are booked for this schedule on this date
            List<Booking> bookings = bookingRepository.findByScheduleIdAndJourneyDateAndBookingStatus(s.getId(), targetDate, "CONFIRMED");
            int bookedCount = 0;
            for (Booking b : bookings) {
                if (b.getSeatNumbers() != null) {
                    bookedCount += b.getSeatNumbers().split(",").length;
                }
            }
            dto.setAvailableSeats(Math.max(0, s.getBus().getTotalSeats() - bookedCount));
            results.add(dto);
        }

        return results;
    }

    public List<SeatStatusDto> getSeatStatusForSchedule(Long scheduleId, LocalDate journeyDate) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        List<Seat> seats = seatRepository.findByBusIdOrderBySeatNumberAsc(schedule.getBus().getId());
        List<Booking> activeBookings = bookingRepository.findByScheduleIdAndJourneyDateAndBookingStatus(scheduleId, journeyDate, "CONFIRMED");

        Set<String> bookedSeatNumbers = new HashSet<>();
        for (Booking b : activeBookings) {
            if (b.getSeatNumbers() != null) {
                for (String seatNum : b.getSeatNumbers().split(",")) {
                    bookedSeatNumbers.add(seatNum.trim());
                }
            }
        }

        List<SeatStatusDto> dtoList = new ArrayList<>();
        for (Seat seat : seats) {
            SeatStatusDto dto = new SeatStatusDto();
            dto.setSeatNumber(seat.getSeatNumber());
            dto.setDeck(seat.getDeck());
            dto.setSeatType(seat.getSeatType());
            dto.setIsWindow(seat.getIsWindow());
            dto.setPrice(schedule.getFare() * (seat.getPriceMultiplier() != null ? seat.getPriceMultiplier() : 1.0));
            dto.setIsBooked(bookedSeatNumbers.contains(seat.getSeatNumber()));
            // Example reserved logic for ladies seating
            dto.setIsLadies(seat.getSeatNumber().equals("L2") || seat.getSeatNumber().equals("L4"));
            dtoList.add(dto);
        }

        return dtoList;
    }

    public List<PopularRouteDto> getPopularRoutes() {
        return List.of(
            new PopularRouteDto("Mumbai", "Pune", 499.0, 36, "3h 30m", "/images/hero-bus.jpg"),
            new PopularRouteDto("Bangalore", "Hyderabad", 899.0, 24, "8h 45m", "/images/bus-interior.jpg"),
            new PopularRouteDto("Delhi", "Jaipur", 599.0, 42, "5h 15m", "/images/hero-bus.jpg"),
            new PopularRouteDto("Mumbai", "Goa", 999.0, 18, "11h 00m", "/images/bus-interior.jpg"),
            new PopularRouteDto("Bangalore", "Chennai", 649.0, 30, "6h 15m", "/images/hero-bus.jpg")
        );
    }

    public List<Bus> getAllBusesRaw() {
        return busRepository.findAll();
    }

    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    public List<String> getAllCities() {
        Set<String> cities = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        List<Route> routes = routeRepository.findAll();
        for (Route r : routes) {
            cities.add(r.getSourceCity());
            cities.add(r.getDestinationCity());
        }
        if (cities.isEmpty()) {
            cities.addAll(List.of("Mumbai", "Pune", "Bangalore", "Hyderabad", "Delhi", "Jaipur", "Goa", "Chennai", "Ahmedabad"));
        }
        return new ArrayList<>(cities);
    }
}
