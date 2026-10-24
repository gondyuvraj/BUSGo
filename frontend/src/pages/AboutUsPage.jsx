import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bus, ShieldCheck, Award, Zap, Globe, Users, TrendingUp, Star,
  CheckCircle2, ArrowRight, MapPin, Clock, Wifi, Battery,
  Lock, Heart, Leaf, Code2, Database, Server, Cpu,
  ChevronLeft, ChevronRight, Quote
} from 'lucide-react';

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

// ── Testimonial Carousel ──────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Ananya Deshpande',
    role: 'Product Manager, Mumbai',
    text: 'BusGo changed how I commute between Mumbai and Pune every week. The sleeper berths are genuinely comfortable and the live tracking actually works. Nothing like the old days of guessing ETAs.',
    rating: 5,
    route: 'Mumbai → Pune',
    avatar: 'A',
    color: '#2563EB',
  },
  {
    name: 'Karthik Rao',
    role: 'Software Engineer, Bangalore',
    text: 'Booked a last-minute Bangalore to Hyderabad trip at midnight and had my ticket confirmed in under 30 seconds. The seat map is the best feature — I always grab a lower deck window.',
    rating: 5,
    route: 'Bangalore → Hyderabad',
    avatar: 'K',
    color: '#8B5CF6',
  },
  {
    name: 'Neha Verma',
    role: 'Consultant, Delhi',
    text: 'As a solo female traveler, the dedicated ladies seat option and real-time driver tracking give me real peace of mind. The 90% refund policy is honest and fair.',
    rating: 5,
    route: 'Delhi → Jaipur',
    avatar: 'N',
    color: '#EC4899',
  },
  {
    name: 'Rohan Mehta',
    role: 'Startup Founder, Goa',
    text: 'Took the Mumbai-Goa overnight sleeper for a client trip. Woke up refreshed, on time, and with 0 drama. The boarding pass QR worked perfectly. Will never fly short-haul again.',
    rating: 5,
    route: 'Mumbai → Goa',
    avatar: 'R',
    color: '#10B981',
  },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1));

  const t = TESTIMONIALS[idx];

  return (
    <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
      <div style={{
        background: '#fff',
        border: '1.5px solid #E2E8F0',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(15,23,42,0.1)',
        minHeight: '220px',
        position: 'relative',
      }}>
        <Quote size={40} color="#EFF6FF" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }} />

        <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
          ))}
        </div>

        <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: '1.75', fontStyle: 'italic', marginBottom: '1.75rem' }}>
          "{t.text}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '50%',
              background: t.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem',
            }}>
              {t.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{t.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{t.role}</div>
            </div>
          </div>
          <div style={{
            background: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: '9999px', padding: '4px 12px',
            fontSize: '0.78rem', fontWeight: 700, color: '#475569',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <MapPin size={12} color="#2563EB" /> {t.route}
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={prev}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#fff', border: '1.5px solid #E2E8F0',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <ChevronLeft size={18} color="#475569" />
        </button>

        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === idx ? '#2563EB' : '#CBD5E1',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}

        <button
          onClick={next}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#fff', border: '1.5px solid #E2E8F0',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <ChevronRight size={18} color="#475569" />
        </button>
      </div>
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
const TIMELINE = [
  { year: '2021', title: 'Idea Born', desc: 'Founded by two college friends frustrated by unreliable bus booking platforms and hidden charges.', color: '#2563EB' },
  { year: '2022', title: 'First Launch', desc: 'Launched in Mumbai-Pune corridor with 3 verified luxury operators and 200 daily users.', color: '#8B5CF6' },
  { year: '2023', title: 'Rapid Growth', desc: 'Expanded to 12 cities, 50+ routes, and crossed 1 lakh total bookings with 4.8 avg rating.', color: '#10B981' },
  { year: '2024', title: 'AI Integration', desc: 'Launched AI travel assistant, live GPS tracking, and dynamic seat pricing engine.', color: '#F59E0B' },
  { year: '2025', title: 'Pan-India', desc: 'Now operating 100+ routes across 30 cities with 500,000+ happy passengers and growing.', color: '#EF4444' },
];

// ── Team ──────────────────────────────────────────────────────────────────────
const TEAM = [
  { name: 'Yuvraj Sharma', role: 'Full Stack Developer & Founder', avatar: 'Y', color: '#2563EB', skills: ['Java', 'Spring Boot', 'React', 'MySQL'] },
  { name: 'Rahul Deshmukh', role: 'Backend Architect', avatar: 'R', color: '#8B5CF6', skills: ['Spring Security', 'JWT', 'REST APIs', 'Hibernate'] },
  { name: 'Priya Iyer', role: 'UI/UX Designer', avatar: 'P', color: '#EC4899', skills: ['Figma', 'CSS', 'React', 'Design Systems'] },
  { name: 'Arjun Nair', role: 'DevOps & Database', avatar: 'A', color: '#10B981', skills: ['MySQL', 'Docker', 'CI/CD', 'Linux'] },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutUsPage() {
  return (
    <div style={{ flex: 1, background: '#F8FAFC', paddingBottom: '0' }}>

      {/* ── 1. Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #070B19 0%, #0B132B 50%, #1E3A5F 100%)',
        color: '#fff',
        padding: '5rem 0 6rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[
          { size: 400, top: '-100px', right: '-100px', opacity: 0.06 },
          { size: 250, bottom: '-80px', left: '-60px', opacity: 0.08 },
          { size: 150, top: '30%', left: '40%', opacity: 0.04 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.size, height: c.size,
            borderRadius: '50%', background: '#2563EB',
            top: c.top, bottom: c.bottom, left: c.left, right: c.right,
            opacity: c.opacity, pointerEvents: 'none',
          }} />
        ))}

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(96,165,250,0.3)',
            padding: '0.4rem 1.25rem', borderRadius: '9999px',
            fontSize: '0.82rem', fontWeight: 700, color: '#93C5FD', marginBottom: '1.5rem',
          }}>
            <Bus size={14} /> India's Most Trusted Bus Network
          </div>

          <h1 style={{
            fontSize: '3.5rem', fontWeight: 800, color: '#fff',
            margin: '0 0 1.25rem', letterSpacing: '-0.03em', lineHeight: '1.1',
          }}>
            The Story Behind <br />
            <span style={{
              background: 'linear-gradient(135deg, #FF6B35, #F59E0B)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>BusGo</span>
          </h1>

          <p style={{
            color: '#94A3B8', fontSize: '1.15rem', maxWidth: '580px',
            margin: '0 auto 3rem', lineHeight: '1.7',
          }}>
            We set out to fix everything wrong with intercity bus travel — hidden fees, unreliable operators, terrible booking UX. Here's what we built instead.
          </p>

          {/* Animated Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '4rem',
            flexWrap: 'wrap',
          }}>
            {[
              { value: 500000, suffix: '+', label: 'Happy Passengers' },
              { value: 100, suffix: '+', label: 'Express Routes' },
              { value: 30, suffix: '+', label: 'Cities Covered' },
              { value: 4.9, suffix: '/5', label: 'Avg Rating', isFloat: true },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff' }}>
                  {s.isFloat ? s.value + s.suffix : <><AnimatedCounter target={s.value} suffix={s.suffix} /></>}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Mission & Values ── */}
      <section style={{ padding: '5.5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              What Drives Us
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Our Mission & Core Values
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: <ShieldCheck size={26} color="#fff" />,
                bg: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                title: 'Safety First',
                desc: 'Every coach undergoes rigorous operator vetting, real-time GPS monitoring, and 3-tier safety audits before it earns the BusGo badge.',
              },
              {
                icon: <Award size={26} color="#fff" />,
                bg: 'linear-gradient(135deg, #FF6B35, #F59E0B)',
                title: 'Radical Transparency',
                desc: 'Zero hidden fees. The price you see in search is the exact price you pay at checkout — no terminal charges, no convenience fees.',
              },
              {
                icon: <Zap size={26} color="#fff" />,
                bg: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                title: 'Speed & Reliability',
                desc: 'Booking confirmation in under 30 seconds. Live seat availability. Instant digital M-Tickets. No waiting, no guessing.',
              },
              {
                icon: <Heart size={26} color="#fff" />,
                bg: 'linear-gradient(135deg, #EF4444, #F59E0B)',
                title: 'Passenger-First Design',
                desc: 'Every feature — seat maps, ladies seats, 90% refund policy, live tracking — was built because real passengers asked for it.',
              },
              {
                icon: <Leaf size={26} color="#fff" />,
                bg: 'linear-gradient(135deg, #10B981, #06B6D4)',
                title: 'Sustainable Travel',
                desc: 'Bus travel has 70% lower carbon footprint than air. We actively promote shared, high-capacity green transport across India.',
              },
              {
                icon: <Globe size={26} color="#fff" />,
                bg: 'linear-gradient(135deg, #0B132B, #2563EB)',
                title: 'Pan-India Reach',
                desc: 'From metro to Tier-2 city corridors, BusGo is expanding access to premium, verified bus travel for every Indian traveler.',
              },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #E2E8F0',
                borderRadius: '20px', padding: '1.75rem',
                transition: 'all 0.25s', cursor: 'default',
                boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(15,23,42,0.12)';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.05)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  background: card.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.15rem',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.2)',
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.6rem' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.65', margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Journey Timeline ── */}
      <section style={{ padding: '5.5rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Our Story
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              The BusGo Journey
            </h2>
          </div>

          <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: '2px', background: 'linear-gradient(180deg, #2563EB, #EF4444)',
              transform: 'translateX(-50%)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  gap: '2rem',
                }}>
                  <div style={{
                    flex: 1,
                    background: '#fff', border: '1.5px solid #E2E8F0',
                    borderRadius: '16px', padding: '1.25rem 1.5rem',
                    boxShadow: '0 4px 16px rgba(15,23,42,0.07)',
                    textAlign: i % 2 === 0 ? 'right' : 'left',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color, textTransform: 'uppercase', marginBottom: '4px' }}>
                      {item.year}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.55' }}>
                      {item.desc}
                    </div>
                  </div>

                  {/* Center dot */}
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: item.color, border: '3px solid #fff',
                    boxShadow: `0 0 0 3px ${item.color}55`,
                    flexShrink: 0, zIndex: 1,
                  }} />

                  <div style={{ flex: 1 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Why BusGo Features Grid ── */}
      <section style={{ padding: '5.5rem 0', background: '#0B132B', color: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Features
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Why Passengers Choose BusGo
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: <Wifi size={22} />, label: 'High-Speed Cabin WiFi', color: '#60A5FA' },
              { icon: <Battery size={22} />, label: 'USB-C Charging Ports', color: '#34D399' },
              { icon: <Lock size={22} />, label: 'Secure Digital Payments', color: '#FBBF24' },
              { icon: <MapPin size={22} />, label: 'Real-Time GPS Tracking', color: '#F87171' },
              { icon: <Users size={22} />, label: 'Dedicated Ladies Seats', color: '#F472B6' },
              { icon: <Clock size={22} />, label: 'On-Time Guarantee', color: '#A78BFA' },
              { icon: <ShieldCheck size={22} />, label: 'Verified Operators Only', color: '#34D399' },
              { icon: <TrendingUp size={22} />, label: 'Live Seat Availability', color: '#60A5FA' },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: '0.85rem',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(37,99,235,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: f.color }}>{f.icon}</div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#CBD5E1' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Tech Stack ── */}
      <section style={{ padding: '5.5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Engineering Excellence
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Built on Modern Architecture
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '560px', margin: '0.75rem auto 0', lineHeight: '1.65' }}>
              End-to-end full-stack platform built with production-grade patterns and industrial best practices.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              {
                icon: <Server size={24} color="#fff" />,
                bg: 'linear-gradient(135deg, #EA580C, #DC2626)',
                title: 'Backend — Java Spring Boot',
                items: [
                  'Java 21 with Spring Boot 3.3.4',
                  'Spring Security + Stateless JWT Auth',
                  'Spring Data JPA + Hibernate ORM',
                  'RESTful API with full CORS config',
                  'BCrypt password hashing',
                  'Server-side race condition prevention',
                ],
              },
              {
                icon: <Database size={24} color="#fff" />,
                bg: 'linear-gradient(135deg, #0284C7, #0369A1)',
                title: 'Database — MySQL 8.0',
                items: [
                  'Normalized relational schema (6NF)',
                  'InnoDB with foreign key constraints',
                  'Transaction isolation for bookings',
                  'Hibernate auto DDL migration',
                  'Indexed seat & schedule queries',
                  'DataInitializer seed on first boot',
                ],
              },
              {
                icon: <Code2 size={24} color="#fff" />,
                bg: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                title: 'Frontend — React + Vite',
                items: [
                  'React 19 with functional components',
                  'React Router v7 with protected routes',
                  'Context API for Auth & Toast state',
                  'Vite 8 build toolchain (< 1s HMR)',
                  'Lucide React icon system',
                  'Mobile-responsive CSS design system',
                ],
              },
              {
                icon: <Cpu size={24} color="#fff" />,
                bg: 'linear-gradient(135deg, #059669, #0D9488)',
                title: 'Smart Features',
                items: [
                  'AI Travel Assistant (rule-based NLP)',
                  'Real-time seat map with live status',
                  'Concurrent booking race protection',
                  'Role-based access (Admin / User)',
                  'Animated counter & carousel UI',
                  'Interactive FAQ accordion',
                ],
              },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
              }}>
                <div style={{
                  background: card.bg, padding: '1.25rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>
                    {card.title}
                  </h3>
                </div>
                <ul style={{ padding: '1.25rem 1.5rem', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {card.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#475569' }}>
                      <CheckCircle2 size={14} color="#10B981" style={{ flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Team ── */}
      <section style={{ padding: '5.5rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The People
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Meet the Team
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {TEAM.map((member, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #E2E8F0',
                borderRadius: '20px', padding: '1.75rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
                transition: 'all 0.25s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(15,23,42,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.06)';
                }}
              >
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: member.color, color: '#fff',
                  fontWeight: 800, fontSize: '1.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: `0 8px 20px ${member.color}55`,
                }}>
                  {member.avatar}
                </div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '4px' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
                  {member.role}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                  {member.skills.map((skill) => (
                    <span key={skill} style={{
                      padding: '3px 10px', borderRadius: '9999px',
                      background: member.color + '15', color: member.color,
                      fontSize: '0.72rem', fontWeight: 700,
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Testimonials ── */}
      <section style={{ padding: '5.5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verified Traveler Reviews
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              What Our Passengers Say
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ── 8. CTA Banner ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1D4ED8 0%, #0B132B 60%, #06B6D4 100%)',
        padding: '5rem 0',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.35rem 1rem', borderRadius: '9999px',
            fontSize: '0.8rem', fontWeight: 700, color: '#BFDBFE', marginBottom: '1.25rem',
          }}>
            <Star size={13} fill="#BFDBFE" color="#BFDBFE" /> Trusted by 500,000+ passengers
          </div>
          <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
            Ready for Your Next Journey?
          </h2>
          <p style={{ color: '#93C5FD', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            Join half a million travelers who've switched to premium, verified, transparent bus booking.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/search" className="btn-accent" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
              Book a Bus Now <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-outline" style={{
              padding: '1rem 2.25rem', fontSize: '1rem',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
            }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
