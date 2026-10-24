package com.busgo.util;

import com.busgo.models.HolidayPlan;
import com.busgo.repositories.HolidayPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class HolidayPlanInitializer implements CommandLineRunner {

    private final HolidayPlanRepository holidayPlanRepository;

    public HolidayPlanInitializer(HolidayPlanRepository holidayPlanRepository) {
        this.holidayPlanRepository = holidayPlanRepository;
    }

    @Override
    public void run(String... args) {
        if (holidayPlanRepository.count() > 0) {
            return;
        }

        holidayPlanRepository.saveAll(List.of(
                plan("Goa coast & slow mornings", "Mumbai", "Goa", "Beach", "3 days · 2 nights", 1299.0,
                        "/images/hero-bus.jpg", "A relaxed coastal escape with heritage, local food, and time by the sea.",
                        List.of("Sunset at the shore", "Old Goa heritage walk", "Local food & market time"),
                        List.of("Day 1 · Arrive in Goa, check in, and spend the evening by the coast.",
                                "Day 2 · Explore Old Goa, enjoy a relaxed lunch, and catch sunset at the beach.",
                                "Day 3 · Take a slow morning before your return journey.")),
                plan("Jaipur royal weekend", "Delhi", "Jaipur", "Culture", "2 days · 1 night", 599.0,
                        "", "A short city break for forts, pink-hued streets, and local markets.",
                        List.of("Amber Fort & city views", "Pink City streets", "Hawa Mahal photo stop"),
                        List.of("Day 1 · Explore the Pink City, local bazaars, and Hawa Mahal.",
                                "Day 2 · Visit Amber Fort and enjoy a final meal before heading back.")),
                plan("Hyderabad heritage & food", "Bangalore", "Hyderabad", "Culture", "3 days · 2 nights", 999.0,
                        "", "Discover the old city, regional food, and a relaxed evening by the lake.",
                        List.of("Charminar & old city", "Local food trail", "Lakefront evening"),
                        List.of("Day 1 · Settle in and take an evening stroll by Hussain Sagar.",
                                "Day 2 · Visit Charminar and explore the old city food scene.",
                                "Day 3 · Enjoy a relaxed breakfast before your return journey.")),
                plan("Chennai seaside city break", "Bangalore", "Chennai", "Beach", "2 days · 1 night", 699.0,
                        "", "Pair a seaside morning with neighborhood walks and South Indian food.",
                        List.of("Marina Beach sunrise", "Kapaleeshwarar Temple", "South Indian food"),
                        List.of("Day 1 · Discover Mylapore and enjoy an evening by the sea.",
                                "Day 2 · Catch an early beach walk before making your way back.")),
                plan("Pune cafés & city escapes", "Mumbai", "Pune", "City break", "2 days · 1 night", 499.0,
                        "", "A low-key weekend of heritage, café stops, and a change of pace.",
                        List.of("Heritage in the old city", "Café hopping", "A relaxed weekend pace"),
                        List.of("Day 1 · Walk through the old city and try a local café.",
                                "Day 2 · Keep the morning free for a nearby viewpoint before returning."))
        ));
    }

    private HolidayPlan plan(String name, String sourceCity, String destinationCity, String theme,
                             String duration, Double fare, String image, String description,
                             List<String> highlights, List<String> itinerary) {
        HolidayPlan plan = new HolidayPlan();
        plan.setName(name);
        plan.setSourceCity(sourceCity);
        plan.setDestinationCity(destinationCity);
        plan.setTheme(theme);
        plan.setDuration(duration);
        plan.setFare(fare);
        plan.setImage(image);
        plan.setDescription(description);
        plan.setHighlights(highlights);
        plan.setItinerary(itinerary);
        plan.setPublished(true);
        return plan;
    }
}
