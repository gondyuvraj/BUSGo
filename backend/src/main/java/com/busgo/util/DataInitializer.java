package com.busgo.util;

import com.busgo.models.*;
import com.busgo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println("🌱 Initializing BusGo seed data with realistic routes, luxury buses, and admin accounts...");

        // 1. Create Default Users
        User admin = new User("BusGo Operations Lead", "admin@busgo.com",
                passwordEncoder.encode("admin123"), "+91 98765 43210", "ROLE_ADMIN");
        userRepository.save(admin);

        User testUser = new User("Yuvraj Sharma", "user@busgo.com",
                passwordEncoder.encode("user123"), "+91 98190 12345", "ROLE_USER");
        userRepository.save(testUser);

        // 2. Create Routes
        Route r1 = routeRepository.save(new Route("Mumbai", "Pune", 150, 3.5));
        Route r2 = routeRepository.save(new Route("Pune", "Mumbai", 150, 3.5));
        Route r3 = routeRepository.save(new Route("Bangalore", "Hyderabad", 570, 8.5));
        Route r4 = routeRepository.save(new Route("Delhi", "Jaipur", 280, 5.0));
        Route r5 = routeRepository.save(new Route("Mumbai", "Goa", 590, 11.0));
        Route r6 = routeRepository.save(new Route("Bangalore", "Chennai", 350, 6.0));
        routeRepository.save(new Route("Hyderabad", "Bangalore", 570, 8.5));

        // 3. Create Buses
        Bus b1 = busRepository.save(new Bus("MH-01-BG-1001", "Zingbus Electric Multi-Axle", "AC_SLEEPER", 30,
                "WiFi,Charging Point,Water Bottle,Blanket,Live Tracking,Reading Light", 4.9, 320));

        Bus b2 = busRepository.save(new Bus("MH-12-BG-2002", "IntrCity SmartBus Premium Lounge", "AC_SLEEPER", 30,
                "AC,Pillows,Clean Washroom,Charging Point,GPS,CCTV", 4.8, 215));

        Bus b3 = busRepository.save(new Bus("KA-05-BG-3003", "Orange Travels Volvo 9600", "AC_SLEEPER", 30,
                "WiFi,AC,Water Bottle,Emergency SOS,Personal Screen", 4.7, 180));

        Bus b4 = busRepository.save(new Bus("DL-01-BG-4004", "SRS Travels Club Class", "AC_SEATER", 36,
                "AC,Ergonomic Recliner,Snacks,USB Port,M-Ticket", 4.6, 95));

        Bus b5 = busRepository.save(new Bus("GA-03-BG-5005", "VRL Travels Super Luxury Sleeper", "AC_SLEEPER", 30,
                "AC,WiFi,Blanket,Mineral Water,GPS Tracking", 4.9, 440));

        // 4. Create Seats for each bus
        List<Bus> allBuses = List.of(b1, b2, b3, b4, b5);
        for (Bus bus : allBuses) {
            int countPerDeck = bus.getTotalSeats() / 2;
            for (int i = 1; i <= countPerDeck; i++) {
                boolean isWindow = (i % 3 != 2);
                seatRepository.save(new Seat(bus, "L" + i, "LOWER", "SLEEPER", isWindow, isWindow ? 1.05 : 1.0));
                seatRepository.save(new Seat(bus, "U" + i, "UPPER", "SLEEPER", isWindow, isWindow ? 1.0 : 0.95));
            }
        }

        // 5. Create Schedules
        Schedule s1 = scheduleRepository.save(new Schedule(b1, r1, "06:30 AM", "10:00 AM", 499.0,
                "Borivali West / Dadar TT Circle", "Swargate / Hinjawadi Bridge"));

        scheduleRepository.save(new Schedule(b2, r1, "02:00 PM", "05:30 PM", 549.0,
                "Bandra Kurla Complex / Vashi Plaza", "Wakad Flyover / Pune Station"));

        scheduleRepository.save(new Schedule(b3, r1, "10:30 PM", "02:00 AM", 699.0,
                "Andheri East / Chembur Maitri Park", "Shivajinagar / Swargate Bus Stand"));

        scheduleRepository.save(new Schedule(b1, r2, "07:00 AM", "10:30 AM", 499.0,
                "Pune Station / Wakad", "Dadar TT / Borivali"));

        scheduleRepository.save(new Schedule(b2, r3, "09:30 PM", "06:00 AM", 999.0,
                "Majestic Bus Stand / Hebbal", "Ameerpet / Gachibowli ORR"));

        scheduleRepository.save(new Schedule(b4, r4, "06:00 AM", "11:15 AM", 599.0,
                "Kashmere Gate ISBT / Dhaula Kuan", "Sindhi Camp / 200 Ft Bypass"));

        Schedule s7 = scheduleRepository.save(new Schedule(b5, r5, "08:00 PM", "07:00 AM", 1299.0,
                "Borivali / Sion / Panvel", "Panjim KTC Bus Stand / Mapusa"));

        scheduleRepository.save(new Schedule(b3, r6, "11:00 PM", "05:00 AM", 699.0,
                "Electronic City / Silk Board", "Koyambedu CMBT / Guindy"));

        // 6. Create Initial Seed Bookings for visual dashboard richness
        Booking book1 = new Booking("BG-712849", testUser, s1, LocalDate.now().plusDays(1),
                "L3, L4", "[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"L3\"},{\"name\":\"Rahul Deshmukh\",\"age\":23,\"gender\":\"MALE\",\"seatNumber\":\"L4\"}]",
                1047.9, "COMPLETED", "CONFIRMED");
        book1 = bookingRepository.save(book1);
        paymentRepository.save(new Payment(book1, "TXN-849102", "UPI", 1047.9, "SUCCESS"));

        Booking book2 = new Booking("BG-583920", testUser, s7, LocalDate.now().minusDays(3),
                "U1", "[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"U1\"}]",
                1299.0, "COMPLETED", "CONFIRMED");
        book2.setBookingTime(LocalDateTime.now().minusDays(4));
        book2 = bookingRepository.save(book2);
        paymentRepository.save(new Payment(book2, "TXN-391829", "CARD", 1299.0, "SUCCESS"));

        System.out.println("✅ BusGo seed data initialized successfully! Ready for live testing.");
    }
}
