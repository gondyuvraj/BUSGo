package com.busgo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public class HolidayPlanDtos {

    public static class HolidayPlanRequest {
        @NotBlank
        private String name;

        @NotBlank
        private String sourceCity;

        @NotBlank
        private String destinationCity;

        @NotBlank
        private String theme;

        @NotBlank
        private String duration;

        @NotNull
        @Positive
        private Double fare;

        private String image;

        @NotBlank
        private String description;

        @NotEmpty
        private List<@NotBlank String> highlights;

        @NotEmpty
        private List<@NotBlank String> itinerary;

        private boolean published;

        public HolidayPlanRequest() {}

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
        public void setHighlights(List<String> highlights) { this.highlights = highlights; }
        public List<String> getItinerary() { return itinerary; }
        public void setItinerary(List<String> itinerary) { this.itinerary = itinerary; }
        public boolean isPublished() { return published; }
        public void setPublished(boolean published) { this.published = published; }
    }
}
