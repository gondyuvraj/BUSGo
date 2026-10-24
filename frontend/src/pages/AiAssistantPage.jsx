import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot, Send, User, Sparkles, Zap, Ticket, MapPin,
  Shield, RefreshCw, Copy,
  CheckCircle2, Loader2, ChevronRight, Star,
  MessageCircle, Lightbulb, TrendingUp, Gift
} from 'lucide-react';

// ── Suggested Prompts ─────────────────────────────────────────────────────────
const PROMPT_CATEGORIES = [
  {
    label: 'Popular Routes',
    icon: <MapPin size={15} />,
    color: '#2563EB',
    bg: '#EFF6FF',
    prompts: [
      'Mumbai to Pune bus timings and fares',
      'Bangalore to Hyderabad overnight bus',
      'Mumbai to Goa luxury sleeper bus',
      'Delhi to Jaipur bus schedule',
    ],
  },
  {
    label: 'Offers & Savings',
    icon: <Gift size={15} />,
    color: '#FF6B35',
    bg: '#FFF7ED',
    prompts: [
      'What discount codes are available?',
      'How to get first booking offer?',
      'Weekend travel discount',
      'Referral program benefits',
    ],
  },
  {
    label: 'Booking Help',
    icon: <Ticket size={15} />,
    color: '#10B981',
    bg: '#ECFDF5',
    prompts: [
      'How do I book a ticket?',
      'Cancellation and refund policy',
      'How to download boarding pass',
      'What ID is needed to board',
    ],
  },
  {
    label: 'Travel Tips',
    icon: <Lightbulb size={15} />,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    prompts: [
      'AC Sleeper vs AC Seater — which to choose?',
      'Upper deck vs lower deck berth',
      'Luggage allowance on BusGo',
      'Safety features on BusGo buses',
    ],
  },
];

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#94A3B8', display: 'inline-block',
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, onCopy }) {
  const isBot = msg.role === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy(msg.text);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: isBot ? 'row' : 'row-reverse',
      alignItems: 'flex-end',
      gap: '10px',
      marginBottom: '1rem',
      animation: 'messageSlideIn 0.25s ease-out',
    }}>
      {/* Avatar */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
        background: isBot
          ? 'linear-gradient(135deg, #2563EB, #06B6D4)'
          : 'linear-gradient(135deg, #FF6B35, #EA580C)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isBot ? '0 2px 8px rgba(37,99,235,0.3)' : '0 2px 8px rgba(255,107,53,0.3)',
      }}>
        {isBot ? <Bot size={18} color="#fff" /> : <User size={18} color="#fff" />}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
        <div style={{
          padding: '0.85rem 1.1rem',
          borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
          background: isBot ? '#ffffff' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: isBot ? '#1E293B' : '#fff',
          fontSize: '0.9rem', lineHeight: '1.65',
          boxShadow: isBot
            ? '0 2px 12px rgba(15,23,42,0.08), 0 0 0 1px rgba(226,232,240,0.8)'
            : '0 4px 14px rgba(37,99,235,0.35)',
          whiteSpace: 'pre-line',
        }}>
          {msg.text}
        </div>

        {/* Timestamp + copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
          <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{msg.time}</span>
          {isBot && (
            <button
              onClick={handleCopy}
              title="Copy message"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px',
                fontSize: '0.68rem', padding: '2px 4px', borderRadius: '4px',
              }}
            >
              {copied ? <CheckCircle2 size={11} color="#10B981" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getCurrentTimeString() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AiAssistantPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      id: 1, role: 'bot', time: getCurrentTimeString(),
      text: `👋 Namaste${user ? ', ' + user.name?.split(' ')[0] : ''}! I'm BusGo AI — your intelligent travel companion.\n\nI can help you with route info, promo codes, cancellations, seat recommendations, luggage rules, safety info, and much more.\n\nWhat would you like to know today? 🚌`,
    },
  ]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    setSessionStarted(true);

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.chatAi(msg);
      const botMsg = { id: Date.now() + 1, role: 'bot', text: res.reply, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, role: 'bot', time: getTime(),
        text: '⚠️ I\'m having trouble connecting to the server right now.\n\nQuick answers:\n• Promo code: **BUSGO100** (₹100 off)\n• Cancel: My Bookings → Cancel Ticket\n• Support: 1800-BUS-GO-24\n\nPlease try again in a moment!',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(), role: 'bot', time: getTime(),
      text: `Chat cleared! 🔄 Starting fresh. How can I help you today, ${user?.name?.split(' ')[0] || 'traveler'}?`,
    }]);
    setSessionStarted(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC', minHeight: 'calc(100vh - 76px)' }}>

      {/* ── Hero Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #070B19 0%, #0B132B 55%, #1D4ED8 100%)',
        padding: '2.5rem 0 3.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {[
          { w: 300, h: 300, top: -100, right: -50, opacity: 0.07 },
          { w: 180, h: 180, bottom: -60, left: 80, opacity: 0.06 },
          { w: 120, h: 120, top: '30%', left: '45%', opacity: 0.04 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.w, height: c.h, borderRadius: '50%',
            background: '#2563EB', top: c.top, bottom: c.bottom,
            left: c.left, right: c.right, opacity: c.opacity, pointerEvents: 'none',
          }} />
        ))}

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          {/* Animated AI icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 1.5rem',
            background: 'linear-gradient(135deg, #2563EB, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(37,99,235,0.5)',
            animation: 'aiPulse 3s ease-in-out infinite',
          }}>
            <Bot size={40} color="#fff" />
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(52,211,153,0.3)',
            padding: '0.3rem 1rem', borderRadius: '9999px',
            fontSize: '0.78rem', fontWeight: 700, color: '#34D399',
            marginBottom: '1rem',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34D399', display: 'inline-block', animation: 'blink 1.5s infinite' }} />
            Online · Instant AI Responses
          </div>

          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', margin: '0 0 0.75rem', letterSpacing: '-0.03em' }}>
            BusGo <span style={{ background: 'linear-gradient(135deg,#60A5FA,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Assistant</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            Your intelligent travel companion — routes, offers, policies, and booking help in seconds.
          </p>

          {/* Capability pills */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { icon: '🗺️', label: 'Route Info' },
              { icon: '🎁', label: 'Promo Codes' },
              { icon: '💸', label: 'Refund Policy' },
              { icon: '🛏️', label: 'Seat Advice' },
              { icon: '🧳', label: 'Luggage Rules' },
              { icon: '🔒', label: 'Safety Info' },
              { icon: '💳', label: 'Payments' },
              { icon: '📱', label: 'Boarding Help' },
            ].map((p) => (
              <div key={p.label} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                padding: '5px 12px', borderRadius: '9999px',
                fontSize: '0.78rem', fontWeight: 600, color: '#CBD5E1',
              }}>
                <span>{p.icon}</span> {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="container" style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', marginTop: '-2rem', paddingBottom: '2rem', alignItems: 'start' }}>

        {/* ── Left Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '90px' }}>

          {/* Suggested Prompts */}
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.07)' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#2563EB" />
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>Suggested Questions</span>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
              {PROMPT_CATEGORIES.map((cat, i) => (
                <button key={i} onClick={() => setActiveCategory(i)} style={{
                  padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                  background: activeCategory === i ? cat.color : '#F8FAFC',
                  color: activeCategory === i ? '#fff' : '#64748B',
                  border: `1.5px solid ${activeCategory === i ? cat.color : '#E2E8F0'}`,
                  transition: 'all 0.15s',
                }}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Prompts List */}
            <div style={{ padding: '0.5rem' }}>
              {PROMPT_CATEGORIES[activeCategory].prompts.map((prompt, i) => (
                <button key={i} onClick={() => sendMessage(prompt)} style={{
                  width: '100%', textAlign: 'left', padding: '0.7rem 0.85rem',
                  borderRadius: '10px', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '0.83rem', color: '#334155', fontWeight: 500,
                  transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: '8px',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = PROMPT_CATEGORIES[activeCategory].bg}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: PROMPT_CATEGORIES[activeCategory].color, flexShrink: 0 }}>
                    {PROMPT_CATEGORIES[activeCategory].icon}
                  </span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* AI Stats Card */}
          <div style={{ background: 'linear-gradient(135deg,#0B132B,#1E3A5F)', borderRadius: '20px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <TrendingUp size={16} color="#60A5FA" />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.88rem' }}>AI Performance</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Response Time', value: '< 1s', color: '#34D399' },
                { label: 'Accuracy', value: '98.5%', color: '#60A5FA' },
                { label: 'Topics Covered', value: '50+', color: '#FBBF24' },
                { label: 'Languages', value: 'EN / HI', color: '#F472B6' },
              ].map((s) => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{s.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '1rem 1.25rem', boxShadow: '0 4px 20px rgba(15,23,42,0.07)' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#F59E0B" /> Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: '🔍 Search Buses', path: '/search', color: '#2563EB' },
                { label: '🎫 My Bookings', path: '/my-bookings', color: '#10B981' },
                { label: '📞 Contact Support', path: '/contact', color: '#8B5CF6' },
              ].map((a) => (
                <button key={a.path} onClick={() => navigate(a.path)} style={{
                  width: '100%', textAlign: 'left', padding: '0.6rem 0.85rem',
                  borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: a.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  {a.label} <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Chat Window ── */}
        <div style={{
          background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '24px',
          overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
          display: 'flex', flexDirection: 'column', minHeight: '600px',
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '1rem 1.5rem', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #F8FAFC, #fff)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: 'linear-gradient(135deg,#2563EB,#8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              }}>
                <Bot size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>BusGo AI Assistant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'blink 1.5s infinite' }} />
                  Online · Powered by BusGo Intelligence
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                {messages.length - 1} messages
              </div>
              <button
                onClick={clearChat}
                title="Clear chat"
                style={{ padding: '6px 12px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={12} /> Clear
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1.5rem',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)',
            minHeight: '400px', maxHeight: '520px',
          }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} color="#fff" />
                </div>
                <div style={{
                  padding: '0.75rem 1.1rem', borderRadius: '4px 18px 18px 18px',
                  background: '#fff', boxShadow: '0 2px 12px rgba(15,23,42,0.08), 0 0 0 1px rgba(226,232,240,0.8)',
                }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          {!sessionStarted && (
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#FAFAFA' }}>
              {[
                '🎁 Any promo codes?',
                '🗺️ Mumbai to Pune',
                '💸 Cancellation policy',
                '🛏️ Which seat to pick?',
              ].map((chip) => (
                <button key={chip} onClick={() => sendMessage(chip.replace(/^[^\w]+ /, ''))} style={{
                  padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700,
                  background: '#EFF6FF', border: '1.5px solid #BFDBFE', color: '#2563EB',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', background: '#fff',
          }}>
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-end',
              background: '#F8FAFC', border: '1.5px solid #E2E8F0',
              borderRadius: '16px', padding: '0.65rem 0.65rem 0.65rem 1rem',
              transition: 'border-color 0.2s',
            }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about BusGo — routes, offers, tickets, safety..."
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '0.92rem', color: '#0F172A', outline: 'none',
                  resize: 'none', lineHeight: '1.5', minHeight: '24px',
                  maxHeight: '120px', overflowY: 'auto', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg,#2563EB,#1D4ED8)'
                    : '#E2E8F0',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: input.trim() && !loading ? '#fff' : '#94A3B8',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() && !loading ? '0 4px 12px rgba(37,99,235,0.35)' : 'none',
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', padding: '0 4px' }}>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                Press Enter to send · Shift+Enter for new line
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                🔒 Responses powered by BusGo Intelligence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Feature Strip ── */}
      <div style={{ background: '#0B132B', padding: '2.5rem 0', marginTop: '1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Zap size={20} color="#FBBF24" />, title: 'Instant Answers', desc: 'Sub-second AI response time' },
              { icon: <MessageCircle size={20} color="#34D399" />, title: '50+ Topics', desc: 'Routes, offers, safety, booking' },
              { icon: <Shield size={20} color="#60A5FA" />, title: 'Always Available', desc: '24/7 without wait time' },
              { icon: <Star size={20} color="#F472B6" />, title: '98.5% Accuracy', desc: 'Verified travel information' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem' }}>{f.title}</div>
                  <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes messageSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(37,99,235,0.5); transform: scale(1); }
          50% { box-shadow: 0 8px 48px rgba(139,92,246,0.6); transform: scale(1.04); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
