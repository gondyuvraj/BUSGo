package com.busgo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(nullable = false)
    private String seatNumber; // "L1", "L2", "U1", "U2"

    @Column(nullable = false)
    private String deck; // "LOWER", "UPPER"

    @Column(nullable = false)
    private String seatType; // "SLEEPER", "SEATER"

    private Boolean isWindow = false;

    private Double priceMultiplier = 1.0;

    public Seat() {}

    public Seat(Bus bus, String seatNumber, String deck, String seatType, Boolean isWindow, Double priceMultiplier) {
        this.bus = bus;
        this.seatNumber = seatNumber;
        this.deck = deck;
        this.seatType = seatType;
        this.isWindow = isWindow;
        this.priceMultiplier = priceMultiplier;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getDeck() { return deck; }
    public void setDeck(String deck) { this.deck = deck; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public Boolean getIsWindow() { return isWindow; }
    public void setIsWindow(Boolean window) { isWindow = window; }

    public Double getPriceMultiplier() { return priceMultiplier; }
    public void setPriceMultiplier(Double priceMultiplier) { this.priceMultiplier = priceMultiplier; }
}
