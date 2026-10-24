import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle,
  ChevronDown, ChevronUp, Bot, User, Loader2, Clock,
  Headphones, Zap, Shield, Star, X, LifeBuoy
} from 'lucide-react';

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How do I cancel my booking and get a refund?',
    a: 'Go to "My Bookings", find your ticket, and click "Cancel Ticket". Refunds are processed at 90% of the fare if cancelled more than 12 hours before departure, and 50% if cancelled between 6–12 hours. Refunds reach your original payment method within 2–4 business hours.',
  },
  {
    q: 'Can I change my seat after booking?',
    a: 'Seat changes are not directly supported once a booking is confirmed. You can cancel your current booking and rebook with your preferred seat — as long as it is still available.',
  },
  {
    q: 'What documents do I need to board?',
    a: 'Just show your digital BusGo M-Ticket (from the app or email) along with any valid government-issued photo ID — Aadhaar, Passport, Driving License, or Voter ID. No paper printout needed.',
  },
  {
    q: 'Is my payment information safe?',
    a: 'Yes. All payments on BusGo use 256-bit SSL encryption. We do not store your card details. We support UPI, Net Banking, Credit/Debit cards, and digital wallets through PCI-DSS compliant gateways.',
  },
  {
    q: 'What happens if the bus is delayed or cancelled?',
    a: 'If a bus is delayed more than 60 minutes without prior notification, you are eligible for a 100% full refund under the BusGo Guarantee. You will also be notified via SMS and email.',
  },
  {
    q: 'How much luggage can I carry?',
    a: 'Each passenger may carry up to 20 kg in the lower chassis luggage hold and 1 small cabin bag (up to 7 kg) inside the coach. Fragile or oversized items require advance intimation.',
  },
];

// ── Support Categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'booking', label: '🎫 Booking Issue', color: '#2563EB' },
  { id: 'refund', label: '💸 Refund / Cancellation', color: '#10B981' },
  { id: 'delay', label: '⏱️ Bus Delay / No-Show', color: '#F59E0B' },
  { id: 'luggage', label: '🧳 Lost Luggage', color: '#8B5CF6' },
  { id: 'general', label: '💬 General Enquiry', color: '#06B6D4' },
  { id: 'feedback', label: '⭐ Feedback / Suggestion', color: '#EF4444' },
];

// ── AI Chat ───────────────────────────────────────────────────────────────────
function AiSupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm BusGo AI Support 🤖. Ask me anything — cancellations, luggage, discounts, seat types, or boarding info.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await api.chatAi(text);
      setMessages((prev) => [...prev, { role: 'bot', text: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "Sorry, I couldn't reach the server right now. Please try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(37,99,235,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'transform 0.2s',
        }}
        title="AI Support Chat"
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Chat Bubble Badge */}
      {!open && (
        <div style={{
          position: 'fixed',
          bottom: '82px',
          right: '28px',
          background: '#0F172A',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '9999px',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
        }}>
          AI Support 24/7
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '28px',
          width: '360px',
          maxHeight: '520px',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -10px rgba(15,23,42,0.35)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0B132B 0%, #1D4ED8 100%)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>BusGo AI Assistant</div>
              <div style={{ color: '#93C5FD', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                Online · Instant replies
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            background: '#F8FAFC',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px',
              }}>
                {msg.role === 'bot' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Bot size={14} color="#fff" />
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                    : '#ffffff',
                  color: msg.role === 'user' ? '#fff' : '#1E293B',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: msg.role === 'bot' ? '1px solid #E2E8F0' : 'none',
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#FF6B35',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <User size={14} color="#fff" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={14} color="#fff" />
                </div>
                <div style={{
                  padding: '0.65rem 0.9rem', borderRadius: '16px 16px 16px 4px',
                  background: '#fff', border: '1px solid #E2E8F0',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: '#94A3B8',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '0.5rem 0.85rem',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            background: '#fff',
          }}>
            {['Cancellation policy', 'Promo code', 'Luggage limit'].map((p) => (
              <button
                key={p}
                onClick={() => { setInput(p); }}
                style={{
                  padding: '4px 10px', borderRadius: '9999px',
                  background: '#EFF6FF', border: '1px solid #BFDBFE',
                  color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '8px',
            background: '#fff',
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about your journey..."
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                border: '1.5px solid #E2E8F0',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: input.trim() ? '#2563EB' : '#E2E8F0',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: input.trim() ? '#fff' : '#94A3B8', flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            border: `1.5px solid ${openIdx === i ? '#BFDBFE' : '#E2E8F0'}`,
            borderRadius: '14px',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}
        >
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.1rem 1.25rem',
              background: openIdx === i ? '#EFF6FF' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              gap: '1rem',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>{item.q}</span>
            {openIdx === i
              ? <ChevronUp size={18} color="#2563EB" style={{ flexShrink: 0 }} />
              : <ChevronDown size={18} color="#64748B" style={{ flexShrink: 0 }} />
            }
          </button>
          {openIdx === i && (
            <div style={{
              padding: '0 1.25rem 1.1rem',
              color: '#475569',
              fontSize: '0.88rem',
              lineHeight: '1.7',
              borderTop: '1px solid #EFF6FF',
            }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactUsPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '', email: '', category: 'general', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const maxChars = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate async submit (no backend endpoint yet)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
    showToast("Your message has been received! We'll respond within 2 hours.", 'success');
  };

  return (
    <div style={{ flex: 1, background: '#F8FAFC', paddingBottom: '6rem' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #070B19 0%, #0B132B 60%, #1D4ED8 100%)',
        color: '#fff',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(37,99,235,0.12)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'rgba(255,107,53,0.08)', pointerEvents: 'none',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(96,165,250,0.3)',
            padding: '0.4rem 1.15rem', borderRadius: '9999px',
            fontSize: '0.82rem', fontWeight: 700, color: '#93C5FD',
            marginBottom: '1.25rem',
          }}>
            <Headphones size={14} /> 24/7 Support Center
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
            We're Here to <span style={{ color: '#FF6B35' }}>Help You</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            Reach our support team via the form below, live AI chat, or any of our direct contact channels.
          </p>

          {/* Support Stats Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { icon: <Zap size={18} />, label: '< 2 hr', sub: 'Avg. Response' },
              { icon: <Star size={18} />, label: '4.9 / 5', sub: 'Support Rating' },
              { icon: <Shield size={18} />, label: '100%', sub: 'Satisfaction' },
              { icon: <Clock size={18} />, label: '24 / 7', sub: 'Availability' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: '#60A5FA', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact Cards Row ── */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3.5rem',
        }}>
          {[
            {
              icon: <Phone size={22} color="#fff" />,
              bg: '#2563EB',
              title: 'Toll-Free Helpline',
              info: '1800-BUS-GO-24',
              sub: 'Available 24 hours, 7 days',
            },
            {
              icon: <Mail size={22} color="#fff" />,
              bg: '#FF6B35',
              title: 'Email Support',
              info: 'support@busgo.travel',
              sub: 'Reply within 2 hours',
            },
            {
              icon: <MessageCircle size={22} color="#fff" />,
              bg: '#10B981',
              title: 'Live AI Chat',
              info: 'Instant AI Replies',
              sub: 'Click the chat button →',
            },
            {
              icon: <MapPin size={22} color="#fff" />,
              bg: '#8B5CF6',
              title: 'Head Office',
              info: 'Cyber Hub, Pune',
              sub: 'Maharashtra 411041, India',
            },
          ].map((card, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(15,23,42,0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.07)';
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: card.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 12px ${card.bg}55`,
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '3px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{card.info}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>{card.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}>

          {/* LEFT: Contact Form */}
          <div style={{
            background: '#fff',
            border: '1.5px solid #E2E8F0',
            borderRadius: '24px',
            padding: '2.25rem',
            boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Send size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Send an Enquiry</h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>We respond within 2 hours</p>
              </div>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: '#DCFCE7', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <CheckCircle2 size={36} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem' }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
                  Our support team has received your message and will get back to you within 2 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', category: 'general', subject: '', message: '' }); }}
                  className="btn-outline"
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                {/* Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text" required placeholder="Yuvraj Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%', padding: '0.7rem 0.85rem',
                        border: '1.5px solid #E2E8F0', borderRadius: '10px',
                        fontSize: '0.9rem', boxSizing: 'border-box',
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email" required placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%', padding: '0.7rem 0.85rem',
                        border: '1.5px solid #E2E8F0', borderRadius: '10px',
                        fontSize: '0.9rem', boxSizing: 'border-box',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                    Issue Category *
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        style={{
                          padding: '6px 12px', borderRadius: '9999px',
                          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                          border: `1.5px solid ${formData.category === cat.id ? cat.color : '#E2E8F0'}`,
                          background: formData.category === cat.id ? cat.color + '18' : '#F8FAFC',
                          color: formData.category === cat.id ? cat.color : '#64748B',
                          transition: 'all 0.15s',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                    Subject *
                  </label>
                  <input
                    type="text" required placeholder="e.g. Refund not received for booking BG-123456"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%', padding: '0.7rem 0.85rem',
                      border: '1.5px solid #E2E8F0', borderRadius: '10px',
                      fontSize: '0.9rem', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>

                {/* Message + character counter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                      Your Message *
                    </label>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      color: formData.message.length > maxChars * 0.85 ? '#EF4444' : '#94A3B8',
                    }}>
                      {formData.message.length} / {maxChars}
                    </span>
                  </div>
                  <textarea
                    rows={4} required
                    placeholder="Describe your issue in detail. Include your booking reference (e.g. BG-123456) if relevant..."
                    value={formData.message}
                    maxLength={maxChars}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%', padding: '0.7rem 0.85rem',
                      border: '1.5px solid #E2E8F0', borderRadius: '10px',
                      fontSize: '0.9rem', boxSizing: 'border-box',
                      resize: 'vertical', lineHeight: '1.55',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                  {/* Character progress bar */}
                  <div style={{ height: '3px', background: '#F1F5F9', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(formData.message.length / maxChars) * 100}%`,
                      background: formData.message.length > maxChars * 0.85 ? '#EF4444' : '#2563EB',
                      transition: 'width 0.2s',
                      borderRadius: '2px',
                    }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent"
                  style={{ padding: '0.85rem', fontSize: '0.95rem', borderRadius: '12px', marginTop: '0.25rem' }}
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    : <><Send size={17} /> Submit Support Request</>
                  }
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: FAQ + Map + Office Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Office Hours Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0B132B 0%, #1E3A5F 100%)',
              borderRadius: '20px',
              padding: '1.75rem',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <Clock size={20} color="#60A5FA" />
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>Support Hours</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { day: 'Phone & AI Chat', hours: '24 / 7', active: true },
                  { day: 'Email Support', hours: '6:00 AM – 11:00 PM', active: true },
                  { day: 'Office Walk-in', hours: 'Mon–Sat, 9 AM – 6 PM', active: false },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.65rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>{row.day}</span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 700,
                      color: row.active ? '#34D399' : '#FBBF24',
                      background: row.active ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                      padding: '3px 10px', borderRadius: '9999px',
                    }}>
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Embed */}
            <div style={{
              background: '#fff',
              border: '1.5px solid #E2E8F0',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(15,23,42,0.07)',
            }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#8B5CF6" />
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>BusGo Head Office</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Cyber Hub, Pune, Maharashtra</div>
                </div>
              </div>
              <iframe
                title="BusGo Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2475!2d73.9197!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07f4f8c0001%3A0x0!2sPune%2C+Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="220"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* FAQ */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <LifeBuoy size={20} color="#2563EB" />
                <h3 style={{ margin: 0, fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                  Frequently Asked Questions
                </h3>
              </div>
              <FaqAccordion />
            </div>

          </div>
        </div>
      </div>

      {/* ── Social & Trust Footer Strip ── */}
      <div style={{ background: '#0B132B', marginTop: '5rem', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>
              Still need help?
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
              Use the AI chat (bottom-right) for instant answers anytime.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Grievance Portal'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600,
                  padding: '0.4rem 0.85rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '9999px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = '#94A3B8'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating AI Chat ── */}
      <AiSupportChat />

      {/* Bounce animation for chat loading dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
