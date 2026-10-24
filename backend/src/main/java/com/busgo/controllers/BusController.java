package com.busgo.controllers;

import com.busgo.dto.BusSearchDto.*;
import com.busgo.models.Bus;
import com.busgo.services.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "*")
public class BusController {

    @Autowired
    private BusService busService;

    // Search buses by source, destination, date (used by frontend SearchResultsPage)
    @GetMapping("/search")
    public ResponseEntity<List<BusSearchResultDto>> searchBuses(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(busService.searchBuses(from, to, date));
    }

    // All buses with schedules (no filter)
    @GetMapping("/all")
    public ResponseEntity<List<BusSearchResultDto>> getAllBuses() {
        return ResponseEntity.ok(busService.searchBuses(null, null, null));
    }

    // All buses raw from buses table (includes buses without schedules)
    @GetMapping("/list")
    public ResponseEntity<List<Bus>> getBusList() {
        return ResponseEntity.ok(busService.getAllBusesRaw());
    }

    @GetMapping("/popular-routes")
    public ResponseEntity<List<PopularRouteDto>> getPopularRoutes() {
        return ResponseEntity.ok(busService.getPopularRoutes());
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCities() {
        return ResponseEntity.ok(busService.getAllCities());
    }

    @GetMapping("/schedule/{scheduleId}/seats")
    public ResponseEntity<List<SeatStatusDto>> getSeats(
            @PathVariable Long scheduleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate journeyDate = (date != null) ? date : LocalDate.now();
        return ResponseEntity.ok(busService.getSeatStatusForSchedule(scheduleId, journeyDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return busService.getBusById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
