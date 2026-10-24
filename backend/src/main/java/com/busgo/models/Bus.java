package com.busgo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Core Identity ─────────────────────────────────────────
    @Column(nullable = false, unique = true)
    private String busNumber;           // "MH-01-BG-1001"

    @Column(nullable = false)
    private String operatorName;        // "Zingbus Electric Multi-Axle"

    @Column(nullable = false)
    private String busType;             // "AC_SLEEPER", "AC_SEATER", "NON_AC_SLEEPER", "NON_AC_SEATER"

    // ── Capacity ──────────────────────────────────────────────
    @Column(nullable = false)
    private Integer totalSeats;

    // ── Amenities (comma-separated) ───────────────────────────
    private String amenities;           // "WiFi,Charging Point,Water Bottle,Blanket"

    // ── Ratings ───────────────────────────────────────────────
    private Double rating = 4.5;
    private Integer reviewsCount = 0;

    // ── Brand & Company Info ──────────────────────────────────
    private String brandName;           // "Zingbus", "VRL", "SRS", "Orange Travels"
    private String companyWebsite;      // "https://zingbus.com"
    private String companyPhone;        // "+91 98765 43210"
    private String companyEmail;        // "support@zingbus.com"
    private String establishedYear;     // "2018"

    // ── Bus Specs ─────────────────────────────────────────────
    private String busModel;            // "Volvo 9600", "Scania Metrolink", "SML Isuzu"
    private String engineType;          // "DIESEL", "ELECTRIC", "CNG", "HYBRID"
    private String busColor;            // "#FF6B35" or "Orange & White"
    private Integer busAgeYears;        // 2 (bus is 2 years old)
    private Double averageSpeedKmh;     // 65.0

    // ── Comfort Features ──────────────────────────────────────
    private Boolean hasAC = false;
    private Boolean hasSleeper = false;
    private Boolean hasSeater = false;
    private Boolean hasWifi = false;
    private Boolean hasChargingPoint = false;
    private Boolean hasGPS = false;
    private Boolean hasCCTV = false;
    private Boolean hasReadingLight = false;
    private Boolean hasBlanketPillow = false;
    private Boolean hasWaterBottle = false;
    private Boolean hasEmergencySOS = false;
    private Boolean hasLadiesSeat = false;
    private Boolean hasPanicButton = false;
    private Boolean hasLiveTracking = false;
    private Boolean hasCleanWashroom = false;

    // ── Insurance & Safety ────────────────────────────────────
    private String insuranceProvider;   // "New India Assurance"
    private String permitNumber;        // "MH/TC/2023/12345"
    private String lastServiceDate;     // "2026-09-15"
    private Boolean isActive = true;

    public Bus() {}

    public Bus(String busNumber, String operatorName, String busType, Integer totalSeats,
               String amenities, Double rating, Integer reviewsCount) {
        this.busNumber = busNumber;
        this.operatorName = operatorName;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.amenities = amenities;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        // Auto-derive boolean flags from busType
        this.hasAC = busType != null && busType.startsWith("AC");
        this.hasSleeper = busType != null && busType.contains("SLEEPER");
        this.hasSeater = busType != null && busType.contains("SEATER");
        // Auto-derive amenity flags from amenities string
        if (amenities != null) {
            String lower = amenities.toLowerCase();
            this.hasWifi = lower.contains("wifi");
            this.hasChargingPoint = lower.contains("charging");
            this.hasGPS = lower.contains("gps");
            this.hasCCTV = lower.contains("cctv");
            this.hasReadingLight = lower.contains("reading");
            this.hasBlanketPillow = lower.contains("blanket");
            this.hasWaterBottle = lower.contains("water");
            this.hasLiveTracking = lower.contains("tracking");
            this.hasCleanWashroom = lower.contains("washroom");
            this.hasEmergencySOS = lower.contains("sos");
        }
    }

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getCompanyWebsite() { return companyWebsite; }
    public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }

    public String getCompanyPhone() { return companyPhone; }
    public void setCompanyPhone(String companyPhone) { this.companyPhone = companyPhone; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public String getEstablishedYear() { return establishedYear; }
    public void setEstablishedYear(String establishedYear) { this.establishedYear = establishedYear; }

    public String getBusModel() { return busModel; }
    public void setBusModel(String busModel) { this.busModel = busModel; }

    public String getEngineType() { return engineType; }
    public void setEngineType(String engineType) { this.engineType = engineType; }

    public String getBusColor() { return busColor; }
    public void setBusColor(String busColor) { this.busColor = busColor; }

    public Integer getBusAgeYears() { return busAgeYears; }
    public void setBusAgeYears(Integer busAgeYears) { this.busAgeYears = busAgeYears; }

    public Double getAverageSpeedKmh() { return averageSpeedKmh; }
    public void setAverageSpeedKmh(Double averageSpeedKmh) { this.averageSpeedKmh = averageSpeedKmh; }

    public Boolean getHasAC() { return hasAC; }
    public void setHasAC(Boolean hasAC) { this.hasAC = hasAC; }

    public Boolean getHasSleeper() { return hasSleeper; }
    public void setHasSleeper(Boolean hasSleeper) { this.hasSleeper = hasSleeper; }

    public Boolean getHasSeater() { return hasSeater; }
    public void setHasSeater(Boolean hasSeater) { this.hasSeater = hasSeater; }

    public Boolean getHasWifi() { return hasWifi; }
    public void setHasWifi(Boolean hasWifi) { this.hasWifi = hasWifi; }

    public Boolean getHasChargingPoint() { return hasChargingPoint; }
    public void setHasChargingPoint(Boolean hasChargingPoint) { this.hasChargingPoint = hasChargingPoint; }

    public Boolean getHasGPS() { return hasGPS; }
    public void setHasGPS(Boolean hasGPS) { this.hasGPS = hasGPS; }

    public Boolean getHasCCTV() { return hasCCTV; }
    public void setHasCCTV(Boolean hasCCTV) { this.hasCCTV = hasCCTV; }

    public Boolean getHasReadingLight() { return hasReadingLight; }
    public void setHasReadingLight(Boolean hasReadingLight) { this.hasReadingLight = hasReadingLight; }

    public Boolean getHasBlanketPillow() { return hasBlanketPillow; }
    public void setHasBlanketPillow(Boolean hasBlanketPillow) { this.hasBlanketPillow = hasBlanketPillow; }

    public Boolean getHasWaterBottle() { return hasWaterBottle; }
    public void setHasWaterBottle(Boolean hasWaterBottle) { this.hasWaterBottle = hasWaterBottle; }

    public Boolean getHasEmergencySOS() { return hasEmergencySOS; }
    public void setHasEmergencySOS(Boolean hasEmergencySOS) { this.hasEmergencySOS = hasEmergencySOS; }

    public Boolean getHasLadiesSeat() { return hasLadiesSeat; }
    public void setHasLadiesSeat(Boolean hasLadiesSeat) { this.hasLadiesSeat = hasLadiesSeat; }

    public Boolean getHasPanicButton() { return hasPanicButton; }
    public void setHasPanicButton(Boolean hasPanicButton) { this.hasPanicButton = hasPanicButton; }

    public Boolean getHasLiveTracking() { return hasLiveTracking; }
    public void setHasLiveTracking(Boolean hasLiveTracking) { this.hasLiveTracking = hasLiveTracking; }

    public Boolean getHasCleanWashroom() { return hasCleanWashroom; }
    public void setHasCleanWashroom(Boolean hasCleanWashroom) { this.hasCleanWashroom = hasCleanWashroom; }

    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }

    public String getPermitNumber() { return permitNumber; }
    public void setPermitNumber(String permitNumber) { this.permitNumber = permitNumber; }

    public String getLastServiceDate() { return lastServiceDate; }
    public void setLastServiceDate(String lastServiceDate) { this.lastServiceDate = lastServiceDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
