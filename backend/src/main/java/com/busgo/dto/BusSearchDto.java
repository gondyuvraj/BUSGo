package com.busgo.dto;

public class BusSearchDto {

    public static class BusSearchResultDto {
        private Long scheduleId;
        private Long busId;
        private String busNumber;
        private String operatorName;
        private String busType;
        private Double rating;
        private Integer reviewsCount;
        private String amenities;
        private String sourceCity;
        private String destinationCity;
        private String departureTime;
        private String arrivalTime;
        private Double durationHours;
        private Double fare;
        private String boardingPoint;
        private String droppingPoint;
        private Integer totalSeats;
        private Integer availableSeats;
        private String busModel;
        private String engineType;

        public BusSearchResultDto() {}

        public Long getScheduleId() { return scheduleId; }
        public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }

        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }

        public String getBusNumber() { return busNumber; }
        public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

        public String getOperatorName() { return operatorName; }
        public void setOperatorName(String operatorName) { this.operatorName = operatorName; }

        public String getBusType() { return busType; }
        public void setBusType(String busType) { this.busType = busType; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public Integer getReviewsCount() { return reviewsCount; }
        public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

        public String getAmenities() { return amenities; }
        public void setAmenities(String amenities) { this.amenities = amenities; }

        public String getSourceCity() { return sourceCity; }
        public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }

        public String getDestinationCity() { return destinationCity; }
        public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }

        public String getDepartureTime() { return departureTime; }
        public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

        public String getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

        public Double getDurationHours() { return durationHours; }
        public void setDurationHours(Double durationHours) { this.durationHours = durationHours; }

        public Double getFare() { return fare; }
        public void setFare(Double fare) { this.fare = fare; }

        public String getBoardingPoint() { return boardingPoint; }
        public void setBoardingPoint(String boardingPoint) { this.boardingPoint = boardingPoint; }

        public String getDroppingPoint() { return droppingPoint; }
        public void setDroppingPoint(String droppingPoint) { this.droppingPoint = droppingPoint; }

        public Integer getTotalSeats() { return totalSeats; }
        public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

        public Integer getAvailableSeats() { return availableSeats; }
        public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }

        public String getBusModel() { return busModel; }
        public void setBusModel(String busModel) { this.busModel = busModel; }

        public String getEngineType() { return engineType; }
        public void setEngineType(String engineType) { this.engineType = engineType; }
    }

    public static class SeatStatusDto {
        private String seatNumber;
        private String deck;
        private String seatType;
        private Boolean isWindow;
        private Double price;
        private Boolean isBooked;
        private Boolean isLadies;

        public SeatStatusDto() {}

        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

        public String getDeck() { return deck; }
        public void setDeck(String deck) { this.deck = deck; }

        public String getSeatType() { return seatType; }
        public void setSeatType(String seatType) { this.seatType = seatType; }

        public Boolean getIsWindow() { return isWindow; }
        public void setIsWindow(Boolean window) { isWindow = window; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public Boolean getIsBooked() { return isBooked; }
        public void setIsBooked(Boolean booked) { isBooked = booked; }

        public Boolean getIsLadies() { return isLadies; }
        public void setIsLadies(Boolean ladies) { isLadies = ladies; }
    }

    public static class PopularRouteDto {
        private String sourceCity;
        private String destinationCity;
        private Double startingPrice;
        private Integer dailyBuses;
        private String duration;
        private String imageUrl;

        public PopularRouteDto(String sourceCity, String destinationCity, Double startingPrice, Integer dailyBuses, String duration, String imageUrl) {
            this.sourceCity = sourceCity;
            this.destinationCity = destinationCity;
            this.startingPrice = startingPrice;
            this.dailyBuses = dailyBuses;
            this.duration = duration;
            this.imageUrl = imageUrl;
        }

        public String getSourceCity() { return sourceCity; }
        public String getDestinationCity() { return destinationCity; }
        public Double getStartingPrice() { return startingPrice; }
        public Integer getDailyBuses() { return dailyBuses; }
        public String getDuration() { return duration; }
        public String getImageUrl() { return imageUrl; }
    }
}
