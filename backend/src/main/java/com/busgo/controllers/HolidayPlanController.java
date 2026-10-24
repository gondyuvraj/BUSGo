package com.busgo.controllers;

import com.busgo.models.HolidayPlan;
import com.busgo.repositories.HolidayPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/holiday-plans")
@CrossOrigin(origins = "*")
public class HolidayPlanController {

    private final HolidayPlanRepository holidayPlanRepository;

    public HolidayPlanController(HolidayPlanRepository holidayPlanRepository) {
        this.holidayPlanRepository = holidayPlanRepository;
    }

    @GetMapping
    public ResponseEntity<List<HolidayPlan>> getPublishedPlans() {
        return ResponseEntity.ok(holidayPlanRepository.findByPublishedTrueOrderByIdDesc());
    }
}
