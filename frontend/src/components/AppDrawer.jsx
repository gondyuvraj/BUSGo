import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function getDrawerTimeString() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const DRAWER_TODAY_STR = new Date().toISOString().split('T')[0];
const DRAWER_TOMORROW_STR = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();
const DRAWER_WEEKEND_STR = (() => {
  const d = new Date();
  const diff = d.getDay() <= 5 ? 5 - d.getDay() : 0;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
})();

import {
  Bus, Search, User, Star, Shield,
  Wifi, Battery, Clock, Gift, ChevronRight, X, Bot,
  BarChart3, Award, CheckCircle2, Globe, Leaf,
  Navigation, Send, Loader2, RefreshCw, Copy, Phone
} from 'lucide-react';

// ── Static Data ────────────────────────────────────────────────────────────────
const QUICK_ROUTES = [
  { from: 'Mumbai',    to: 'Pune',      price: 499,  duration: '3h 30m',  tag: 'Most Popular', tagColor: '#166534', tagBg: '#DCFCE7' },
  { from: 'Bangalore', to: 'Hyderabad', price: 899,  duration: '8h 45m',  tag: 'Night Special', tagColor: '#1D4ED8', tagBg: '#DBEAFE' },
  { from: 'Delhi',     to: 'Jaipur',    price: 599,  duration: '5h 15m',  tag: 'Weekend Sale',  tagColor: '#7C3AED', tagBg: '#EDE9FE' },
  { from: 'Mumbai',    to: 'Goa',       price: 999,  duration: '11h 00m', tag: 'Beach Trip',    tagColor: '#0369A1', tagBg: '#E0F2FE' },
  { from: 'Bangalore', to: 'Chennai',   price: 649,  duration: '6h 15m',  tag: 'Express',       tagColor: '#92400E', tagBg: '#FEF3C7' },
];

const OFFERS = [
  { code: 'BUSGO100',  desc: 'Flat ₹100 off on first booking',      color: '#2563EB', bg: '#EFF6FF', min: '₹500 min',    expiry: 'Limited time' },
  { code: 'WEEKEND20', desc: '20% off on Fri–Sun night buses',       color: '#10B981', bg: '#ECFDF5', min: '₹800 min',    expiry: 'Fri–Sun only' },
  { code: 'SLEEPER15', desc: '15% off on all AC Sleeper coaches',    color: '#8B5CF6', bg: '#F5F3FF', min: 'No minimum',  expiry: 'This month'   },
  { code: 'NEWUSER50', desc: 'New users get ₹50 wallet credit',      color: '#FF6B35', bg: '#FFF7ED', min: 'First booking', expiry: 'Register now' },
];

const APP_FEATURES = [
  { icon: <Navigation size={16} />, label: 'Live GPS Tracking',  desc: 'Real-time bus location shared with family', color: '#2563EB', bg: '#EFF6FF' },
  { icon: <Shield size={16} />,     label: 'Verified Fleet',     desc: '3-tier safety audit on every coach',        color: '#10B981', bg: '#ECFDF5' },
  { icon: <Wifi size={16} />,       label: 'Free WiFi',          desc: 'High-speed cabin internet',                 color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: <Battery size={16} />,    label: 'USB Charging',       desc: 'USB-C & USB-A at every berth',              color: '#F59E0B', bg: '#FFFBEB' },
  { icon: <Star size={16} />,       label: '4.9★ Rated',         desc: 'Top-rated by 500K+ passengers',            color: '#EF4444', bg: '#FEF2F2' },
  { icon: <Leaf size={16} />,       label: 'Eco Travel',         desc: '70% lower carbon than flying',             color: '#10B981', bg: '#ECFDF5' },
];

const AI_QUICK_PROMPTS = [
  '🎁 Any promo codes?',
  '💸 Cancellation policy?',
  '🛏️ Sleeper vs Seater?',
  '🗺️ Mumbai to Pune bus?',
  '🧳 Luggage allowance?',
  '💳 Payment methods?',
];

// ── Typing Dots ────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '2px 0' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#94A3B8', display: 'inline-block',
          animation: `drawerDotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Main Drawer ────────────────────────────────────────────────────────────────
export default function AppDrawer({ isOpen, onClose }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const drawerRef  = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  const [cities,    setCities]    = useState(['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Delhi', 'Goa', 'Chennai', 'Jaipur']);
  const [quickFrom, setQuickFrom] = useState('Mumbai');
  const [quickTo,   setQuickTo]   = useState('Pune');

  const todayStr = DRAWER_TODAY_STR;
  const tomorrowStr = DRAWER_TOMORROW_STR;
  const weekendStr = DRAWER_WEEKEND_STR;

  const [quickDate, setQuickDate] = useState(todayStr);
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab]  = useState('home');

  // AI chat state
  const [aiMessages, setAiMessages] = useState(() => [
    {
      id: 1, role: 'bot', time: getDrawerTimeString(),
      text: `👋 Hi${user ? ' ' + user.name?.split(' ')[0] : ''}! I'm BusGo AI.\n\nAsk me about routes, offers, cancellation, seat tips, luggage, safety — anything! 🚌`,
    },
  ]);
  const [aiInput,   setAiInput]   = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copied,    setCopied]    = useState('');

  // Load cities
  useEffect(() => {
    api.getCities().then(r => { if (r?.length) setCities(r); }).catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const h = (e) => { if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose(); };
    if (isOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen, onClose]);

  // Close on ESC
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, aiLoading]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleQuickSearch = () => {
    navigate(`/search?from=${quickFrom}&to=${quickTo}&date=${quickDate}`);
    onClose();
  };

  // AI send
  const sendAI = useCallback(async (text) => {
    const msg = (text ?? aiInput).trim();
    // Strip emoji prefix from quick prompt chips
    const clean = msg.replace(/^[\u{1F000}-\u{1FFFF}][\uFE0F]? /u, '').trim();
    if (!clean || aiLoading) return;

    setAiInput('');
    setAiMessages(prev => [...prev, { id: Date.now(), role: 'user', text: clean, time: getTime() }]);
    setAiLoading(true);

    try {
      const res = await api.chatAi(clean);
      setAiMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: res.reply, time: getTime() }]);
    } catch {
      setAiMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'bot', time: getTime(),
        text: '⚠️ Server unreachable right now.\n\nQuick answers:\n• Promo: BUSGO100 (₹100 off)\n• Cancel: My Bookings → Cancel Ticket\n• Help: 1800-BUS-GO-24',
      }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [aiInput, aiLoading]);

  const copyMsg = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const clearAI = () => {
    setAiMessages([{
      id: Date.now(), role: 'bot', time: getDrawerTimeString(),
      text: `Chat cleared! 🔄 Ask me anything about your journey, ${user?.name?.split(' ')[0] || 'traveler'}!`,
    }]);
  };

  if (!isOpen) return null;

  const TABS = [
    { id: 'home',     label: '🏠 Home'     },
    { id: 'ai',       label: '🤖 AI Chat'  },
    { id: 'search',   label: '🔍 Search'   },
    { id: 'offers',   label: '🎁 Offers'   },
    { id: 'features', label: '✨ Features' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(7,11,25,0.72)', backdropFilter: 'blur(5px)',
        animation: 'drawerFadeIn 0.2s ease',
      }} onClick={onClose} />

      {/* Panel */}
      <div ref={drawerRef} style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '440px', maxWidth: '96vw', zIndex: 151,
        background: '#fff', display: 'flex', flexDirection: 'column',
        boxShadow: '6px 0 48px rgba(0,0,0,0.28)',
        animation: 'drawerSlideIn 0.32s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg,#070B19 0%,#0B132B 55%,#1D4ED8 100%)',
          padding: '1.25rem 1.5rem', flexShrink: 0, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(37,99,235,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,107,53,0.08)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.5)' }}>
                <Bus size={22} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
                  Bus<span style={{ color: '#FF6B35' }}>Go</span>
                </div>
                <div style={{ color: '#93C5FD', fontSize: '0.68rem', fontWeight: 600 }}>India's Premium Bus Network</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '9999px', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#fff" />
            </button>
          </div>

          {/* User / auth row */}
          {isAuthenticated ? (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isAdmin ? 'linear-gradient(135deg,#EF4444,#F59E0B)' : 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</div>
                <div style={{ color: '#93C5FD', fontSize: '0.68rem' }}>{isAdmin ? '🔴 Admin Account' : '🔵 Verified Passenger'}</div>
              </div>
              <Link to="/profile" onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '4px 10px', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>Profile</Link>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
              <Link to="/login" onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>Sign In</Link>
              <Link to="/register" onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', textAlign: 'center', background: '#FF6B35', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>Register Free</Link>
            </div>
          )}
        </div>

        {/* ── Tab Bar ── */}
        <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', flexShrink: 0, overflowX: 'auto' }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: '0 0 auto', padding: '0.65rem 0.6rem',
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap',
              color: activeTab === tab.id ? '#2563EB' : '#64748B',
              borderBottom: activeTab === tab.id ? '2.5px solid #2563EB' : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* ══════ HOME ══════ */}
          {activeTab === 'home' && (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Quick Nav */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Quick Navigation</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  {[
                    { icon: '🔍', label: 'Search',     path: '/search',      color: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
                    { icon: '🌴', label: 'Getaways',   path: '/holiday-trips', color: '#ECFDF5', border: '#A7F3D0', text: '#047857' },
                    { icon: '🎫', label: 'Bookings',   path: '/my-bookings', color: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
                    { icon: '🤖', label: 'AI Chat',    path: null,           color: '#F5F3FF', border: '#DDD6FE', text: '#5B21B6', tab: 'ai' },
                    { icon: '📞', label: 'Contact',    path: '/contact',     color: '#FFF7ED', border: '#FED7AA', text: '#92400E' },
                    { icon: '🏢', label: 'About',      path: '/about',       color: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
                    ...(isAdmin
                      ? [{ icon: '🛡️', label: 'Admin', path: '/admin', color: '#0B132B', border: '#1E3A5F', text: '#fff' }]
                      : [{ icon: '🎁', label: 'Offers', path: null, color: '#FFFBEB', border: '#FDE68A', text: '#92400E', tab: 'offers' }]
                    ),
                  ].map((item, i) => (
                    item.path ? (
                      <Link key={i} to={item.path} onClick={onClose} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '0.8rem 0.4rem', background: item.color, border: `1.5px solid ${item.border}`, borderRadius: '14px', textAlign: 'center', transition: 'transform 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <span style={{ fontSize: '1.35rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: item.text }}>{item.label}</span>
                      </Link>
                    ) : (
                      <button key={i} onClick={() => item.tab && setActiveTab(item.tab)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '0.8rem 0.4rem', background: item.color, border: `1.5px solid ${item.border}`, borderRadius: '14px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <span style={{ fontSize: '1.35rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: item.text }}>{item.label}</span>
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* AI CTA banner */}
              <button onClick={() => setActiveTab('ai')} style={{
                width: '100%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                borderRadius: '16px', padding: '1rem 1.25rem', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,70,229,0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)'; }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={22} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.92rem' }}>🤖 BusGo AI Assistant</div>
                  <div style={{ color: '#C4B5FD', fontSize: '0.72rem', marginTop: '2px' }}>Ask routes, offers, cancellations — instant answers</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '5px 10px', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>
                  Chat →
                </div>
              </button>

              {/* Popular Routes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popular Routes</div>
                  <Link to="/search" onClick={onClose} style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    View all <ChevronRight size={11} />
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {QUICK_ROUTES.slice(0, 4).map((r, i) => (
                    <div key={i} onClick={() => { navigate(`/search?from=${r.from}&to=${r.to}`); onClose(); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.9rem', borderRadius: '12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bus size={14} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>{r.from} <span style={{ color: '#FF6B35' }}>→</span> {r.to}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                            <Clock size={9} /> {r.duration}
                            <span style={{ background: r.tagBg, color: r.tagColor, padding: '1px 5px', borderRadius: '9999px', fontWeight: 700, fontSize: '0.6rem' }}>{r.tag}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>₹{r.price}</div>
                        <div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>onwards</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ background: 'linear-gradient(135deg,#0B132B,#1D4ED8)', borderRadius: '14px', padding: '1rem', display: 'flex', justifyContent: 'space-around' }}>
                {[{ v: '500K+', l: 'Passengers' }, { v: '100+', l: 'Routes' }, { v: '4.9★', l: 'Rating' }, { v: '24/7', l: 'Support' }].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{s.v}</div>
                    <div style={{ fontSize: '0.62rem', color: '#93C5FD', fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════ AI CHAT ══════ */}
          {activeTab === 'ai' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

              {/* AI Header */}
              <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#F8FAFC,#fff)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(37,99,235,0.3)' }}>
                    <Bot size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>BusGo AI Assistant</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'drawerBlink 1.5s infinite' }} />
                      Online · Instant replies
                    </div>
                  </div>
                </div>
                <button onClick={clearAI} style={{ padding: '4px 10px', borderRadius: '7px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <RefreshCw size={10} /> Clear
                </button>
              </div>

              {/* Quick prompts */}
              <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '5px', overflowX: 'auto', flexShrink: 0, background: '#FAFAFA' }}>
                {AI_QUICK_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendAI(p)} style={{ padding: '4px 10px', borderRadius: '9999px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {p}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0', background: 'linear-gradient(180deg,#F8FAFC,#fff)' }}>
                {aiMessages.map((msg) => {
                  const isBot = msg.role === 'bot';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: isBot ? 'row' : 'row-reverse', alignItems: 'flex-end', gap: '7px', marginBottom: '0.85rem', animation: 'drawerMsgIn 0.2s ease-out' }}>
                      {/* Avatar */}
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: isBot ? 'linear-gradient(135deg,#2563EB,#06B6D4)' : 'linear-gradient(135deg,#FF6B35,#EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isBot ? <Bot size={14} color="#fff" /> : <User size={14} color="#fff" />}
                      </div>
                      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                        <div style={{ padding: '0.65rem 0.9rem', borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: isBot ? '#fff' : 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: isBot ? '#1E293B' : '#fff', fontSize: '0.82rem', lineHeight: '1.6', boxShadow: isBot ? '0 2px 10px rgba(15,23,42,0.08),0 0 0 1px rgba(226,232,240,0.8)' : '0 3px 12px rgba(37,99,235,0.3)', whiteSpace: 'pre-line' }}>
                          {msg.text}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 3px' }}>
                          <span style={{ fontSize: '0.6rem', color: '#94A3B8' }}>{msg.time}</span>
                          {isBot && (
                            <button onClick={() => copyMsg(msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px' }}>
                              {copied === msg.text ? <CheckCircle2 size={9} color="#10B981" /> : <Copy size={9} />}
                              {copied === msg.text ? 'Copied' : 'Copy'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {aiLoading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '7px', marginBottom: '0.85rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={14} color="#fff" />
                    </div>
                    <div style={{ padding: '0.65rem 0.9rem', borderRadius: '4px 14px 14px 14px', background: '#fff', boxShadow: '0 2px 10px rgba(15,23,42,0.08),0 0 0 1px rgba(226,232,240,0.8)' }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '0.75rem', borderTop: '1px solid #E2E8F0', background: '#fff', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '0.5rem 0.5rem 0.5rem 0.85rem', transition: 'border-color 0.2s' }}>
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={aiInput}
                    onChange={(e) => {
                      setAiInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(); } }}
                    placeholder="Ask me anything about BusGo..."
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.85rem', color: '#0F172A', outline: 'none', resize: 'none', lineHeight: '1.5', minHeight: '22px', maxHeight: '100px', overflowY: 'auto', fontFamily: 'inherit' }}
                  />
                  <button
                    onClick={() => sendAI()}
                    disabled={!aiInput.trim() || aiLoading}
                    style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: aiInput.trim() && !aiLoading ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : '#E2E8F0', border: 'none', cursor: aiInput.trim() && !aiLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: aiInput.trim() && !aiLoading ? '#fff' : '#94A3B8', transition: 'all 0.2s', boxShadow: aiInput.trim() && !aiLoading ? '0 3px 10px rgba(37,99,235,0.3)' : 'none' }}
                  >
                    {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#94A3B8', marginTop: '4px', textAlign: 'center' }}>
                  Enter to send · Shift+Enter for new line
                </div>
              </div>
            </div>
          )}

          {/* ══════ SEARCH ══════ */}
          {activeTab === 'search' && (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>🔍 Quick Bus Search</div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>From City</label>
                <select value={quickFrom} onChange={(e) => setQuickFrom(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, background: '#F8FAFC', outline: 'none' }}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => { const t = quickFrom; setQuickFrom(quickTo); setQuickTo(t); }} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EFF6FF', border: '1.5px solid #BFDBFE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⇅</button>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>To City</label>
                <select value={quickTo} onChange={(e) => setQuickTo(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, background: '#F8FAFC', outline: 'none' }}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Journey Date</label>
                <input type="date" min={todayStr} value={quickDate} onChange={(e) => setQuickDate(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '0.9rem', background: '#F8FAFC', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[{ l: 'Today', v: todayStr }, { l: 'Tomorrow', v: tomorrowStr }, { l: 'Weekend', v: weekendStr }].map((b) => (
                  <button key={b.l} onClick={() => setQuickDate(b.v)} style={{ flex: 1, padding: '5px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', background: quickDate === b.v ? '#EFF6FF' : '#F8FAFC', border: `1px solid ${quickDate === b.v ? '#3B82F6' : '#E2E8F0'}`, color: quickDate === b.v ? '#1D4ED8' : '#64748B' }}>{b.l}</button>
                ))}
              </div>
              <button onClick={handleQuickSearch} style={{ padding: '0.85rem', borderRadius: '12px', background: 'linear-gradient(135deg,#FF6B35,#EA580C)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 4px 14px rgba(255,107,53,0.4)' }}>
                <Search size={18} /> Search Available Buses
              </button>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.65rem' }}>Trending Routes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {QUICK_ROUTES.map((r, i) => (
                    <button key={i} onClick={() => { setQuickFrom(r.from); setQuickTo(r.to); }} style={{ padding: '5px 10px', borderRadius: '9999px', background: quickFrom === r.from && quickTo === r.to ? '#2563EB' : '#F1F5F9', color: quickFrom === r.from && quickTo === r.to ? '#fff' : '#475569', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      {r.from} → {r.to}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════ OFFERS ══════ */}
          {activeTab === 'offers' && (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>🎁 Live Offers & Promo Codes</div>
              {OFFERS.map((offer, i) => (
                <div key={i} style={{ background: offer.bg, border: `1.5px solid ${offer.color}30`, borderRadius: '14px', padding: '1rem', borderLeft: `4px solid ${offer.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <button onClick={() => copyCode(offer.code)} style={{ background: offer.color, color: '#fff', padding: '4px 12px', borderRadius: '7px', fontWeight: 800, fontSize: '0.82rem', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>
                      {copiedCode === offer.code ? '✓ Copied!' : offer.code}
                    </button>
                    <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>
                      <div>{offer.min}</div><div>{offer.expiry}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{offer.desc}</div>
                </div>
              ))}
              <div style={{ background: 'linear-gradient(135deg,#0B132B,#312E81)', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                  <Gift size={18} color="#A78BFA" />
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.92rem' }}>Refer & Earn ₹75</div>
                </div>
                <div style={{ color: '#C4B5FD', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '0.85rem' }}>Refer a friend — both of you get ₹75 wallet credit on their first booking!</div>
                <button style={{ background: '#A78BFA', color: '#fff', padding: '0.55rem 1rem', borderRadius: '9px', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>Share Referral Link</button>
              </div>
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                  <Award size={16} color="#D97706" />
                  <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.88rem' }}>BusGo Loyalty Points</div>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350F', lineHeight: '1.5' }}>Earn 1 point per ₹10 spent. 100 pts = ₹10 off. Gold members get 2× points!</div>
                {isAuthenticated && <div style={{ marginTop: '0.6rem', background: '#FEF3C7', borderRadius: '7px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, color: '#92400E' }}>🌟 Your Points: <span style={{ color: '#D97706' }}>0</span> pts</div>}
              </div>
            </div>
          )}

          {/* ══════ FEATURES ══════ */}
          {activeTab === 'features' && (
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>✨ Why Choose BusGo</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {APP_FEATURES.map((f, i) => (
                  <div key={i} style={{ background: f.bg, border: `1.5px solid ${f.color}25`, borderRadius: '12px', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ color: f.color }}>{f.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>{f.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.85rem' }}>How It Works</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { n: '1', t: 'Search & Compare', d: 'Enter source, destination & date', c: '#2563EB' },
                    { n: '2', t: 'Pick Your Berth',  d: 'Choose seat from live seat map', c: '#FF6B35' },
                    { n: '3', t: 'Pay Securely',      d: 'UPI, card, net banking — instant', c: '#10B981' },
                    { n: '4', t: 'Get M-Ticket',      d: 'Digital boarding pass on phone', c: '#8B5CF6' },
                  ].map((s) => (
                    <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.c, color: '#fff', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{s.t}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#0B132B', borderRadius: '14px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.7rem' }}>
                  <BarChart3 size={14} color="#60A5FA" />
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>Built With Modern Tech</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {['Java 21', 'Spring Boot 3', 'React 19', 'MySQL 8', 'JWT Auth', 'Vite 8', 'REST API'].map((t) => (
                    <span key={t} style={{ padding: '2px 8px', borderRadius: '9999px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.25)', color: '#93C5FD', fontSize: '0.68rem', fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '14px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                  <Shield size={16} color="#059669" />
                  <div style={{ fontWeight: 800, color: '#065F46', fontSize: '0.88rem' }}>BusGo Safety Promise</div>
                </div>
                {['100% verified operators', '90% refund on cancellation', '24/7 live support', 'On-time or full refund guarantee'].map((p) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#065F46', marginTop: '4px' }}>
                    <CheckCircle2 size={11} color="#059669" /> {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>© 2026 BusGo Technologies · v1.0.0</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/contact" onClick={onClose} style={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}><Phone size={10} /> Help</Link>
            <Link to="/about" onClick={onClose} style={{ color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}><Globe size={10} /> About</Link>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes drawerDotBounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.5; }
          40%           { transform: translateY(-5px); opacity: 1;   }
        }
        @keyframes drawerBlink {
          0%, 100% { opacity: 1;   }
          50%      { opacity: 0.3; }
        }
        @keyframes drawerMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </>
  );
}
