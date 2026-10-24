package com.busgo.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "holiday_plans")
public class HolidayPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String sourceCity;

    @Column(nullable = false)
    private String destinationCity;

    @Column(nullable = false)
    private String theme;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private Double fare;

    @Column(length = 1000)
    private String image;

    @Column(nullable = false, length = 2000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "holiday_plan_highlights", joinColumns = @JoinColumn(name = "holiday_plan_id"))
    @OrderColumn(name = "position")
    @Column(name = "highlight", nullable = false, length = 500)
    private List<String> highlights = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "holiday_plan_itinerary", joinColumns = @JoinColumn(name = "holiday_plan_id"))
    @OrderColumn(name = "position")
    @Column(name = "itinerary_item", nullable = false, length = 1000)
    private List<String> itinerary = new ArrayList<>();

    @Column(nullable = false)
    private boolean published;

    public HolidayPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSourceCity() { return sourceCity; }
    public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }
    public String getDestinationCity() { return destinationCity; }
    public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) {
        this.highlights = highlights == null ? new ArrayList<>() : new ArrayList<>(highlights);
    }
    public List<String> getItinerary() { return itinerary; }
    public void setItinerary(List<String> itinerary) {
        this.itinerary = itinerary == null ? new ArrayList<>() : new ArrayList<>(itinerary);
    }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}
