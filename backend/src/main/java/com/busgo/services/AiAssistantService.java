package com.busgo.services;

import org.springframework.stereotype.Service;
import java.util.Locale;

@Service
public class AiAssistantService {

    public String generateTravelAnswer(String query) {
        if (query == null || query.isBlank()) {
            return "👋 Namaste! I'm BusGo AI — your personal travel assistant.\n\nI can help you with:\n• 🎟️ Booking & cancellations\n• 🗺️ Route recommendations\n• 💰 Discount promo codes\n• 🧳 Luggage & boarding info\n• 🛏️ Seat type advice\n\nWhat would you like to know?";
        }

        String lower = query.toLowerCase(Locale.ROOT);

        // ── Greetings ──────────────────────────────────────────
        if (lower.matches(".*\\b(hi|hello|hey|namaste|hii|helo|good morning|good evening|good afternoon)\\b.*")) {
            return "👋 Hello! Welcome to BusGo AI Assistant!\n\nI'm here to make your journey planning effortless. Ask me anything about:\n\n🎫 Bookings & tickets\n💸 Cancellations & refunds\n🛣️ Routes & schedules\n🎁 Promo codes & offers\n🧳 Luggage allowance\n🛏️ Seat recommendations\n\nHow can I assist you today?";
        }

        // ── Promo / Discounts ──────────────────────────────────
        if (lower.contains("coupon") || lower.contains("discount") || lower.contains("offer")
                || lower.contains("promo") || lower.contains("code") || lower.contains("deal")) {
            return "🎉 Great news! Here are BusGo's live promo codes:\n\n" +
                   "• **BUSGO100** → Flat ₹100 off on any booking (min ₹500)\n" +
                   "• **WEEKEND20** → 20% off on Fri–Sun night buses\n" +
                   "• **SLEEPER15** → 15% off on all AC Sleeper coaches\n" +
                   "• **NEWUSER50** → ₹50 wallet credit for first-time users\n\n" +
                   "💡 Tip: Combine BUSGO100 with a weekend booking for maximum savings! Enter the code at checkout before payment.";
        }

        // ── Cancellation / Refund ──────────────────────────────
        if (lower.contains("cancel") || lower.contains("refund") || lower.contains("money back")) {
            return "📋 BusGo Cancellation & Refund Policy:\n\n" +
                   "⏰ **More than 12 hours** before departure → 90% refund\n" +
                   "⏰ **6 to 12 hours** before departure → 50% refund\n" +
                   "⏰ **Less than 6 hours** → No refund\n\n" +
                   "💳 Refunds are processed to your original payment method within **2–4 business hours**.\n\n" +
                   "🚨 **BusGo Guarantee:** If the bus is delayed more than 60 minutes without prior notice, you get a **100% full refund** automatically.\n\n" +
                   "To cancel: Go to My Bookings → Find your ticket → Click 'Cancel Ticket'";
        }

        // ── Luggage / Baggage ──────────────────────────────────
        if (lower.contains("luggage") || lower.contains("baggage") || lower.contains("bag")
                || lower.contains("weight") || lower.contains("carry")) {
            return "🧳 BusGo Luggage Policy:\n\n" +
                   "✅ **Cabin bag:** 1 small bag (up to 7 kg) — inside the coach\n" +
                   "✅ **Check-in:** 2 large bags (up to 20 kg total) — in lower chassis hold\n" +
                   "❌ **Not allowed:** Inflammable items, liquids > 1L, oversized furniture\n\n" +
                   "💡 For fragile or extra items, please inform the operator at least 2 hours before departure via the helpline: **1800-BUS-GO-24**";
        }

        // ── Seat Types ─────────────────────────────────────────
        if (lower.contains("sleeper") || lower.contains("seater") || lower.contains("seat")
                || lower.contains("deck") || lower.contains("berth") || lower.contains("upper") || lower.contains("lower")) {
            return "🛏️ BusGo Seat Guide:\n\n" +
                   "**AC Sleeper (Best for overnight):**\n" +
                   "• Lower deck → Smoothest ride, easiest access\n" +
                   "• Upper deck → More privacy, slightly firmer\n" +
                   "• Window berths → Best views (₹30–50 extra)\n\n" +
                   "**AC Seater (Best for daytime):**\n" +
                   "• Ergonomic recliner chairs\n" +
                   "• Panoramic windows\n" +
                   "• Ideal for 4–6 hour trips\n\n" +
                   "💡 **My Recommendation:**\n" +
                   "• Journey > 6 hours at night → AC Sleeper Lower Deck\n" +
                   "• Journey < 5 hours daytime → AC Seater Window\n" +
                   "• Solo female traveler → Use designated 🔴 Ladies seats";
        }

        // ── Boarding / Ticket ──────────────────────────────────
        if (lower.contains("board") || lower.contains("ticket") || lower.contains("m-ticket")
                || lower.contains("print") || lower.contains("pnr") || lower.contains("id")) {
            return "📱 Boarding Instructions:\n\n" +
                   "✅ **No paper print needed** — Show digital M-Ticket on your phone\n" +
                   "✅ Carry any valid Govt photo ID:\n" +
                   "   • Aadhaar Card\n" +
                   "   • Passport\n" +
                   "   • Driving Licence\n" +
                   "   • Voter ID\n\n" +
                   "📍 **Arrive 15 minutes early** at the boarding point\n" +
                   "🔍 Show PNR reference (e.g. BG-712849) to the conductor\n\n" +
                   "💡 Download your ticket from **My Bookings** → **View Boarding Pass**";
        }

        // ── Routes ─────────────────────────────────────────────
        if (lower.contains("mumbai") && lower.contains("pune")) {
            return "🛣️ Mumbai → Pune Express:\n\n" +
                   "⏱️ Duration: 3h 30m\n📏 Distance: 150 km\n💰 Fares from ₹499\n\n" +
                   "🚌 Top Operators:\n" +
                   "• Zingbus Electric Multi-Axle (★ 4.9)\n" +
                   "• IntrCity SmartBus Premium (★ 4.8)\n\n" +
                   "⏰ Best departures: 06:30 AM, 02:00 PM, 10:30 PM\n" +
                   "📍 Boarding: Borivali West / Dadar TT Circle\n" +
                   "📍 Dropping: Swargate / Hinjawadi\n\n" +
                   "🎁 Use code **BUSGO100** for ₹100 off!";
        }

        if ((lower.contains("bangalore") || lower.contains("bengaluru")) && lower.contains("hyderabad")) {
            return "🛣️ Bangalore → Hyderabad Express:\n\n" +
                   "⏱️ Duration: 8h 45m\n📏 Distance: 570 km\n💰 Fares from ₹899\n\n" +
                   "🚌 Best Bus: IntrCity SmartBus Premium Lounge (★ 4.8)\n\n" +
                   "⏰ Best departure: 09:30 PM (overnight — arrive fresh at 6 AM)\n" +
                   "📍 Boarding: Majestic Bus Stand / Hebbal\n" +
                   "📍 Dropping: Ameerpet / Gachibowli ORR\n\n" +
                   "💡 Book AC Sleeper for overnight comfort!";
        }

        if (lower.contains("mumbai") && (lower.contains("goa") || lower.contains("panaji"))) {
            return "🏖️ Mumbai → Goa Beach Express:\n\n" +
                   "⏱️ Duration: 11h 00m\n📏 Distance: 590 km\n💰 Fares from ₹999\n\n" +
                   "🚌 Top Pick: VRL Travels Super Luxury Sleeper (★ 4.9)\n\n" +
                   "⏰ Best departure: 08:00 PM (arrive 7 AM Panaji)\n" +
                   "📍 Boarding: Borivali / Sion / Panvel\n" +
                   "📍 Dropping: Panjim KTC / Mapusa\n\n" +
                   "🎁 Use code **WEEKEND20** on Fri–Sun for 20% off!";
        }

        if (lower.contains("delhi") && lower.contains("jaipur")) {
            return "🏰 Delhi → Jaipur Royal Route:\n\n" +
                   "⏱️ Duration: 5h 15m\n📏 Distance: 280 km\n💰 Fares from ₹599\n\n" +
                   "🚌 Top Pick: SRS Travels Club Class (★ 4.6)\n\n" +
                   "⏰ Best departure: 06:00 AM (arrive 11:15 AM)\n" +
                   "📍 Boarding: Kashmere Gate ISBT / Dhaula Kuan\n" +
                   "📍 Dropping: Sindhi Camp / 200 Ft Bypass\n\n" +
                   "💡 Book 2–3 days in advance for best fares!";
        }

        // ── Generic city query ─────────────────────────────────
        if (lower.contains("route") || lower.contains("bus from") || lower.contains("bus to")
                || lower.contains("travel") || lower.contains("journey") || lower.contains("trip")) {
            return "🗺️ BusGo operates luxury express coaches on these popular corridors:\n\n" +
                   "• Mumbai ↔ Pune (from ₹499 · 3h 30m)\n" +
                   "• Bangalore ↔ Hyderabad (from ₹899 · 8h 45m)\n" +
                   "• Delhi ↔ Jaipur (from ₹599 · 5h 15m)\n" +
                   "• Mumbai ↔ Goa (from ₹999 · 11h 00m)\n" +
                   "• Bangalore ↔ Chennai (from ₹649 · 6h 15m)\n\n" +
                   "🔍 Use the Search Buses page to find all available buses for your specific route and date!";
        }

        // ── Safety ─────────────────────────────────────────────
        if (lower.contains("safe") || lower.contains("safety") || lower.contains("cctv")
                || lower.contains("gps") || lower.contains("track") || lower.contains("emergency")) {
            return "🛡️ BusGo Safety Standards:\n\n" +
                   "✅ Every bus has **live GPS tracking** shared with family\n" +
                   "✅ **CCTV cameras** inside all premium coaches\n" +
                   "✅ **Panic / SOS button** available on luxury buses\n" +
                   "✅ Drivers undergo **background verification**\n" +
                   "✅ Emergency helpline: **1800-BUS-GO-24** (24/7)\n" +
                   "✅ All buses are **insurance covered**\n" +
                   "✅ Ladies-only seats with **female staff** on overnight routes\n\n" +
                   "BusGo is rated India's #1 safest intercity bus platform 🏆";
        }

        // ── Payment ────────────────────────────────────────────
        if (lower.contains("pay") || lower.contains("payment") || lower.contains("upi")
                || lower.contains("card") || lower.contains("netbanking") || lower.contains("wallet")) {
            return "💳 BusGo Payment Options:\n\n" +
                   "✅ **UPI** — Google Pay, PhonePe, Paytm, BHIM\n" +
                   "✅ **Debit/Credit Cards** — Visa, Mastercard, RuPay\n" +
                   "✅ **Net Banking** — All major Indian banks\n" +
                   "✅ **Digital Wallets** — Paytm, Mobikwik\n\n" +
                   "🔒 **Security:**\n" +
                   "• 256-bit SSL encryption\n" +
                   "• PCI-DSS compliant gateway\n" +
                   "• We never store card details\n\n" +
                   "⚡ Confirmation in under 30 seconds after payment!";
        }

        // ── Amenities ──────────────────────────────────────────
        if (lower.contains("wifi") || lower.contains("amenities") || lower.contains("charging")
                || lower.contains("blanket") || lower.contains("water") || lower.contains("toilet") || lower.contains("washroom")) {
            return "✨ BusGo Luxury Amenities:\n\n" +
                   "🛋️ **Comfort:**\n" +
                   "• Fully flat sleeper berths\n" +
                   "• 100% sanitized blankets & pillows\n" +
                   "• Adjustable reading lights\n\n" +
                   "📡 **Technology:**\n" +
                   "• High-speed cabin WiFi\n" +
                   "• USB-C & USB-A charging at every berth\n" +
                   "• Live GPS tracking app link\n\n" +
                   "🧴 **Refreshments:**\n" +
                   "• Complimentary mineral water bottle\n" +
                   "• Mid-route meal stop (long routes)\n\n" +
                   "🚻 **Facilities:**\n" +
                   "• Clean washroom on select coaches\n" +
                   "• Hygiene kit on overnight buses";
        }

        // ── Booking process ────────────────────────────────────
        if (lower.contains("how to book") || lower.contains("booking process") || lower.contains("steps")
                || lower.contains("how do i book") || lower.contains("how can i book")) {
            return "📖 How to Book on BusGo — 4 Easy Steps:\n\n" +
                   "1️⃣ **Search** — Enter your From/To city and journey date\n\n" +
                   "2️⃣ **Compare** — Browse buses, filter by type, time, price\n\n" +
                   "3️⃣ **Select Seat** — Pick your exact berth from the live seat map\n\n" +
                   "4️⃣ **Pay & Get Ticket** — Pay via UPI/card, get instant M-Ticket\n\n" +
                   "⏱️ Entire process takes under **2 minutes!**\n\n" +
                   "💡 Pro tip: Use the **'Book Now'** button on popular routes from the Home page for even faster booking!";
        }

        // ── Support / Help ─────────────────────────────────────
        if (lower.contains("help") || lower.contains("support") || lower.contains("contact")
                || lower.contains("problem") || lower.contains("issue") || lower.contains("complaint")) {
            return "🆘 BusGo Support Channels:\n\n" +
                   "📞 **Toll-Free:** 1800-BUS-GO-24 (24/7)\n" +
                   "📧 **Email:** support@busgo.travel\n" +
                   "💬 **Live Chat:** Available on Contact Us page\n\n" +
                   "⚡ **Average response time:** Under 2 hours\n" +
                   "⭐ **Support rating:** 4.9/5\n\n" +
                   "Common issues I can help with right now:\n" +
                   "• 'My refund is pending'\n" +
                   "• 'Bus is late'\n" +
                   "• 'Seat not confirmed'\n" +
                   "Just type your issue below!";
        }

        // ── Thank you ──────────────────────────────────────────
        if (lower.contains("thank") || lower.contains("thanks") || lower.contains("thx") || lower.contains("ty")) {
            return "😊 You're welcome! Have a wonderful journey with BusGo!\n\n" +
                   "🌟 Remember:\n" +
                   "• Board 15 mins early\n" +
                   "• Keep your M-Ticket ready\n" +
                   "• Use code **BUSGO100** for ₹100 off\n\n" +
                   "Safe travels! 🚌💨";
        }

        // ── Fallback ───────────────────────────────────────────
        return "🤔 I didn't quite catch that, but here's what I can help you with:\n\n" +
               "🎫 **Bookings** — 'How do I book a ticket?'\n" +
               "💸 **Refunds** — 'What is the cancellation policy?'\n" +
               "🗺️ **Routes** — 'Mumbai to Goa bus timings'\n" +
               "🎁 **Offers** — 'Any discount codes available?'\n" +
               "🧳 **Luggage** — 'How much luggage can I carry?'\n" +
               "🛏️ **Seats** — 'Sleeper vs seater recommendation'\n" +
               "💳 **Payment** — 'What payment methods are accepted?'\n\n" +
               "Try asking one of the above, or type your question differently!";
    }
}
