import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchPanel from '../components/SearchPanel';
import { api } from '../services/api';
import { Star, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [popularRoutes, setPopularRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getPopularRoutes()
      .then((data) => setPopularRoutes(data || []))
      .catch(() => {});
  }, []);

  return (
    <div style={{ flex: 1 }}>
      {/* 1. Hero Section */}
      <section className="hero-wrapper">
        <div className="container hero-content">
          <div className="hero-pill">
            <Sparkles size={14} color="#FF6B35" />
            <span>India's Most Trusted Luxury Express Bus Network</span>
          </div>

          <h1 className="hero-title">
            Your Journey, <span className="gradient-text-orange">Your Way.</span>
          </h1>

          <p className="hero-subtitle">
            Experience first-class intercity sleeper coaches with guaranteed berths, panoramic private windows, high-speed WiFi, and 24/7 live GPS road tracking.
          </p>
        </div>
      </section>

      {/* 2. Floating Search Panel */}
      <SearchPanel />

      {/* 3. Popular Bus Routes Section */}
      <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Express Corridors
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                Popular Bus Routes
              </h2>
            </div>
            <Link to="/search" style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All 50+ Routes</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {popularRoutes.map((route, idx) => (
              <div
                key={idx}
                className="feature-card"
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
                onClick={() => navigate(`/search?from=${route.sourceCity}&to=${route.destinationCity}`)}
              >
                {/* Route Image Banner */}
                <div style={{
                  height: '140px',
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%), url(${route.imageUrl || '/images/hero-bus.jpg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: 800 }}>
                    <span>{route.sourceCity}</span>
                    <span style={{ color: '#FF6B35' }}>→</span>
                    <span>{route.destinationCity}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                    {route.dailyBuses} daily express coaches • {route.duration}
                  </span>
                </div>

                {/* Route Card Footer */}
                <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Fares Starting From</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>₹{route.startingPrice}</span>
                  </div>
                  <span className="btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                    Book Now
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury Fleet Showcase */}
      <section style={{ padding: '5.5rem 0', background: '#0B132B', color: '#fff', overflow: 'hidden' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}>
            <div>
              <div className="badge badge-sleeper" style={{ background: 'rgba(37,99,235,0.2)', color: '#93C5FD', marginBottom: '1rem' }}>
                Next-Gen Travel Experience
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: '1.2', marginBottom: '1.25rem' }}>
                Designed for Restful Sleep & First-Class Comfort
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: '1.65', marginBottom: '2rem' }}>
                Step inside BusGo luxury Volvo 9600 and Electric Multi-Axle coaches. Enjoy fully flat sleeper berths, individual entertainment consoles, ambient dimmable reading lights, and dedicated luggage lockers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={16} color="#fff" />
                  </div>
                  <span style={{ fontSize: '0.95rem', color: '#CBD5E1' }}>100% Sanitized Bedding & Fresh Pillows on Every Trip</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={16} color="#fff" />
                  </div>
                  <span style={{ fontSize: '0.95rem', color: '#CBD5E1' }}>High-Speed Cabin Wi-Fi & USB-C Supercharge Ports</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={16} color="#fff" />
                  </div>
                  <span style={{ fontSize: '0.95rem', color: '#CBD5E1' }}>Real-time GPS Tracking with Live Arrival Sharing</span>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/search" className="btn-accent">
                  <span>Explore Luxury Sleeper Coaches</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Interior Photograph */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <img
                  src="/images/bus-interior.jpg"
                  alt="BusGo Luxury Sleeper Cabin Interior"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              {/* Floating review card */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  ★ 4.9
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Voted Top Luxury Fleet</strong>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Over 100,000+ happy passenger journeys</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section style={{ padding: '5.5rem 0', background: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Seamless 3-Step Process
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem', marginBottom: '3.5rem' }}>
            How BusGo Booking Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
          }}>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                Search & Compare
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Enter your departure city, destination, and travel date. Filter by departure time, sleeper vs seater, and operator ratings.
              </p>
            </div>

            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: '#FFF7ED',
                color: '#FF6B35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                Pick Exact Berth
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Use our interactive real-time seat layout. Choose your preferred lower deck or upper deck window berth with live fare breakdown.
              </p>
            </div>

            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                Instant Boarding Pass
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Pay securely and get your verified digital M-Ticket with PNR reference. Board directly with zero paper hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase' }}>
              Verified Traveler Reviews
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
              Loved by Over 100,000+ Passengers
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                name: 'Ananya Deshpande',
                route: 'Mumbai to Pune',
                comment: 'The Zingbus sleeper was cleaner than most airline flights! Reached right on time, and the seat map made it so easy to pick a lower window berth.',
                rating: 5,
              },
              {
                name: 'Karthik Rao',
                route: 'Bangalore to Hyderabad',
                comment: 'Booking on BusGo was instantaneous. The live tracking link sent on my phone was spot on. Highly recommended for business travelers!',
                rating: 5,
              },
              {
                name: 'Neha Verma',
                route: 'Delhi to Jaipur',
                comment: 'Loved the dedicated ladies seat option and the transparent pricing with zero surprise charges. The boarding pass printout was super clean.',
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="feature-card" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.6', fontStyle: 'italic', flex: 1 }}>
                  "{t.comment}"
                </p>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>{t.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Traveled {t.route}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Special Promo Banner */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #1D4ED8 0%, #06B6D4 100%)', color: '#fff' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              First Ride Special
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              Save Flat ₹100 on Your First Bus Booking
            </h2>
            <p style={{ color: '#E0F2FE', fontSize: '1.05rem', margin: 0 }}>
              Use coupon code <strong style={{ color: '#FF6B35', background: '#fff', padding: '2px 8px', borderRadius: '6px' }}>BUSGO100</strong> during checkout.
            </p>
          </div>
          <Link to="/search" className="btn-accent" style={{ background: '#0F172A', color: '#fff', padding: '1rem 2rem' }}>
            Book Your Seat Now
          </Link>
        </div>
      </section>
    </div>
  );
}
