import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X, Lock, ShieldCheck, Loader2, AlertCircle,
  ChevronRight, ChevronDown, ChevronUp,
  CheckCircle2, Clock, MapPin, Navigation,
  CreditCard, Building2, Wallet, Smartphone, Copy
} from 'lucide-react';

// ── UPI Apps with SVG Icons ───────────────────────────────────────────────────
const UPI_APPS = [
  {
    id: 'gpay', name: 'Google Pay', handle: '@okicici',
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36">
        <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
    color: '#4285F4', bg: '#EFF6FF',
  },
  {
    id: 'phonepe', name: 'PhonePe', handle: '@ybl',
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36">
        <circle cx="24" cy="24" r="24" fill="#5F259F"/>
        <path fill="#fff" d="M33.5 14.5h-4.2l-8.8 8.8v-8.8H16v19h4.5v-7.2l2.1-2.1 6.5 9.3h5.2l-8.8-12.5z"/>
      </svg>
    ),
    color: '#5F259F', bg: '#F5F3FF',
  },
  {
    id: 'paytm', name: 'Paytm', handle: '@paytm',
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36">
        <rect width="48" height="48" rx="8" fill="#00BAF2"/>
        <path fill="#fff" d="M8 24h14v14H8zM26 10h14v14H26z"/>
        <path fill="#00BAF2" d="M11 27h8v8h-8zM29 13h8v8h-8z"/>
      </svg>
    ),
    color: '#00BAF2', bg: '#ECFEFF',
  },
  {
    id: 'bhim', name: 'BHIM UPI', handle: '@upi',
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36">
        <circle cx="24" cy="24" r="24" fill="#0052A4"/>
        <path fill="#FF9933" d="M24 8l4 12H36l-10 7 4 12-10-7-10 7 4-12L4 20h8z"/>
        <path fill="#fff" d="M24 14l2.5 7.5H34l-6.3 4.5 2.5 7.5L24 29l-6.3 4.5 2.5-7.5L14 21.5h7.5z"/>
      </svg>
    ),
    color: '#0052A4', bg: '#EFF6FF',
  },
  {
    id: 'amazonpay', name: 'Amazon Pay', handle: '@apl',
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36">
        <rect width="48" height="48" rx="8" fill="#FF9900"/>
        <path d="M10 20h28v2H10zM14 26c5 4 15 4 20 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="24" cy="15" r="4" fill="#fff"/>
      </svg>
    ),
    color: '#FF9900', bg: '#FFFBEB',
  },
  {
    id: 'mobikwik', name: 'MobiKwik', handle: '@ikwik',
    icon: (
      <svg viewBox="0 0 48 48" width="36" height="36">
        <circle cx="24" cy="24" r="24" fill="#243369"/>
        <path fill="#6DC8F3" d="M12 30l6-12 6 8 6-8 6 12"/>
        <circle cx="24" cy="18" r="3" fill="#fff"/>
      </svg>
    ),
    color: '#243369', bg: '#EFF6FF',
  },
];

const BANKS = [
  { id: 'sbi',   name: 'State Bank of India', shortName: 'SBI',   color: '#1B3A6B', bg: '#EFF6FF' },
  { id: 'hdfc',  name: 'HDFC Bank',           shortName: 'HDFC',  color: '#004C8F', bg: '#EFF6FF' },
  { id: 'icici', name: 'ICICI Bank',           shortName: 'ICICI', color: '#B02A30', bg: '#FEF2F2' },
  { id: 'axis',  name: 'Axis Bank',            shortName: 'Axis',  color: '#97144D', bg: '#FDF2F8' },
  { id: 'kotak', name: 'Kotak Mahindra',       shortName: 'Kotak', color: '#ED1C24', bg: '#FEF2F2' },
  { id: 'pnb',   name: 'Punjab National Bank', shortName: 'PNB',   color: '#C41230', bg: '#FEF2F2' },
  { id: 'bob',   name: 'Bank of Baroda',       shortName: 'BOB',   color: '#F7941D', bg: '#FFFBEB' },
  { id: 'union', name: 'Union Bank',           shortName: 'Union', color: '#004B87', bg: '#EFF6FF' },
];

const WALLETS = [
  { id: 'paytm_w', name: 'Paytm Wallet', color: '#00BAF2', bg: '#ECFEFF' },
  { id: 'airtel',  name: 'Airtel Money', color: '#E40000', bg: '#FEF2F2' },
  { id: 'jio',     name: 'JioMoney',     color: '#0066CC', bg: '#EFF6FF' },
  { id: 'freecharge', name: 'FreeCharge', color: '#5CB85C', bg: '#ECFDF5' },
];

// ── QR Code SVG Generator ─────────────────────────────────────────────────────
function QRCodeDisplay({ amount, upiId }) {
  const [timer, setTimer] = useState(300); // 5 min
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');
  const isExpired = timer === 0;

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId || 'busgo@okaxis').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* QR Box */}
      <div style={{
        position: 'relative',
        background: '#fff',
        border: '2px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 20px rgba(15,23,42,0.1)',
      }}>
        {/* Real QR-like pattern using SVG */}
        <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
          {/* Corner squares */}
          <rect x="10" y="10" width="50" height="50" fill="none" stroke="#0F172A" strokeWidth="5" rx="4"/>
          <rect x="18" y="18" width="34" height="34" fill="#0F172A" rx="2"/>
          <rect x="120" y="10" width="50" height="50" fill="none" stroke="#0F172A" strokeWidth="5" rx="4"/>
          <rect x="128" y="18" width="34" height="34" fill="#0F172A" rx="2"/>
          <rect x="10" y="120" width="50" height="50" fill="none" stroke="#0F172A" strokeWidth="5" rx="4"/>
          <rect x="18" y="128" width="34" height="34" fill="#0F172A" rx="2"/>
          {/* Data dots pattern */}
          {[70,80,90,100,110].map(x =>
            [70,80,90,100,110].map(y =>
              Math.sin(x * y) > 0.2 ? <rect key={`${x}${y}`} x={x} y={y} width="8" height="8" fill="#0F172A" rx="1"/> : null
            )
          )}
          {[10,20,30,40,50,60,70,80].map(x => (
            <rect key={`r1${x}`} x={x} y="70" width="6" height="6" fill={Math.sin(x * 3) > 0 ? "#0F172A" : "transparent"} rx="1"/>
          ))}
          {[10,20,30,40,50,60,70,80].map(y => (
            <rect key={`c1${y}`} x="70" y={y} width="6" height="6" fill={Math.cos(y * 2.5) > 0 ? "#0F172A" : "transparent"} rx="1"/>
          ))}
          {[130,140,150,160].map(x => (
            [70,80,90,100,110,120].map(y => (
              <rect key={`r2${x}${y}`} x={x} y={y} width="6" height="6" fill={Math.sin(x+y) > 0.1 ? "#0F172A" : "transparent"} rx="1"/>
            ))
          ))}
          {[70,80,90,100,110,120].map(x => (
            [130,140,150,160].map(y => (
              <rect key={`c2${x}${y}`} x={x} y={y} width="6" height="6" fill={Math.cos(x*y*0.01) > 0 ? "#0F172A" : "transparent"} rx="1"/>
            ))
          ))}
          {/* Center logo */}
          <rect x="76" y="76" width="28" height="28" fill="#fff" rx="4"/>
          <rect x="78" y="78" width="24" height="24" fill="#2563EB" rx="4"/>
          <text x="90" y="95" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="Arial">B</text>
        </svg>

        {/* Expired overlay */}
        {isExpired && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#EF4444' }}>QR Expired</div>
            <button style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }} onClick={() => setTimer(300)}>
              Refresh QR
            </button>
          </div>
        )}
      </div>

      {/* Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: timer < 60 ? '#FEF2F2' : '#ECFDF5', border: `1px solid ${timer < 60 ? '#FECACA' : '#A7F3D0'}`, borderRadius: '9999px', padding: '4px 14px' }}>
        <Clock size={13} color={timer < 60 ? '#EF4444' : '#10B981'} />
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: timer < 60 ? '#EF4444' : '#10B981' }}>
          {isExpired ? 'Expired' : `Expires in ${mins}:${secs}`}
        </span>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Scan to pay</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>₹{amount}</div>
        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>to BusGo Travel Pvt Ltd</div>
      </div>

      {/* UPI ID */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>UPI ID</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>busgo@okaxis</div>
        </div>
        <button onClick={copyUPI} style={{ marginLeft: 'auto', background: copied ? '#DCFCE7' : '#EFF6FF', border: 'none', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: copied ? '#166534' : '#2563EB' }}>
          <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Supported apps */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {UPI_APPS.slice(0, 4).map(app => (
          <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: app.bg, border: '1px solid #E2E8F0' }}>
              {app.icon}
            </div>
            <span style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600 }}>{app.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CheckoutModal({ bookingData, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();

  // Payment method: 'UPI_QR' | 'UPI_ID' | 'CARD' | 'NETBANKING' | 'WALLET'
  const [paymentMethod, setPaymentMethod] = useState('UPI_QR');

  // UPI
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  // Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardType, setCardType] = useState('DEBIT');
  const [showCvv, setShowCvv] = useState(false);

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('');
  const [showAllBanks, setShowAllBanks] = useState(false);

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');

  // Processing
  const [processing, setProcessing] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { schedule, selectedSeats, totalAmount, journeyDate, passengers,
          contactPhone, contactEmail, selectedBoarding, selectedDropping } = bookingData;

  // Card number formatter
  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  // Expiry formatter
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  // Detect card network
  const getCardNetwork = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MASTERCARD';
    if (num.startsWith('6')) return 'RUPAY';
    if (num.startsWith('3')) return 'AMEX';
    return null;
  };

  const validateAndPay = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      setErrorMessage('Please login to confirm your booking.');
      return;
    }

    // Validate UPI ID
    if (paymentMethod === 'UPI_ID') {
      if (!upiId.includes('@')) {
        setUpiError('Enter a valid UPI ID (e.g. name@okaxis)');
        return;
      }
    }

    // Validate Card
    if (paymentMethod === 'CARD') {
      const num = cardNumber.replace(/\s/g, '');
      if (num.length < 16) { setErrorMessage('Enter a valid 16-digit card number.'); return; }
      if (cardExpiry.length < 5) { setErrorMessage('Enter a valid expiry date (MM/YY).'); return; }
      if (cardCvv.length < 3) { setErrorMessage('Enter a valid CVV.'); return; }
      if (!cardName.trim()) { setErrorMessage('Enter the cardholder name.'); return; }
    }

    if (paymentMethod === 'NETBANKING' && !selectedBank) {
      setErrorMessage('Please select your bank.'); return;
    }
    if (paymentMethod === 'WALLET' && !selectedWallet) {
      setErrorMessage('Please select a wallet.'); return;
    }

    setProcessing(true);

    try {
      setStatusStep('Connecting to secure payment gateway...');
      await new Promise(r => setTimeout(r, 700));
      setStatusStep('Verifying live seat availability...');
      await new Promise(r => setTimeout(r, 800));
      setStatusStep('Generating PNR & confirming reservation...');

      const payload = {
        scheduleId: schedule.scheduleId,
        journeyDate,
        seatNumbers: selectedSeats.map(s => s.seatNumber),
        passengers,
        contactPhone,
        contactEmail,
        paymentMethod: paymentMethod.startsWith('UPI') ? 'UPI' : paymentMethod,
        totalAmount,
      };

      const bookingResponse = await api.createBooking(payload);

      confetti({ particleCount: 130, spread: 75, origin: { y: 0.6 }, colors: ['#2563EB', '#FF6B35', '#06B6D4', '#10B981', '#8B5CF6'] });
      onSuccess(bookingResponse);
    } catch (err) {
      setErrorMessage(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const network = getCardNetwork();

  const METHODS = [
    { id: 'UPI_QR',    icon: <Smartphone size={18} />, label: 'UPI QR',    sub: 'Scan & Pay',    color: '#2563EB' },
    { id: 'UPI_ID',    icon: <Smartphone size={18} />, label: 'UPI ID',    sub: 'Any UPI App',   color: '#2563EB' },
    { id: 'CARD',      icon: <CreditCard size={18} />, label: 'Card',      sub: 'Debit/Credit',  color: '#8B5CF6' },
    { id: 'NETBANKING',icon: <Building2 size={18} />,  label: 'NetBanking', sub: 'All Banks',    color: '#0369A1' },
    { id: 'WALLET',    icon: <Wallet size={18} />,     label: 'Wallets',   sub: 'Paytm & more',  color: '#10B981' },
  ];

  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '1rem', overflowY: 'auto' }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '860px',
        boxShadow: '0 25px 60px rgba(15,23,42,0.25)',
        overflow: 'hidden',
        animation: 'modalScaleUp 0.25s ease-out',
        margin: 'auto',
      }}>
        {/* ── Top Header ── */}
        <div style={{
          background: 'linear-gradient(135deg,#0B132B 0%,#1D4ED8 100%)',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>Secure Checkout</div>
              <div style={{ color: '#93C5FD', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={11} /> 256-bit SSL encrypted · PCI DSS compliant
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#93C5FD', fontSize: '0.72rem' }}>Total Payable</div>
              <div style={{ color: '#FF6B35', fontWeight: 800, fontSize: '1.5rem' }}>₹{totalAmount}</div>
            </div>
            {!processing && (
              <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="#fff" />
              </button>
            )}
          </div>
        </div>

        {processing ? (
          /* ── Processing Screen ── */
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
              <Loader2 size={36} color="#fff" className="animate-spin" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Processing Payment</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', fontWeight: 600, marginBottom: '2rem' }}>{statusStep}</p>

            {/* Progress steps */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Payment Gateway', 'Seat Verification', 'PNR Generation', 'Ticket Dispatch'].map((step, i) => {
                const stepNum = ['Connecting', 'Verifying', 'Generating', 'Dispatching'].findIndex(s => statusStep.toLowerCase().startsWith(s.toLowerCase()));
                const done = i < stepNum;
                const active = i === stepNum;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: done ? '#10B981' : active ? '#2563EB' : '#94A3B8' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: done ? '#DCFCE7' : active ? '#EFF6FF' : '#F1F5F9', border: `2px solid ${done ? '#10B981' : active ? '#2563EB' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>
                      {done ? <CheckCircle2 size={12} color="#10B981" /> : i + 1}
                    </div>
                    {step}
                    {i < 3 && <ChevronRight size={12} color="#CBD5E1" />}
                  </div>
                );
              })}
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.78rem', color: '#94A3B8' }}>Please do not close this window</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '500px' }}>

            {/* ── Left: Payment Method Sidebar ── */}
            <div style={{ background: '#F8FAFC', borderRight: '1px solid #E2E8F0', padding: '1.25rem 0' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 1.25rem', marginBottom: '0.75rem' }}>
                Payment Methods
              </div>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => { setPaymentMethod(m.id); setErrorMessage(''); setUpiError(''); }} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '0.85rem 1.25rem', border: 'none', cursor: 'pointer',
                  background: paymentMethod === m.id ? '#fff' : 'transparent',
                  borderLeft: paymentMethod === m.id ? `3px solid ${m.color}` : '3px solid transparent',
                  borderRight: 'none', borderTop: 'none', borderBottom: 'none',
                  textAlign: 'left', transition: 'all 0.15s',
                  boxShadow: paymentMethod === m.id ? 'inset 0 0 0 0, 2px 0 8px rgba(37,99,235,0.08)' : 'none',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: paymentMethod === m.id ? m.color + '18' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === m.id ? m.color : '#64748B', flexShrink: 0 }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: paymentMethod === m.id ? '#0F172A' : '#475569' }}>{m.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{m.sub}</div>
                  </div>
                  {paymentMethod === m.id && <ChevronRight size={14} color={m.color} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}

              {/* Booking summary in sidebar */}
              <div style={{ margin: '1rem 0.85rem 0', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Journey</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '3px' }}>
                  {schedule.sourceCity} → {schedule.destinationCity}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{journeyDate} · {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}</div>
                {selectedBoarding && (
                  <div style={{ fontSize: '0.68rem', color: '#2563EB', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Navigation size={9} /> {selectedBoarding}
                  </div>
                )}
                {selectedDropping && (
                  <div style={{ fontSize: '0.68rem', color: '#FF6B35', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={9} /> {selectedDropping}
                  </div>
                )}
                <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Total</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#EA580C' }}>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* ── Right: Payment Form ── */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column' }}>

              {errorMessage && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /> {errorMessage}
                </div>
              )}

              <form onSubmit={validateAndPay} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* ══ UPI QR ══ */}
                {paymentMethod === 'UPI_QR' && (
                  <div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '1rem' }}>
                      Scan QR Code to Pay
                    </div>
                    <QRCodeDisplay amount={totalAmount} upiId="busgo@okaxis" />
                    <div style={{ marginTop: '1.25rem', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#1D4ED8' }}>
                      💡 Open any UPI app → Scan QR → Enter amount ₹{totalAmount} → Pay
                    </div>
                  </div>
                )}

                {/* ══ UPI ID ══ */}
                {paymentMethod === 'UPI_ID' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
                      Pay via UPI App
                    </div>

                    {/* UPI App Grid */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>Select UPI App</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                        {UPI_APPS.map(app => (
                          <button key={app.id} type="button" onClick={() => { setSelectedUpiApp(app.id); setUpiId(user?.email?.split('@')[0] + app.handle || app.handle); }} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                            padding: '0.85rem 0.5rem', borderRadius: '14px', cursor: 'pointer',
                            background: selectedUpiApp === app.id ? app.bg : '#F8FAFC',
                            border: `2px solid ${selectedUpiApp === app.id ? app.color : '#E2E8F0'}`,
                            transition: 'all 0.15s',
                          }}
                            onMouseEnter={(e) => { if (selectedUpiApp !== app.id) e.currentTarget.style.borderColor = app.color + '60'; }}
                            onMouseLeave={(e) => { if (selectedUpiApp !== app.id) e.currentTarget.style.borderColor = '#E2E8F0'; }}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                              {app.icon}
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: selectedUpiApp === app.id ? app.color : '#475569' }}>{app.name}</span>
                            {selectedUpiApp === app.id && (
                              <CheckCircle2 size={14} color={app.color} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* UPI ID Input */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                        Your UPI ID / VPA
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="yourname@okaxis"
                          value={upiId}
                          onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                          style={{ width: '100%', padding: '0.75rem 1rem', border: `1.5px solid ${upiError ? '#EF4444' : '#CBD5E1'}`, borderRadius: '10px', fontSize: '0.92rem', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                      {upiError && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>{upiError}</div>}
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                        Example: mobilenumber@paytm · name@okicici · name@ybl
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ CARD ══ */}
                {paymentMethod === 'CARD' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>Debit / Credit Card</div>

                    {/* Card Type */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['DEBIT', 'CREDIT'].map(type => (
                        <button key={type} type="button" onClick={() => setCardType(type)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: `2px solid ${cardType === type ? '#2563EB' : '#E2E8F0'}`, background: cardType === type ? '#EFF6FF' : '#fff', color: cardType === type ? '#1D4ED8' : '#64748B', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                          {type} CARD
                        </button>
                      ))}
                    </div>

                    {/* Card Preview */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
                      borderRadius: '16px', padding: '1.25rem 1.5rem',
                      color: '#fff', minHeight: '120px', position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                      <div style={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', position: 'relative' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93C5FD' }}>BusGo {cardType}</div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                          {network || 'CARD'}
                        </div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '0.85rem', position: 'relative' }}>
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#93C5FD' }}>CARD HOLDER</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{cardName || 'YOUR NAME'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#93C5FD' }}>VALID THRU</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{cardExpiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        maxLength={19}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    {/* Expiry + CVV */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>CVV</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showCvv ? 'text' : 'password'}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                            style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', border: '1.5px solid #CBD5E1', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 600, boxSizing: 'border-box', outline: 'none' }}
                          />
                          <button type="button" onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', right: '10px', top: '13px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700 }}>
                            {showCvv ? 'HIDE' : 'SHOW'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #CBD5E1', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 600, letterSpacing: '0.05em', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    {/* Accepted networks */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Accepted:</span>
                      {['VISA', 'MASTERCARD', 'RUPAY', 'AMEX'].map(n => (
                        <span key={n} style={{ padding: '2px 8px', borderRadius: '4px', background: '#F1F5F9', fontSize: '0.68rem', fontWeight: 800, color: '#475569', border: '1px solid #E2E8F0' }}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ══ NETBANKING ══ */}
                {paymentMethod === 'NETBANKING' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>Net Banking</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                      {(showAllBanks ? BANKS : BANKS.slice(0, 6)).map(bank => (
                        <button key={bank.id} type="button" onClick={() => setSelectedBank(bank.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '0.75rem 0.9rem', borderRadius: '12px', cursor: 'pointer',
                          background: selectedBank === bank.id ? bank.bg : '#F8FAFC',
                          border: `1.5px solid ${selectedBank === bank.id ? bank.color : '#E2E8F0'}`,
                          transition: 'all 0.15s',
                        }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bank.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.68rem', flexShrink: 0 }}>
                            {bank.shortName.slice(0, 3)}
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: selectedBank === bank.id ? 700 : 500, color: selectedBank === bank.id ? bank.color : '#334155', textAlign: 'left' }}>
                            {bank.name}
                          </span>
                          {selectedBank === bank.id && <CheckCircle2 size={14} color={bank.color} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setShowAllBanks(!showAllBanks)} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {showAllBanks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {showAllBanks ? 'Show less' : `+ ${BANKS.length - 6} more banks`}
                    </button>
                  </div>
                )}

                {/* ══ WALLET ══ */}
                {paymentMethod === 'WALLET' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>Mobile Wallets</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {WALLETS.map(wallet => (
                        <button key={wallet.id} type="button" onClick={() => setSelectedWallet(wallet.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '1rem 1.1rem', borderRadius: '14px', cursor: 'pointer',
                          background: selectedWallet === wallet.id ? wallet.bg : '#F8FAFC',
                          border: `1.5px solid ${selectedWallet === wallet.id ? wallet.color : '#E2E8F0'}`,
                          transition: 'all 0.15s',
                        }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: wallet.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                            {wallet.name.slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: selectedWallet === wallet.id ? wallet.color : '#0F172A' }}>{wallet.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Balance: ₹0.00</div>
                          </div>
                          {selectedWallet === wallet.id && <CheckCircle2 size={16} color={wallet.color} style={{ marginLeft: 'auto' }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Trust Badges ── */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', marginTop: 'auto' }}>
                  {[
                    { icon: '🔒', text: '100% Secure' },
                    { icon: '✅', text: 'PCI DSS' },
                    { icon: '↩️', text: '90% Refund' },
                    { icon: '⚡', text: 'Instant Ticket' },
                  ].map(b => (
                    <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 600, color: '#64748B' }}>
                      <span>{b.icon}</span> {b.text}
                    </div>
                  ))}
                </div>

                {/* ── Pay Button ── */}
                {paymentMethod !== 'UPI_QR' && (
                  <button type="submit" style={{
                    width: '100%', padding: '1rem', fontSize: '1rem',
                    fontWeight: 800, borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg,#FF6B35 0%,#EA580C 100%)',
                    color: '#fff', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(255,107,53,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Lock size={18} /> Pay ₹{totalAmount} Securely
                  </button>
                )}

                {paymentMethod === 'UPI_QR' && (
                  <button type="submit" style={{
                    width: '100%', padding: '1rem', fontSize: '1rem',
                    fontWeight: 800, borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg,#10B981 0%,#059669 100%)',
                    color: '#fff', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                    <CheckCircle2 size={18} /> I Have Paid via QR — Confirm Booking
                  </button>
                )}

              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
