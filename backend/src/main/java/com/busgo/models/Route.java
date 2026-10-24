package com.busgo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sourceCity;

    @Column(nullable = false)
    private String destinationCity;

    private Integer distanceKm;

    private Double estimatedDurationHours;

    public Route() {}

    public Route(String sourceCity, String destinationCity, Integer distanceKm, Double estimatedDurationHours) {
        this.sourceCity = sourceCity;
        this.destinationCity = destinationCity;
        this.distanceKm = distanceKm;
        this.estimatedDurationHours = estimatedDurationHours;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceCity() { return sourceCity; }
    public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }

    public String getDestinationCity() { return destinationCity; }
    public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }

    public Integer getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Integer distanceKm) { this.distanceKm = distanceKm; }

    public Double getEstimatedDurationHours() { return estimatedDurationHours; }
    public void setEstimatedDurationHours(Double estimatedDurationHours) { this.estimatedDurationHours = estimatedDurationHours; }
}
