import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ShieldCheck, Headphones, CreditCard, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{
      background: '#070B19',
      color: '#94A3B8',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        {/* Trust Badges Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '3.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(37,99,235,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6',
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>100% Safe Travel</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Verified operators & sanitized fleet</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(255,107,53,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF6B35',
            }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Zero Hidden Fees</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Transparent fares with instant refunds</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(6,182,212,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06B6D4',
            }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>24/7 Road Assistance</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Dedicated live support helpline</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16,185,129,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Instant M-Ticket</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Digital boarding pass sent via SMS & Web</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px' }}>
                <Bus size={20} />
              </div>
              <span style={{ fontSize: '1.35rem' }}>Bus<span className="accent">Go</span></span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#94A3B8', marginBottom: '1.25rem' }}>
              BusGo is a next-generation intercity luxury travel platform connecting major metropolitan cities across India with premium sleeper coaches.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <MapPin size={16} color="#3B82F6" /> Mumbai & Pune Expressway Corridors
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <Phone size={16} color="#3B82F6" /> 1800-BUS-GO-24 (Toll Free)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <Mail size={16} color="#3B82F6" /> support@busgo.travel
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/search" style={{ color: '#94A3B8' }}>Search Buses</Link></li>
              <li><Link to="/my-bookings" style={{ color: '#94A3B8' }}>Manage Bookings</Link></li>
              <li><Link to="/about" style={{ color: '#94A3B8' }}>About BusGo</Link></li>
              <li><Link to="/contact" style={{ color: '#94A3B8' }}>Contact Support</Link></li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Bus Routes</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/search?from=Mumbai&to=Pune" style={{ color: '#94A3B8' }}>Mumbai → Pune Express</Link></li>
              <li><Link to="/search?from=Bangalore&to=Hyderabad" style={{ color: '#94A3B8' }}>Bangalore → Hyderabad</Link></li>
              <li><Link to="/search?from=Delhi&to=Jaipur" style={{ color: '#94A3B8' }}>Delhi → Jaipur Pink City</Link></li>
              <li><Link to="/search?from=Mumbai&to=Goa" style={{ color: '#94A3B8' }}>Mumbai → Goa Coastal</Link></li>
              <li><Link to="/search?from=Bangalore&to=Chennai" style={{ color: '#94A3B8' }}>Bangalore → Chennai</Link></li>
            </ul>
          </div>

          {/* Featured Operators */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Partner Operators</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ color: '#94A3B8' }}>Zingbus Electric Multi-Axle</li>
              <li style={{ color: '#94A3B8' }}>IntrCity SmartBus Premium</li>
              <li style={{ color: '#94A3B8' }}>Orange Travels Volvo 9600</li>
              <li style={{ color: '#94A3B8' }}>VRL Travels Super Luxury</li>
              <li style={{ color: '#94A3B8' }}>SRS Travels Club Class</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
        }}>
          <div>
            © {CURRENT_YEAR} BusGo Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ color: '#60A5FA', fontWeight: 600 }}>
            🎓 College Major Project — Full Stack Architecture (Spring Boot 3 + Java 21 + MySQL + React)
          </div>
        </div>
      </div>
    </footer>
  );
}
