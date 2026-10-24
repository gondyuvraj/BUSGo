# 🚌 BusGo — Premium Online Bus Ticket Booking Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19%20%7C%20Vite-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> **A modern, commercial-grade full-stack travel booking application built as a College Major Project.**
> Designed with deep navy blues, royal blue, amber/orange accents, glassmorphic floating search panels, interactive multi-deck seat selection, server-side concurrency safeguards, and an enterprise administration console.

---

## 🌟 Key Platform Features

### 1. 🎨 Visual Design & Aesthetics
- **Memorable Brand Identity:** Aerodynamic speed-arrow BusGo brand emblem with high-resolution travel imagery.
- **Tailored Color Palette:** Deep Navy (`#0B132B`, `#070B19`), Royal Blue (`#2563EB`, `#1D4ED8`), Clean White/Slate, and Vibrant Amber/Orange accents (`#FF6B35`).
- **Modern Typography:** Styled with *Plus Jakarta Sans* and *Outfit* font hierarchy from Google Fonts.
- **Glassmorphism & Responsive Tokens:** Elevated cards with backdrop blur, smooth micro-interactions, floating action buttons, and responsive grid across mobile, tablet, laptop, and desktop.

### 2. ⚡ Search & Interactive Booking Flow
- **Floating Route Search Panel:** Source & destination cities with interactive swap button, date picker with *"Today"* and *"Tomorrow"* shortcuts, passenger count, and live suggestions.
- **Rich Bus Result Cards:** Real-time operator name (Zingbus, IntrCity, Orange Travels, VRL), coach model, departure/arrival timelines, non-stop indicators, live seat counter with urgency badge, and amenities.
- **Multi-Deck Interactive Seat Map:**
  - Distinct Lower Deck and Upper Deck tabs with driver steering wheel cabin graphic.
  - Interactive states: Available (berth code + price tooltip), Selected (amber highlight), Booked (disabled), Ladies Reserved.
  - Live billing summary with automatic base fare, GST (5%), discount promo code (`BUSGO100` for flat ₹100 off), and net total.
- **Passenger Information Modal:** Name, age, gender per selected seat, contact phone and email for M-Ticket delivery.
- **Demonstration Payment Gateway:** Clearly labelled college demo mode supporting simulated UPI / QR Code with timer, Credit/Debit Cards, and NetBanking with zero real financial risk.
- **Digital Boarding Pass:** Generates printable e-ticket with PNR reference (e.g., `BG-888390`), passenger manifest, QR code verification, and confetti celebration.

### 3. 🛡️ Robust Security & Concurrency Control
- **Double Booking Race Condition Prevention:** The Spring Boot backend actively revalidates seat availability on the MySQL database before committing any reservation transaction.
- **Stateless JWT Authentication:** Secure BCrypt password hashing, role-based authorization (`ROLE_USER` vs `ROLE_ADMIN`).
- **Cancellation & Instant Refund:** Passengers can cancel confirmed bookings directly with an automatic 90% refund computation.

### 4. 📊 Enterprise Admin Dashboard (`/admin`)
- **Key Performance Indicators (KPIs):** Real-time Total Revenue (₹), Total Bookings, Fleet Size, Active Routes, Registered Passengers.
- **Interactive Visual Charts:** 7-Day Revenue Trend bar visualization and Corridor Booking Share breakdown.
- **Fleet Management:** View all buses, delete coaches, add new coaches with automatic seat generation (Lower and Upper decks).
- **Route & Schedule Management:** Add new city corridors, schedule bus departure/arrival timings and fares.
- **User Management:** Master list of all registered accounts with one-click role toggle (`ROLE_USER` ⇄ `ROLE_ADMIN`).

### 5. 🤖 AI Travel Assistant
- Floating conversational bot offering contextual guidance on baggage rules, cancellation policies, sleeper vs. seater cabin advice, and discount vouchers.

---

## 🏗️ System Architecture

```
BUSGo/
├── backend/                       # Java 21 / Spring Boot 3.3.4
│   ├── src/main/java/com/busgo/
│   │   ├── config/                # Security, JWT Token Provider, CORS
│   │   ├── controllers/           # Auth, Bus, Booking, Admin, AI Controllers
│   │   ├── dto/                   # Request & Response DTOs
│   │   ├── models/                # User, Bus, Route, Schedule, Seat, Booking, Payment
│   │   ├── repositories/          # Spring Data JPA Repositories
│   │   ├── services/              # BusService, BookingService, AiAssistantService
│   │   └── util/                  # DataInitializer (Auto-seeds realistic data)
│   ├── src/main/resources/
│   │   ├── application.properties # Master configuration
│   │   ├── application-dev.properties   # H2 in-memory MySQL mode (zero config)
│   │   └── application-mysql.properties # Live MySQL 8.0 connection
│   └── pom.xml
│
├── frontend/                      # React 19 / Vite
│   ├── public/images/             # High-res luxury bus photos & brand badges
│   ├── src/
│   │   ├── components/            # Navbar, Footer, SearchPanel, BusCard, SeatMap, Modals, AI Bot
│   │   ├── context/               # AuthContext, ToastContext
│   │   ├── pages/                 # Home, SearchResults, MyBookings, Profile, Admin, Auth, About, Contact
│   │   ├── services/              # api.js client wrapper
│   │   ├── styles/                # components.css, index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── database/
    ├── busgo_schema.sql           # Pure MySQL 8.0 DDL Schema
    └── busgo_seed_data.sql        # Comprehensive SQL Seed Data for MySQL Workbench
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ or v20+) & **npm**
- **Java Development Kit (JDK 21 or JDK 25)**
- **Apache Maven** (v3.8+)
- *(Optional)* **MySQL 8.0**

---

### Step 1: Start Backend Server

```bash
cd d:/BUSGo/backend

# Run with Maven (Starts on http://localhost:8080)
mvn spring-boot:run
```

> **Note:** The backend is configured in dual-mode. By default, it automatically uses an in-memory MySQL-compatible database seeded with realistic luxury routes (Mumbai, Pune, Bangalore, Hyderabad, Delhi, Jaipur, Goa), verified buses, and test users.
> To connect to your local MySQL server directly, specify `spring.profiles.active=mysql` in `application.properties` or set your `DB_PASSWORD` environment variable.

---

### Step 2: Start Frontend Server

```bash
cd d:/BUSGo/frontend

# Install dependencies (already installed)
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials for Evaluation & Viva

The application includes one-click quick-fill buttons on the Sign In page for immediate testing:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Passenger** | `user@busgo.com` | `user123` | Search, Live Seat Selection, Booking, M-Ticket, Cancellations |
| **Administrator** | `admin@busgo.com` | `admin123` | Full Access: Admin Console, Revenue KPIs, Fleet & Route Management |

---

## 📊 Database Schema Summary (MySQL 8.0)

| Table | Primary Key | Description |
| :--- | :--- | :--- |
| `users` | `id` | Passenger and Administrator accounts with encrypted passwords |
| `buses` | `id` | Fleet vehicles with operator name, model, capacity, and amenities |
| `routes` | `id` | Intercity pairs with distance and estimated travel durations |
| `schedules`| `id` | Timetables linking Buses to Routes with departure/arrival and fares |
| `seats` | `id` | Individual lower/upper deck berths with window & price multipliers |
| `bookings` | `id` | Confirmed reservations with unique PNR reference, status, and seats |
| `payments` | `id` | Transaction records linked to bookings with payment methods |

---

## 🎓 Viva Questions & Key Architectural Answers

1. **How does BusGo prevent double booking of the same seat?**
   > *Answer:* Before saving any booking in `BookingService.java`, a transactional query searches all existing bookings for that exact schedule ID and journey date having status `CONFIRMED`. If any requested seat is found in the booked set, the request is immediately rejected with a 400 Bad Request error.
2. **How is security handled across endpoints?**
   > *Answer:* We use stateless Spring Security with JWT tokens. The client sends a `Bearer <token>` header on authenticated requests. Role-based method security (`@PreAuthorize("hasRole('ADMIN')")`) protects all administrative CRUD operations.
3. **Can the platform run with or without an active MySQL service?**
   > *Answer:* Yes! We configured a dual profile system. It can connect directly to MySQL on port 3306 using `schema.sql` and `busgo_seed_data.sql`, and also provides a zero-setup H2 MySQL mode so examiners can run the full project immediately on any computer.
