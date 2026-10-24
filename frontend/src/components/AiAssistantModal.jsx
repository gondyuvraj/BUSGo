import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';

export default function AiAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Namaste! I am BusGo AI Travel Assistant. Ask me anything about luxury bus routes, discount promo codes, luggage rules, or cancellation policies!',
    },
  ]);

  const quickPrompts = [
    'Discount coupon code?',
    'What is the cancellation policy?',
    'Luggage allowance rules?',
    'Sleeper vs Seater recommendation?',
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.chatAi(query);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '💡 Use promo code **BUSGO100** at checkout for flat ₹100 discount! All luxury sleeper buses come equipped with clean blankets and mineral water.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(37,99,235,0.45)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="animate-float"
        title="BusGo AI Travel Assistant"
      >
        {isOpen ? <X size={26} /> : <Bot size={28} />}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '95px',
          right: '24px',
          zIndex: 999,
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '520px',
          background: '#0B132B',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalScaleUp 0.25s ease-out',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1C2541 0%, #0B132B 100%)',
            padding: '1.15rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  BusGo AI Assistant
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ● Online & Ready to Help
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            padding: '0.65rem 0.85rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(qp)}
                style={{
                  background: 'rgba(37,99,235,0.2)',
                  border: '1px solid rgba(96,165,250,0.3)',
                  color: '#93C5FD',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  lineHeight: '1.45',
                  background: m.sender === 'user'
                    ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                    : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'pre-line',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.8rem' }}>
                <Loader2 size={16} className="animate-spin" /> Thinking...
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            style={{
              padding: '0.85rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: '8px',
              background: '#070B19',
            }}
          >
            <input
              type="text"
              placeholder="Ask about buses, routes, discounts..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              style={{
                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: loading || !inputMessage.trim() ? 0.6 : 1,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
