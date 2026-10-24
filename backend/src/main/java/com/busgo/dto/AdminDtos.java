package com.busgo.dto;

import java.util.List;
import java.util.Map;

public class AdminDtos {

    public static class AdminStatsDto {
        private Long totalBookings;
        private Double totalRevenue;
        private Long totalUsers;
        private Long totalBuses;
        private Long totalRoutes;
        private List<Map<String, Object>> revenueTrend;
        private List<Map<String, Object>> routePopularity;

        public AdminStatsDto() {}

        public Long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

        public Double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

        public Long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

        public Long getTotalBuses() { return totalBuses; }
        public void setTotalBuses(Long totalBuses) { this.totalBuses = totalBuses; }

        public Long getTotalRoutes() { return totalRoutes; }
        public void setTotalRoutes(Long totalRoutes) { this.totalRoutes = totalRoutes; }

        public List<Map<String, Object>> getRevenueTrend() { return revenueTrend; }
        public void setRevenueTrend(List<Map<String, Object>> revenueTrend) { this.revenueTrend = revenueTrend; }

        public List<Map<String, Object>> getRoutePopularity() { return routePopularity; }
        public void setRoutePopularity(List<Map<String, Object>> routePopularity) { this.routePopularity = routePopularity; }
    }

    public static class AddBusRequest {
        // Core
        private String busNumber;
        private String operatorName;
        private String busType;
        private Integer totalSeats;
        private String amenities;
        private Double rating = 4.5;
        private Integer reviewsCount = 0;

        // Brand & Company
        private String brandName;
        private String companyWebsite;
        private String companyPhone;
        private String companyEmail;
        private String establishedYear;

        // Bus Specs
        private String busModel;
        private String engineType;
        private String busColor;
        private Integer busAgeYears;
        private Double averageSpeedKmh;

        // Comfort Features
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

        // Safety
        private String insuranceProvider;
        private String permitNumber;
        private String lastServiceDate;

        public AddBusRequest() {}

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
    }

    public static class AddRouteRequest {
        private String sourceCity;
        private String destinationCity;
        private Integer distanceKm;
        private Double estimatedDurationHours;

        public AddRouteRequest() {}
        public String getSourceCity() { return sourceCity; }
        public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }
        public String getDestinationCity() { return destinationCity; }
        public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }
        public Integer getDistanceKm() { return distanceKm; }
        public void setDistanceKm(Integer distanceKm) { this.distanceKm = distanceKm; }
        public Double getEstimatedDurationHours() { return estimatedDurationHours; }
        public void setEstimatedDurationHours(Double estimatedDurationHours) { this.estimatedDurationHours = estimatedDurationHours; }
    }

    public static class AddScheduleRequest {
        private Long busId;
        private Long routeId;
        private String departureTime;
        private String arrivalTime;
        private Double fare;
        private String boardingPoint;
        private String droppingPoint;

        public AddScheduleRequest() {}
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        public Long getRouteId() { return routeId; }
        public void setRouteId(Long routeId) { this.routeId = routeId; }
        public String getDepartureTime() { return departureTime; }
        public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
        public String getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
        public Double getFare() { return fare; }
        public void setFare(Double fare) { this.fare = fare; }
        public String getBoardingPoint() { return boardingPoint; }
        public void setBoardingPoint(String boardingPoint) { this.boardingPoint = boardingPoint; }
        public String getDroppingPoint() { return droppingPoint; }
        public void setDroppingPoint(String droppingPoint) { this.droppingPoint = droppingPoint; }
    }
}
