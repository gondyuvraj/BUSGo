import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Check, Info, Tag, Disc, AlertCircle,
  MapPin, Navigation, ChevronDown, ChevronUp,
  Wind, Wifi, Zap, Star
} from 'lucide-react';

// ── 3D Sleeper Berth Button ────────────────────────────────────────────────────
function SleeperBerth({ seat, selected, onClick, deck }) {
  const isBooked = seat.isBooked;
  const isLadies = seat.isLadies && !isBooked;

  // Color scheme based on state
  const colors = selected
    ? { bed: '#FF6B35', pillow: '#EA580C', sheet: '#FFF7ED', shadow: 'rgba(255,107,53,0.5)', border: '#EA580C', text: '#fff' }
    : isBooked
    ? { bed: '#94A3B8', pillow: '#64748B', sheet: '#E2E8F0', shadow: 'rgba(100,116,139,0.2)', border: '#CBD5E1', text: '#94A3B8' }
    : isLadies
    ? { bed: '#F9A8D4', pillow: '#EC4899', sheet: '#FDF2F8', shadow: 'rgba(236,72,153,0.25)', border: '#F472B6', text: '#BE185D' }
    : { bed: '#DBEAFE', pillow: '#2563EB', sheet: '#F8FAFC', shadow: 'rgba(37,99,235,0.18)', border: '#93C5FD', text: '#1D4ED8' };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isBooked}
      title={`Seat ${seat.seatNumber} · ${deck} Deck · ₹${Math.round(seat.price)} · ${isBooked ? 'Booked' : isLadies ? 'Ladies Only' : 'Available'}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '68px',
        background: 'none',
        border: 'none',
        padding: '0',
        cursor: isBooked ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
    >
      {/* ── Berth 3D Shell ── */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        border: `2px solid ${colors.border}`,
        background: `linear-gradient(160deg, ${colors.sheet} 0%, ${colors.bed}22 100%)`,
        boxShadow: selected
          ? `0 6px 18px ${colors.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`
          : `0 3px 10px ${colors.shadow}, inset 0 1px 0 rgba(255,255,255,0.6)`,
        transform: selected ? 'scale(1.04)' : isBooked ? 'none' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '5px 7px',
      }}>
        {/* Mattress texture stripes */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 14px,
            ${colors.bed}18 14px,
            ${colors.bed}18 16px
          )`,
          borderRadius: '8px',
          pointerEvents: 'none',
        }} />

        {/* Pillow at head */}
        <div style={{
          width: '28px', height: '16px', borderRadius: '5px',
          background: `linear-gradient(135deg, ${colors.pillow}, ${colors.pillow}cc)`,
          boxShadow: `0 2px 6px ${colors.shadow}`,
          marginLeft: '2px',
          flexShrink: 0,
          position: 'relative', zIndex: 1,
        }}>
          {/* Pillow crease */}
          <div style={{ position: 'absolute', top: '50%', left: '20%', right: '20%', height: '1px', background: 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
        </div>

        {/* Seat number + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: colors.text, letterSpacing: '0.02em' }}>
            {seat.seatNumber}
          </span>
          {selected
            ? <Check size={13} color={colors.text} strokeWidth={3} />
            : isBooked
            ? <span style={{ fontSize: '0.58rem', color: '#94A3B8', fontWeight: 700 }}>TAKEN</span>
            : isLadies
            ? <span style={{ fontSize: '0.8rem' }}>♀</span>
            : <span style={{ fontSize: '0.6rem', color: colors.text, fontWeight: 700 }}>₹{Math.round(seat.price)}</span>
          }
        </div>

        {/* Bottom sheet fold line */}
        <div style={{
          position: 'absolute', bottom: '8px', left: '5px', right: '5px',
          height: '1.5px',
          background: `linear-gradient(90deg, transparent, ${colors.bed}88, transparent)`,
          borderRadius: '1px',
        }} />

        {/* Selected glow overlay */}
        {selected && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25), transparent)',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </button>
  );
}

// ── Realistic Bus Interior Shell ───────────────────────────────────────────────
function BusInterior({ displayedSeats, isSelected, toggleSeat, currentDeck }) {
  const leftSeats   = displayedSeats.filter((_, i) => i % 3 === 0);
  const middleSeats = displayedSeats.filter((_, i) => i % 3 === 1);
  const rightSeats  = displayedSeats.filter((_, i) => i % 3 === 2);

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Outer Bus Shell ── */}
      <div style={{
        background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '24px 24px 18px 18px',
        padding: '0',
        boxShadow: '0 20px 60px rgba(15,23,42,0.5), 0 0 0 2px rgba(255,255,255,0.06)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* ── Roof curve ── */}
        <div style={{
          background: 'linear-gradient(180deg, #334155 0%, #1E293B 100%)',
          height: '14px',
          borderRadius: '24px 24px 0 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }} />

        {/* ── Windshield / Front ── */}
        <div style={{
          background: 'linear-gradient(180deg, #1E3A5F 0%, #0B2545 100%)',
          padding: '1rem 1.25rem',
          borderBottom: '2px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Windshield glass */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, rgba(96,165,250,0.15) 0%, rgba(147,197,253,0.08) 100%)',
            border: '1px solid rgba(96,165,250,0.2)',
            borderRadius: '10px',
            height: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Windshield wiper marks */}
            <div style={{ position: 'absolute', bottom: 0, left: '25%', width: '50%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} />
            {/* Dashboard glow */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(0deg, rgba(251,191,36,0.08), transparent)' }} />
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              🚌 Driver Cabin
            </div>
          </div>

          {/* Steering wheel */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid rgba(100,116,139,0.6)',
            marginLeft: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(51,65,85,0.8), rgba(15,23,42,0.9))',
            flexShrink: 0,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
            position: 'relative',
          }}>
            {/* Steering spokes */}
            <div style={{ position: 'absolute', width: '2px', height: '70%', background: 'rgba(100,116,139,0.5)', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', width: '70%', height: '2px', background: 'rgba(100,116,139,0.5)', borderRadius: '1px' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#334155', border: '1px solid rgba(100,116,139,0.4)', zIndex: 1 }} />
          </div>
        </div>

        {/* ── Overhead luggage rack bar ── */}
        <div style={{
          background: 'linear-gradient(90deg, #1E293B, #334155 20%, #334155 80%, #1E293B)',
          height: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ width: '2px', height: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '1px' }} />
          ))}
        </div>

        {/* ── Side windows strip (decorative) ── */}
        <div style={{
          position: 'absolute', top: '80px', left: '8px', right: '8px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.12) 15%, rgba(96,165,250,0.18) 50%, rgba(96,165,250,0.12) 85%, transparent)',
          borderRadius: '2px',
          pointerEvents: 'none', zIndex: 5,
        }} />

        {/* ── Interior main area ── */}
        <div style={{
          background: 'linear-gradient(180deg, #1A2744 0%, #162035 100%)',
          padding: '0.85rem 1rem',
          position: 'relative',
        }}>

          {/* Deck label */}
          <div style={{
            textAlign: 'center', marginBottom: '0.85rem',
            fontSize: '0.68rem', fontWeight: 800,
            color: 'rgba(148,163,184,0.6)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
            {currentDeck === 'LOWER' ? '🛏️ Lower Deck' : '🏔️ Upper Deck'}
            <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Seat columns: Left 2 + Aisle + Right 1 (2+1 layout) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px 1fr', gap: '8px', alignItems: 'stretch' }}>

            {/* Left column 1 (window side) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {/* Window strip */}
              <div style={{ height: '8px', background: 'linear-gradient(90deg, rgba(96,165,250,0.08), rgba(147,197,253,0.15), rgba(96,165,250,0.08))', borderRadius: '3px', border: '1px solid rgba(96,165,250,0.12)', marginBottom: '2px' }} />
              {leftSeats.map(seat => (
                <SleeperBerth key={seat.seatNumber} seat={seat} selected={isSelected(seat.seatNumber)} onClick={() => toggleSeat(seat)} deck={currentDeck} />
              ))}
            </div>

            {/* Left column 2 (aisle side) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ height: '8px' }} /> {/* spacer to match window strip */}
              {middleSeats.map(seat => (
                <SleeperBerth key={seat.seatNumber} seat={seat} selected={isSelected(seat.seatNumber)} onClick={() => toggleSeat(seat)} deck={currentDeck} />
              ))}
            </div>

            {/* Aisle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', paddingTop: '16px' }}>
              {/* Overhead light strip */}
              <div style={{
                width: '3px', flex: 1,
                background: 'linear-gradient(180deg, rgba(251,191,36,0.4), rgba(251,191,36,0.15), rgba(251,191,36,0.4))',
                borderRadius: '3px',
                boxShadow: '0 0 6px rgba(251,191,36,0.2)',
              }} />
              {/* Aisle floor */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', marginTop: '4px' }} />
            </div>

            {/* Right column (window side, single berths) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ height: '8px', background: 'linear-gradient(90deg, rgba(96,165,250,0.08), rgba(147,197,253,0.15), rgba(96,165,250,0.08))', borderRadius: '3px', border: '1px solid rgba(96,165,250,0.12)', marginBottom: '2px' }} />
              {rightSeats.map(seat => (
                <SleeperBerth key={seat.seatNumber} seat={seat} selected={isSelected(seat.seatNumber)} onClick={() => toggleSeat(seat)} deck={currentDeck} />
              ))}
            </div>
          </div>

          {/* ── Floor / back panel ── */}
          <div style={{
            marginTop: '0.85rem', height: '12px',
            background: 'linear-gradient(90deg, #1E293B, #0F172A 30%, #0F172A 70%, #1E293B)',
            borderRadius: '0 0 8px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '0.55rem', color: 'rgba(100,116,139,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              ← rear emergency exit →
            </div>
          </div>
        </div>

        {/* ── Bottom bumper ── */}
        <div style={{ height: '10px', background: 'linear-gradient(180deg, #1E293B, #0F172A)', borderRadius: '0 0 18px 18px' }} />
      </div>

      {/* ── Amenities bar below bus ── */}
      <div style={{
        marginTop: '0.85rem',
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        borderRadius: '12px',
        padding: '0.65rem 1rem',
        display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { icon: <Wifi size={12} color="#60A5FA" />, label: 'WiFi', val: 'Free' },
          { icon: <Zap size={12} color="#FBBF24" />, label: 'USB', val: 'Each Berth' },
          { icon: <Wind size={12} color="#34D399" />, label: 'AC', val: 'Chilled' },
          { icon: <Star size={12} color="#F472B6" />, label: 'Ladies', val: 'Reserved' },
        ].map(a => (
          <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {a.icon}
            <span style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,0.8)', fontWeight: 600 }}>{a.label}:</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{a.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main SeatMap Component ─────────────────────────────────────────────────────
export default function SeatMap({ scheduleId, journeyDate, baseFare, _busInfo, boardingPoints = [], droppingPoints = [], onProceed }) {
  const [seats,         setSeats]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentDeck,   setCurrentDeck]   = useState('LOWER');
  const [couponCode,    setCouponCode]    = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [errorMsg,      setErrorMsg]      = useState(null);
  const [selectedBoarding, setSelectedBoarding] = useState(boardingPoints[0] || '');
  const [selectedDropping, setSelectedDropping] = useState(droppingPoints[0] || '');
  const [showBoardingList, setShowBoardingList] = useState(false);
  const [showDroppingList, setShowDroppingList] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getSeats(scheduleId, journeyDate)
      .then(data => { if (mounted) { setSeats(data || []); setLoading(false); } })
      .catch(() => { if (mounted) { setErrorMsg('Failed to load seat layout. Refresh to retry.'); setLoading(false); } });
    return () => { mounted = false; };
  }, [scheduleId, journeyDate]);

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.some(s => s.seatNumber === seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 6) { alert('Max 6 seats per booking.'); return; }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSelected   = (num)  => selectedSeats.some(s => s.seatNumber === num);
  const displaySeats = seats.filter(s => s.deck === currentDeck);

  const rawSubtotal = selectedSeats.reduce((sum, s) => sum + (s.price || baseFare), 0);
  const discount    = couponApplied ? Math.min(100, rawSubtotal > 100 ? 100 : 0) : 0;
  const taxable     = Math.max(0, rawSubtotal - discount);
  const gst         = Math.round(taxable * 0.05 * 100) / 100;
  const finalTotal  = Math.round((taxable + gst) * 100) / 100;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BUSGO100') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon. Try BUSGO100 for ₹100 OFF!');
    }
  };

  const handleProceed = () => {
    if (!selectedBoarding) { alert('Please select a boarding point.'); return; }
    if (!selectedDropping) { alert('Please select a dropping point.'); return; }
    onProceed({ selectedSeats, totalAmount: finalTotal, rawSubtotal, gstAmount: gst, discountAmount: discount, selectedBoarding, selectedDropping });
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg,#0F172A,#1E293B)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Disc size={32} color="#2563EB" className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
      <p style={{ color: '#94A3B8', fontWeight: 600, margin: 0 }}>Loading live seat map...</p>
    </div>
  );

  if (errorMsg) return (
    <div style={{ padding: '2rem', textAlign: 'center', background: '#FEF2F2', borderTop: '1px solid #FECACA' }}>
      <AlertCircle size={28} color="#EF4444" style={{ margin: '0 auto 0.5rem' }} />
      <p style={{ color: '#B91C1C', fontWeight: 600, margin: 0 }}>{errorMsg}</p>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg,#0B132B,#1A2744)', padding: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1.1fr) minmax(260px,1fr)', gap: '1.75rem', alignItems: 'start' }}>

        {/* ── LEFT: 3D Bus Interior ── */}
        <div>
          {/* Deck Tabs — styled to match dark theme */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '12px', marginBottom: '1.1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['LOWER', 'UPPER'].map(deck => (
              <button key={deck} type="button" onClick={() => setCurrentDeck(deck)} style={{
                flex: 1, padding: '8px 12px', borderRadius: '9px', fontWeight: 700, fontSize: '0.82rem',
                background: currentDeck === deck ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : 'transparent',
                color: currentDeck === deck ? '#fff' : 'rgba(148,163,184,0.7)',
                boxShadow: currentDeck === deck ? '0 4px 12px rgba(37,99,235,0.4)' : 'none',
                transition: 'all 0.2s', cursor: 'pointer', border: 'none',
              }}>
                {deck === 'LOWER' ? '🛏️ Lower Deck' : '🏔️ Upper Deck'}
              </button>
            ))}
          </div>

          {/* Deck tip */}
          <div style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '9px', padding: '0.5rem 0.85rem', marginBottom: '1rem', fontSize: '0.72rem', color: '#93C5FD', fontWeight: 600 }}>
            {currentDeck === 'LOWER'
              ? '💡 Lower deck: Smoother ride · Easy exit · Ladies seats available'
              : '💡 Upper deck: More privacy · Quieter · Best for undisturbed sleep'}
          </div>

          {/* 3D Bus Interior */}
          <BusInterior displayedSeats={displaySeats} isSelected={isSelected} toggleSeat={toggleSeat} currentDeck={currentDeck} />

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', marginTop: '1rem', fontSize: '0.72rem', fontWeight: 700 }}>
            {[
              { color: 'linear-gradient(135deg,#DBEAFE,#93C5FD33)', border: '#93C5FD', label: 'Available', text: '#60A5FA' },
              { color: 'linear-gradient(135deg,#FF6B35,#EA580C)', border: '#FF6B35', label: 'Your Pick', text: '#fff' },
              { color: 'linear-gradient(135deg,#475569,#334155)', border: '#475569', label: 'Taken', text: '#94A3B8' },
              { color: 'linear-gradient(135deg,#F9A8D4,#F472B6)', border: '#F472B6', label: '♀ Ladies', text: '#BE185D' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: l.text }}>
                <div style={{ width: '18px', height: '12px', borderRadius: '3px', background: l.color, border: `1.5px solid ${l.border}` }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Summary Panel ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>

          {/* Boarding Point */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Navigation size={11} color="#60A5FA" /> Boarding Point *
            </div>
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => { setShowBoardingList(!showBoardingList); setShowDroppingList(false); }} style={{ width: '100%', padding: '0.6rem 0.85rem', border: `1.5px solid ${showBoardingList ? '#2563EB' : 'rgba(255,255,255,0.12)'}`, borderRadius: '10px', background: selectedBoarding ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 600, color: selectedBoarding ? '#93C5FD' : 'rgba(148,163,184,0.6)', transition: 'all 0.15s' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={13} color={selectedBoarding ? '#60A5FA' : 'rgba(148,163,184,0.5)'} />
                  {selectedBoarding || 'Select boarding stop'}
                </span>
                {showBoardingList ? <ChevronUp size={13} color="#60A5FA" /> : <ChevronDown size={13} color="rgba(148,163,184,0.5)" />}
              </button>
              {showBoardingList && (
                <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, background: '#1E293B', border: '1.5px solid rgba(37,99,235,0.3)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 50, overflow: 'hidden' }}>
                  {boardingPoints.map((pt, i) => (
                    <button key={i} type="button" onClick={() => { setSelectedBoarding(pt); setShowBoardingList(false); }} style={{ width: '100%', padding: '0.6rem 0.9rem', border: 'none', background: selectedBoarding === pt ? 'rgba(37,99,235,0.2)' : 'transparent', color: selectedBoarding === pt ? '#93C5FD' : '#CBD5E1', fontWeight: selectedBoarding === pt ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', borderBottom: i < boardingPoints.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(37,99,235,0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = selectedBoarding === pt ? 'rgba(37,99,235,0.2)' : 'transparent'}
                    >
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: selectedBoarding === pt ? '#2563EB' : 'rgba(100,116,139,0.5)', flexShrink: 0 }} />
                      {pt}
                      {i === 0 && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>Recommended</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dropping Point */}
          <div style={{ marginBottom: '1.1rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FCA5A5', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={11} color="#F87171" /> Dropping Point *
            </div>
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => { setShowDroppingList(!showDroppingList); setShowBoardingList(false); }} style={{ width: '100%', padding: '0.6rem 0.85rem', border: `1.5px solid ${showDroppingList ? '#FF6B35' : 'rgba(255,255,255,0.12)'}`, borderRadius: '10px', background: selectedDropping ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 600, color: selectedDropping ? '#FCA5A5' : 'rgba(148,163,184,0.6)', transition: 'all 0.15s' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} color={selectedDropping ? '#F87171' : 'rgba(148,163,184,0.5)'} />
                  {selectedDropping || 'Select drop stop'}
                </span>
                {showDroppingList ? <ChevronUp size={13} color="#F87171" /> : <ChevronDown size={13} color="rgba(148,163,184,0.5)" />}
              </button>
              {showDroppingList && (
                <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, background: '#1E293B', border: '1.5px solid rgba(255,107,53,0.3)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 50, overflow: 'hidden' }}>
                  {droppingPoints.map((pt, i) => (
                    <button key={i} type="button" onClick={() => { setSelectedDropping(pt); setShowDroppingList(false); }} style={{ width: '100%', padding: '0.6rem 0.9rem', border: 'none', background: selectedDropping === pt ? 'rgba(255,107,53,0.15)' : 'transparent', color: selectedDropping === pt ? '#FCA5A5' : '#CBD5E1', fontWeight: selectedDropping === pt ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left', borderBottom: i < droppingPoints.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,53,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = selectedDropping === pt ? 'rgba(255,107,53,0.15)' : 'transparent'}
                    >
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: selectedDropping === pt ? '#FF6B35' : 'rgba(100,116,139,0.5)', flexShrink: 0 }} />
                      {pt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '1rem' }} />

          {/* Booking Summary */}
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '0.85rem' }}>📋 Booking Summary</h4>

          {selectedSeats.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <Info size={24} color="rgba(148,163,184,0.6)" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', margin: 0 }}>No berths selected yet</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', marginTop: '4px' }}>Tap a berth on the bus to select it</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Selected ({selectedSeats.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {selectedSeats.map(s => (
                    <span key={s.seatNumber} style={{ background: 'rgba(255,107,53,0.2)', color: '#FCA5A5', border: '1px solid rgba(255,107,53,0.3)', padding: '3px 9px', borderRadius: '7px', fontWeight: 700, fontSize: '0.78rem' }}>
                      {s.seatNumber} · ₹{Math.round(s.price)}
                    </span>
                  ))}
                </div>
              </div>

              {(selectedBoarding || selectedDropping) && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', padding: '0.65rem', marginBottom: '0.85rem' }}>
                  {selectedBoarding && <div style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 600, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}><Navigation size={10} color="#60A5FA" />Board: <strong>{selectedBoarding}</strong></div>}
                  {selectedDropping && <div style={{ fontSize: '0.72rem', color: '#FCA5A5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={10} color="#F87171" />Drop: <strong>{selectedDropping}</strong></div>}
                </div>
              )}

              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem' }}>
                <input type="text" placeholder="Promo code (BUSGO100)" value={couponCode} onChange={e => setCouponCode(e.target.value)} disabled={couponApplied} style={{ flex: 1, padding: '0.5rem 0.7rem', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', color: '#F1F5F9', outline: 'none' }} />
                <button type="submit" disabled={couponApplied} style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: couponApplied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)', color: couponApplied ? '#34D399' : '#CBD5E1', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {couponApplied ? '✓ Applied' : 'Apply'}
                </button>
              </form>

              {couponApplied && (
                <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34D399', padding: '0.4rem 0.65rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={11} /> ₹100 BUSGO100 applied!
                </div>
              )}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Base Fare × {selectedSeats.length}</span>
                  <span style={{ fontWeight: 600, color: '#F1F5F9' }}>₹{rawSubtotal}</span>
                </div>
                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399' }}>
                    <span>Discount (BUSGO100)</span>
                    <span style={{ fontWeight: 700 }}>-₹{discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>GST + Insurance (5%)</span>
                  <span style={{ fontWeight: 600, color: '#F1F5F9' }}>₹{gst}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.65rem', marginTop: '0.25rem' }}>
                  <span style={{ fontWeight: 800, color: '#F1F5F9', fontSize: '0.95rem' }}>Total</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B35' }}>₹{finalTotal}</span>
                </div>
              </div>

              <button type="button" onClick={handleProceed} style={{
                width: '100%', marginTop: '1rem', padding: '0.9rem',
                fontSize: '0.95rem', fontWeight: 800, borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg,#FF6B35,#EA580C)',
                color: '#fff', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,107,53,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Continue to Passenger Details →
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.62rem', color: 'rgba(148,163,184,0.5)', marginTop: '6px' }}>
                🔒 Secure · Free cancel up to 12h before departure
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
