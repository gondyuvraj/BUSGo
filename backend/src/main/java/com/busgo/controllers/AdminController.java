package com.busgo.controllers;

import com.busgo.dto.AdminDtos.*;
import com.busgo.dto.HolidayPlanDtos.HolidayPlanRequest;
import com.busgo.models.*;
import com.busgo.repositories.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private HolidayPlanRepository holidayPlanRepository;

    // Holiday plan management
    @GetMapping("/holiday-plans")
    public ResponseEntity<List<HolidayPlan>> getHolidayPlans() {
        return ResponseEntity.ok(holidayPlanRepository.findAllByOrderByIdDesc());
    }

    @PostMapping("/holiday-plans")
    public ResponseEntity<HolidayPlan> addHolidayPlan(@Valid @RequestBody HolidayPlanRequest request) {
        HolidayPlan plan = new HolidayPlan();
        applyHolidayPlanRequest(plan, request);
        return ResponseEntity.ok(holidayPlanRepository.save(plan));
    }

    @PutMapping("/holiday-plans/{id}")
    public ResponseEntity<HolidayPlan> updateHolidayPlan(
            @PathVariable Long id,
            @Valid @RequestBody HolidayPlanRequest request) {
        return holidayPlanRepository.findById(id)
                .map(plan -> {
                    applyHolidayPlanRequest(plan, request);
                    return ResponseEntity.ok(holidayPlanRepository.save(plan));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/holiday-plans/{id}")
    public ResponseEntity<?> deleteHolidayPlan(@PathVariable Long id) {
        if (!holidayPlanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        holidayPlanRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Holiday plan deleted successfully"));
    }

    private void applyHolidayPlanRequest(HolidayPlan plan, HolidayPlanRequest request) {
        plan.setName(request.getName().trim());
        plan.setSourceCity(request.getSourceCity().trim());
        plan.setDestinationCity(request.getDestinationCity().trim());
        plan.setTheme(request.getTheme().trim());
        plan.setDuration(request.getDuration().trim());
        plan.setFare(request.getFare());
        plan.setImage(request.getImage() == null ? "" : request.getImage().trim());
        plan.setDescription(request.getDescription().trim());
        plan.setHighlights(request.getHighlights().stream().map(String::trim).toList());
        plan.setItinerary(request.getItinerary().stream().map(String::trim).toList());
        plan.setPublished(request.isPublished());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        AdminStatsDto stats = new AdminStatsDto();
        List<Booking> allBookings = bookingRepository.findAll();
        stats.setTotalBookings((long) allBookings.size());

        double revenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getBookingStatus()))
                .mapToDouble(Booking::getTotalAmount)
                .sum();
        stats.setTotalRevenue(Math.round(revenue * 100.0) / 100.0);

        stats.setTotalUsers(userRepository.count());
        stats.setTotalBuses(busRepository.count());
        stats.setTotalRoutes(routeRepository.count());

        // Trend data (simulated 7-day revenue for visual chart)
        List<Map<String, Object>> trend = List.of(
                Map.of("day", "Mon", "revenue", 18500, "bookings", 24),
                Map.of("day", "Tue", "revenue", 22400, "bookings", 28),
                Map.of("day", "Wed", "revenue", 26900, "bookings", 35),
                Map.of("day", "Thu", "revenue", 31200, "bookings", 40),
                Map.of("day", "Fri", "revenue", 48000, "bookings", 62),
                Map.of("day", "Sat", "revenue", 54000, "bookings", 71),
                Map.of("day", "Sun", "revenue", 49500, "bookings", 65)
        );
        stats.setRevenueTrend(trend);

        // Popular route split
        List<Map<String, Object>> routesSplit = List.of(
                Map.of("route", "Mumbai - Pune", "share", 34),
                Map.of("route", "Bangalore - Hyderabad", "share", 28),
                Map.of("route", "Delhi - Jaipur", "share", 20),
                Map.of("route", "Mumbai - Goa", "share", 18)
        );
        stats.setRoutePopularity(routesSplit);

        return ResponseEntity.ok(stats);
    }

    // Bus Management
    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busRepository.findAll());
    }

    @PostMapping("/buses")
    public ResponseEntity<?> addBus(@RequestBody AddBusRequest req) {
        Bus bus = new Bus(
                req.getBusNumber(),
                req.getOperatorName(),
                req.getBusType(),
                req.getTotalSeats() != null ? req.getTotalSeats() : 30,
                req.getAmenities() != null ? req.getAmenities() : "WiFi,Charging Point,Water Bottle",
                req.getRating() != null ? req.getRating() : 4.5,
                req.getReviewsCount() != null ? req.getReviewsCount() : 0
        );

        // Brand & Company
        bus.setBrandName(req.getBrandName());
        bus.setCompanyWebsite(req.getCompanyWebsite());
        bus.setCompanyPhone(req.getCompanyPhone());
        bus.setCompanyEmail(req.getCompanyEmail());
        bus.setEstablishedYear(req.getEstablishedYear());

        // Bus Specs
        bus.setBusModel(req.getBusModel());
        bus.setEngineType(req.getEngineType());
        bus.setBusColor(req.getBusColor());
        bus.setBusAgeYears(req.getBusAgeYears());
        bus.setAverageSpeedKmh(req.getAverageSpeedKmh());

        // Comfort Features
        if (req.getHasAC() != null) bus.setHasAC(req.getHasAC());
        if (req.getHasSleeper() != null) bus.setHasSleeper(req.getHasSleeper());
        if (req.getHasSeater() != null) bus.setHasSeater(req.getHasSeater());
        if (req.getHasWifi() != null) bus.setHasWifi(req.getHasWifi());
        if (req.getHasChargingPoint() != null) bus.setHasChargingPoint(req.getHasChargingPoint());
        if (req.getHasGPS() != null) bus.setHasGPS(req.getHasGPS());
        if (req.getHasCCTV() != null) bus.setHasCCTV(req.getHasCCTV());
        if (req.getHasReadingLight() != null) bus.setHasReadingLight(req.getHasReadingLight());
        if (req.getHasBlanketPillow() != null) bus.setHasBlanketPillow(req.getHasBlanketPillow());
        if (req.getHasWaterBottle() != null) bus.setHasWaterBottle(req.getHasWaterBottle());
        if (req.getHasEmergencySOS() != null) bus.setHasEmergencySOS(req.getHasEmergencySOS());
        if (req.getHasLadiesSeat() != null) bus.setHasLadiesSeat(req.getHasLadiesSeat());
        if (req.getHasPanicButton() != null) bus.setHasPanicButton(req.getHasPanicButton());
        if (req.getHasLiveTracking() != null) bus.setHasLiveTracking(req.getHasLiveTracking());
        if (req.getHasCleanWashroom() != null) bus.setHasCleanWashroom(req.getHasCleanWashroom());

        // Safety
        bus.setInsuranceProvider(req.getInsuranceProvider());
        bus.setPermitNumber(req.getPermitNumber());
        bus.setLastServiceDate(req.getLastServiceDate());

        Bus saved = busRepository.save(bus);

        // Auto-generate seats for this bus
        int countPerDeck = saved.getTotalSeats() / 2;
        for (int i = 1; i <= countPerDeck; i++) {
            boolean isWindow = (i % 3 != 2);
            seatRepository.save(new Seat(saved, "L" + i, "LOWER", "SLEEPER", isWindow, isWindow ? 1.05 : 1.0));
            seatRepository.save(new Seat(saved, "U" + i, "UPPER", "SLEEPER", isWindow, isWindow ? 1.0 : 0.95));
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/buses/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteBus(@PathVariable Long id) {
        Optional<Bus> busOpt = busRepository.findById(id);
        if (busOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Bus bus = busOpt.get();

        // Check if any schedule uses this bus
        List<Schedule> schedules = scheduleRepository.findAll().stream()
                .filter(s -> s.getBus() != null && s.getBus().getId().equals(id))
                .toList();

        for (Schedule s : schedules) {
            boolean hasBookings = bookingRepository.findAll().stream()
                    .anyMatch(b -> b.getSchedule() != null && b.getSchedule().getId().equals(s.getId()));
            if (hasBookings) {
                return ResponseEntity.badRequest().body(Map.of("message",
                        "Cannot delete bus " + bus.getBusNumber() + " because it has existing bookings. Cancel or archive bookings first."));
            }
        }

        // Delete associated schedules safely
        for (Schedule s : schedules) {
            scheduleRepository.delete(s);
        }

        // Delete seats
        List<Seat> seats = seatRepository.findByBusIdOrderBySeatNumberAsc(id);
        if (!seats.isEmpty()) {
            seatRepository.deleteAll(seats);
        }

        busRepository.delete(bus);
        return ResponseEntity.ok(Map.of("message", "Bus deleted successfully"));
    }

    // Routes
    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeRepository.findAll());
    }

    @PostMapping("/routes")
    public ResponseEntity<?> addRoute(@RequestBody AddRouteRequest req) {
        Route route = new Route(req.getSourceCity(), req.getDestinationCity(), req.getDistanceKm(), req.getEstimatedDurationHours());
        return ResponseEntity.ok(routeRepository.save(route));
    }

    @DeleteMapping("/routes/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        if (!routeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Schedule> schedules = scheduleRepository.findByRouteId(id);
        for (Schedule s : schedules) {
            boolean hasBookings = bookingRepository.findAll().stream()
                    .anyMatch(b -> b.getSchedule() != null && b.getSchedule().getId().equals(s.getId()));
            if (hasBookings) {
                return ResponseEntity.badRequest().body(Map.of("message",
                        "Cannot delete this route because it is linked to active schedules with bookings."));
            }
        }
        for (Schedule s : schedules) {
            scheduleRepository.delete(s);
        }
        routeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Route deleted successfully"));
    }

    // Schedules
    @GetMapping("/schedules")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleRepository.findAll());
    }

    @PostMapping("/schedules")
    public ResponseEntity<?> addSchedule(@RequestBody AddScheduleRequest req) {
        Bus bus = busRepository.findById(req.getBusId()).orElseThrow(() -> new RuntimeException("Bus not found"));
        Route route = routeRepository.findById(req.getRouteId()).orElseThrow(() -> new RuntimeException("Route not found"));

        Schedule schedule = new Schedule(
                bus, route, req.getDepartureTime(), req.getArrivalTime(),
                req.getFare(), req.getBoardingPoint(), req.getDroppingPoint()
        );
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }

    @DeleteMapping("/schedules/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        if (!scheduleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        boolean hasBookings = bookingRepository.findAll().stream()
                .anyMatch(b -> b.getSchedule() != null && b.getSchedule().getId().equals(id));
        if (hasBookings) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "Cannot delete schedule because it has existing bookings."));
        }
        scheduleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Schedule deleted successfully"));
    }

    // All Bookings
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/users/{id}/toggle-role")
    public ResponseEntity<?> toggleRole(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if ("ROLE_ADMIN".equals(user.getRole())) {
            user.setRole("ROLE_USER");
        } else {
            user.setRole("ROLE_ADMIN");
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Role updated", "newRole", user.getRole()));
    }
}
