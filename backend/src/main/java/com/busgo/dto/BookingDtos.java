package com.busgo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public class BookingDtos {

    public enum CancellationReason {
        CHANGE_OF_PLANS,
        DATE_OR_TIME_CHANGED,
        BOOKED_BY_MISTAKE,
        FOUND_ALTERNATIVE_TRANSPORT,
        TRAVEL_PURPOSE_CHANGED,
        BUS_OR_OPERATOR_CONCERN,
        OTHER
    }

    public static class CancelBookingRequest {
        @NotNull
        private CancellationReason reason;

        @Size(max = 500)
        private String details;

        public CancelBookingRequest() {}
        public CancellationReason getReason() { return reason; }
        public void setReason(CancellationReason reason) { this.reason = reason; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
    }

    public static class PassengerDto {
        private String name;
        private Integer age;
        private String gender; // "MALE", "FEMALE", "OTHER"
        private String seatNumber;

        public PassengerDto() {}
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    }

    public static class CreateBookingRequest {
        private Long scheduleId;
        private LocalDate journeyDate;
        private List<String> seatNumbers;
        private List<PassengerDto> passengers;
        private String contactPhone;
        private String contactEmail;
        private String paymentMethod; // "UPI", "CARD", "NETBANKING"
        private Double totalAmount;

        public CreateBookingRequest() {}
        public Long getScheduleId() { return scheduleId; }
        public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
        public LocalDate getJourneyDate() { return journeyDate; }
        public void setJourneyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; }
        public List<String> getSeatNumbers() { return seatNumbers; }
        public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
        public List<PassengerDto> getPassengers() { return passengers; }
        public void setPassengers(List<PassengerDto> passengers) { this.passengers = passengers; }
        public String getContactPhone() { return contactPhone; }
        public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
        public String getContactEmail() { return contactEmail; }
        public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public Double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    }

    public static class BookingResponseDto {
        private Long id;
        private String bookingReference;
        private String operatorName;
        private String busType;
        private String sourceCity;
        private String destinationCity;
        private String departureTime;
        private String arrivalTime;
        private LocalDate journeyDate;
        private String seatNumbers;
        private String passengerDetails;
        private Double totalAmount;
        private String paymentStatus;
        private String bookingStatus;
        private String transactionId;
        private String boardingPoint;
        private String droppingPoint;
        private String cancellationReason;
        private String cancellationReasonDetails;
        private Double refundAmount = 0.0;

        public BookingResponseDto() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getBookingReference() { return bookingReference; }
        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
        public String getOperatorName() { return operatorName; }
        public void setOperatorName(String operatorName) { this.operatorName = operatorName; }
        public String getBusType() { return busType; }
        public void setBusType(String busType) { this.busType = busType; }
        public String getSourceCity() { return sourceCity; }
        public void setSourceCity(String sourceCity) { this.sourceCity = sourceCity; }
        public String getDestinationCity() { return destinationCity; }
        public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }
        public String getDepartureTime() { return departureTime; }
        public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
        public String getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
        public LocalDate getJourneyDate() { return journeyDate; }
        public void setJourneyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; }
        public String getSeatNumbers() { return seatNumbers; }
        public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }
        public String getPassengerDetails() { return passengerDetails; }
        public void setPassengerDetails(String passengerDetails) { this.passengerDetails = passengerDetails; }
        public Double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
        public String getBookingStatus() { return bookingStatus; }
        public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        public String getBoardingPoint() { return boardingPoint; }
        public void setBoardingPoint(String boardingPoint) { this.boardingPoint = boardingPoint; }
        public String getDroppingPoint() { return droppingPoint; }
        public void setDroppingPoint(String droppingPoint) { this.droppingPoint = droppingPoint; }
        public String getCancellationReason() { return cancellationReason; }
        public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
        public String getCancellationReasonDetails() { return cancellationReasonDetails; }
        public void setCancellationReasonDetails(String cancellationReasonDetails) { this.cancellationReasonDetails = cancellationReasonDetails; }
        public Double getRefundAmount() { return refundAmount; }
        public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }
    }
}
