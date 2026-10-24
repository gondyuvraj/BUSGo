import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Bus, MapPin, Navigation, Clock, CheckCircle2,
  AlertCircle, RefreshCw, Phone, Share2, ArrowLeft,
  Zap, Shield, Users, Wifi, Battery,
  ChevronRight, Star, Radio
} from 'lucide-react';

// ── Route coordinates for Indian cities (relative SVG positions) ──────────────
const CITY_COORDS = {
  'Mumbai':    { x: 120, y: 310 },
  'Pune':      { x: 145, y: 340 },
  'Nashik':    { x: 130, y: 275 },
  'Nagpur':    { x: 280, y: 260 },
  'Bangalore': { x: 200, y: 420 },
  'Hyderabad': { x: 240, y: 340 },
  'Chennai':   { x: 270, y: 430 },
  'Delhi':     { x: 210, y: 130 },
  'Jaipur':    { x: 175, y: 165 },
  'Ahmedabad': { x: 110, y: 230 },
  'Goa':       { x: 135, y: 380 },
  'Kolkata':   { x: 390, y: 250 },
  'Indore':    { x: 185, y: 240 },
  'Surat':     { x: 115, y: 280 },
  'Bhopal':    { x: 210, y: 215 },
};

function getCoords(city) {
  const normalized = Object.keys(CITY_COORDS).find(
    k => k.toLowerCase() === city?.toLowerCase()
  );
  return normalized ? CITY_COORDS[normalized] : { x: 200, y: 280 };
}

// ── Animated India Map SVG ────────────────────────────────────────────────────
function TrackingMap({ sourceCity, destinationCity, progress }) {
  const src = getCoords(sourceCity);
  const dst = getCoords(destinationCity);

  // Bus current position interpolated
  const busX = src.x + (dst.x - src.x) * (progress / 100);
  const busY = src.y + (dst.y - src.y) * (progress / 100);

  return (
    <div style={{ position: 'relative', width: '100%', background: 'linear-gradient(160deg,#0B132B 0%,#1E3A5F 100%)', borderRadius: '20px', overflow: 'hidden', minHeight: '380px' }}>

      {/* Map Background Grid */}
      <svg viewBox="0 0 500 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <React.Fragment key={i}>
            <line x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="#2563EB" strokeWidth="0.5" />
            <line x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="#2563EB" strokeWidth="0.5" />
          </React.Fragment>
        ))}
      </svg>

      {/* Main Tracking SVG */}
      <svg viewBox="0 0 500 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

        {/* India outline simplified */}
        <path
          d="M 140 80 L 200 70 L 260 85 L 320 100 L 380 130 L 420 180 L 430 240 L 400 300 L 360 350 L 320 400 L 280 440 L 240 460 L 200 450 L 160 430 L 130 390 L 110 350 L 90 300 L 80 240 L 90 180 L 110 130 Z"
          fill="rgba(37,99,235,0.08)"
          stroke="rgba(37,99,235,0.3)"
          strokeWidth="1.5"
        />

        {/* All city dots */}
        {Object.entries(CITY_COORDS).map(([city, pos]) => (
          <g key={city}>
            <circle cx={pos.x} cy={pos.y} r="4" fill="rgba(148,163,184,0.5)" />
            <text x={pos.x + 6} y={pos.y + 4} fill="rgba(148,163,184,0.7)" fontSize="8" fontFamily="sans-serif">{city}</text>
          </g>
        ))}

        {/* Route path — dashed background */}
        <line
          x1={src.x} y1={src.y}
          x2={dst.x} y2={dst.y}
          stroke="rgba(37,99,235,0.3)"
          strokeWidth="3"
          strokeDasharray="6 4"
        />

        {/* Completed route — solid blue */}
        <line
          x1={src.x} y1={src.y}
          x2={busX} y2={busY}
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Remaining route */}
        <line
          x1={busX} y1={busY}
          x2={dst.x} y2={dst.y}
          stroke="rgba(148,163,184,0.4)"
          strokeWidth="3"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* Source marker */}
        <circle cx={src.x} cy={src.y} r="10" fill="#10B981" opacity="0.9" />
        <circle cx={src.x} cy={src.y} r="5" fill="#fff" />
        <text x={src.x} y={src.y - 15} fill="#34D399" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">{sourceCity}</text>

        {/* Destination marker */}
        <circle cx={dst.x} cy={dst.y} r="10" fill="#EF4444" opacity="0.9" />
        <circle cx={dst.x} cy={dst.y} r="5" fill="#fff" />
        {/* Pulse ring on destination */}
        <circle cx={dst.x} cy={dst.y} r="16" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={dst.x} y={dst.y - 15} fill="#FCA5A5" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">{destinationCity}</text>

        {/* Bus marker — animated */}
        <g transform={`translate(${busX}, ${busY})`}>
          {/* Outer glow pulse */}
          <circle r="18" fill="rgba(255,107,53,0.2)">
            <animate attributeName="r" values="14;22;14" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Inner circle */}
          <circle r="14" fill="#FF6B35" opacity="0.9" />
          <circle r="10" fill="#fff" />
          {/* Bus icon simplified */}
          <rect x="-6" y="-5" width="12" height="8" rx="2" fill="#FF6B35" />
          <rect x="-4" y="-3" width="3" height="3" rx="0.5" fill="#fff" opacity="0.8" />
          <rect x="1" y="-3" width="3" height="3" rx="0.5" fill="#fff" opacity="0.8" />
          <rect x="-5" y="3" width="3" height="2" rx="1" fill="#334155" />
          <rect x="2" y="3" width="3" height="2" rx="1" fill="#334155" />
          {/* Speed lines */}
          <line x1="-14" y1="-2" x2="-10" y2="-2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-16" y1="1" x2="-11" y2="1" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>

      {/* Live badge */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.9)', borderRadius: '9999px', padding: '4px 12px', backdropFilter: 'blur(8px)' }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', animation: 'liveBlip 1s infinite' }} />
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}>LIVE</span>
      </div>

      {/* Speed badge */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', borderRadius: '9999px', padding: '4px 12px', backdropFilter: 'blur(8px)' }}>
        <span style={{ color: '#FF6B35', fontWeight: 800, fontSize: '0.78rem' }}>⚡ 68 km/h</span>
      </div>

      {/* Progress bar at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '0.75rem 1rem', backdropFilter: 'blur(4px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ color: '#34D399', fontWeight: 700, fontSize: '0.78rem' }}>{sourceCity}</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem' }}>{Math.round(progress)}% completed</span>
          <span style={{ color: '#FCA5A5', fontWeight: 700, fontSize: '0.78rem' }}>{destinationCity}</span>
        </div>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg,#10B981,#2563EB)',
            borderRadius: '3px', transition: 'width 1s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Journey Timeline ──────────────────────────────────────────────────────────
function JourneyTimeline({ stops, progress }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stops.map((stop, i) => {
        const isPast  = stop.progressAt <= progress;
        const isCurrent = !isPast && (i === 0 || stops[i - 1].progressAt <= progress);
        const isNext = i > 0 && !isPast && stops[i - 1].progressAt <= progress;
        return (
          <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
            {/* Connector line */}
            {i < stops.length - 1 && (
              <div style={{ position: 'absolute', left: '11px', top: '26px', bottom: '-10px', width: '2px', background: isPast ? '#10B981' : '#E2E8F0', zIndex: 0 }} />
            )}
            {/* Dot */}
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: isPast ? '#10B981' : isCurrent || isNext ? '#FF6B35' : '#E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `3px solid ${isPast ? '#DCFCE7' : isCurrent ? '#FFF7ED' : '#F1F5F9'}`,
              zIndex: 1, marginTop: '6px',
              boxShadow: isCurrent || isNext ? '0 0 0 4px rgba(255,107,53,0.2)' : 'none',
            }}>
              {isPast
                ? <CheckCircle2 size={12} color="#fff" />
                : <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isCurrent || isNext ? '#fff' : '#94A3B8' }} />
              }
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: isPast ? 700 : isCurrent || isNext ? 800 : 600, fontSize: '0.92rem', color: isPast ? '#64748B' : isCurrent || isNext ? '#0F172A' : '#94A3B8' }}>
                    {stop.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{stop.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isPast ? '#64748B' : '#0F172A' }}>{stop.time}</div>
                  {isPast && (
                    <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>✓ Departed</div>
                  )}
                  {(isCurrent || isNext) && (
                    <div style={{ fontSize: '0.68rem', color: '#FF6B35', fontWeight: 700, animation: 'blinkText 1s infinite' }}>● Bus here soon</div>
                  )}
                </div>
              </div>
              {stop.note && (
                <div style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '3px', fontWeight: 600 }}>{stop.note}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Tracking Page ─────────────────────────────────────────────────────────
export default function BusTrackingPage() {
  const { bookingRef } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [booking, setBooking]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [progress, setProgress] = useState(0);
  const [eta, setEta]           = useState('');
  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [copied, setCopied]     = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const intervalRef = useRef(null);

  const startSimulation = useCallback((data) => {
    // Calculate realistic progress based on journey date and times
    const now       = new Date();
    const depParts  = (data.departureTime || '09:00 PM').match(/(\d+):(\d+)\s*(AM|PM)/i);
    const arrParts  = (data.arrivalTime   || '06:00 AM').match(/(\d+):(\d+)\s*(AM|PM)/i);

    let depHour = depParts ? parseInt(depParts[1]) : 21;
    let arrHour = arrParts ? parseInt(arrParts[1]) : 6;

    if (depParts?.[3]?.toUpperCase() === 'PM' && depHour !== 12) depHour += 12;
    if (depParts?.[3]?.toUpperCase() === 'AM' && depHour === 12) depHour = 0;
    if (arrParts?.[3]?.toUpperCase() === 'AM' && arrHour === 12) arrHour = 0;

    const nowHour = now.getHours() + now.getMinutes() / 60;
    let totalHours = arrHour > depHour ? arrHour - depHour : (24 - depHour + arrHour);
    if (totalHours <= 0) totalHours = 8;

    const hoursElapsed = nowHour >= depHour ? nowHour - depHour : 0;
    const rawProgress  = Math.min(95, Math.max(5, (hoursElapsed / totalHours) * 100));
    setProgress(rawProgress);

    const hoursRemaining = Math.max(0, totalHours - hoursElapsed);
    const etaDate = new Date(now.getTime() + hoursRemaining * 3600000);
    setEta(etaDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

    // Live simulation: advance 0.05% every second
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = Math.min(99, p + 0.05);
        return next;
      });
      setLastUpdate(new Date());
    }, 2000);
  }, []);

  const loadBooking = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getBookingByReference(bookingRef);
      setBooking(data);
      startSimulation(data);
    } catch {
      setError('Booking not found. Please check your PNR reference.');
    } finally {
      setLoading(false);
    }
  }, [bookingRef, startSimulation]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadBooking();
  }, [isAuthenticated, loadBooking, navigate]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B35,#EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'spin 1s linear infinite' }}>
        <Bus size={28} color="#fff" />
      </div>
      <p style={{ color: '#64748B', fontWeight: 700 }}>Loading live tracking data...</p>
    </div>
  );

  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
      <AlertCircle size={48} color="#EF4444" />
      <h2 style={{ fontWeight: 800, color: '#0F172A' }}>Tracking Unavailable</h2>
      <p style={{ color: '#64748B', textAlign: 'center' }}>{error}</p>
      <Link to="/my-bookings" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>← Back to My Bookings</Link>
    </div>
  );

  if (!booking) return null;

  const isCancelled = booking.bookingStatus === 'CANCELLED';
  const src  = booking.sourceCity || 'Source';
  const dst  = booking.destinationCity || 'Destination';

  // Journey stops
  const stops = [
    { name: src,   location: booking.boardingPoint  || 'Main Bus Stand', time: booking.departureTime, progressAt: 0,   note: '📍 Your boarding point' },
    { name: 'Midway Rest Stop', location: 'Highway Dhaba Junction',      time: '—',                    progressAt: 45,  note: null },
    { name: dst,   location: booking.droppingPoint  || 'Central Drop',  time: booking.arrivalTime,   progressAt: 100, note: '🏁 Your destination' },
  ];

  const distanceCovered = Math.round((progress / 100) * 280); // approx km
  const distanceLeft    = Math.round(280 - distanceCovered);

  return (
    <div style={{ flex: 1, background: '#F8FAFC', minHeight: 'calc(100vh - 76px)', paddingBottom: '3rem' }}>

      {/* ── Top Header ── */}
      <div style={{
        background: 'linear-gradient(135deg,#070B19 0%,#0B132B 60%,#1D4ED8 100%)',
        padding: '1.5rem 0 2.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', pointerEvents: 'none' }} />
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/my-bookings')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '0.5rem 0.85rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 600 }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.35rem', margin: 0 }}>
                  {src} <span style={{ color: '#FF6B35' }}>→</span> {dst}
                </h1>
                {!isCancelled && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '9999px', padding: '3px 10px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444', animation: 'liveBlip 1s infinite', display: 'inline-block' }} />
                    <span style={{ color: '#FCA5A5', fontSize: '0.72rem', fontWeight: 800 }}>LIVE TRACKING</span>
                  </div>
                )}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '3px' }}>
                PNR: <strong style={{ color: '#FF6B35' }}>{booking.bookingReference}</strong>
                &nbsp;·&nbsp;{booking.journeyDate}
                &nbsp;·&nbsp;{booking.operatorName}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={loadBooking} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '0.5rem 0.85rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: 600 }}>
                <RefreshCw size={14} /> Refresh
              </button>
              <button onClick={shareLink} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '0.5rem 0.85rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: 600 }}>
                {copied ? <CheckCircle2 size={14} /> : <Share2 size={14} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Journey Date',    value: booking.journeyDate,              color: '#60A5FA' },
              { label: 'Departure',       value: booking.departureTime,            color: '#34D399' },
              { label: 'Expected Arrival',value: eta || booking.arrivalTime,       color: '#FBBF24' },
              { label: 'Seats',           value: booking.seatNumbers,              color: '#F472B6' },
              { label: 'Status',          value: isCancelled ? '❌ CANCELLED' : '✅ ON TIME', color: isCancelled ? '#F87171' : '#34D399' },
            ].map(k => (
              <div key={k.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>{k.label}</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: k.color, marginTop: '1px' }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 5 }}>

        {isCancelled ? (
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
            <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#991B1B', fontWeight: 800 }}>This Booking is Cancelled</h2>
            <p style={{ color: '#64748B' }}>Live tracking is only available for confirmed bookings.</p>
            <Link to="/search" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem', padding: '0.75rem 1.75rem' }}>Book Again</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>

            {/* ── LEFT: Map + Tabs ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Tab bar */}
              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '4px', display: 'flex', gap: '4px' }}>
                {[
                  { id: 'map',      label: '🗺️ Live Map' },
                  { id: 'timeline', label: '🛤️ Journey Timeline' },
                  { id: 'info',     label: '🚌 Bus Info' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, background: activeTab === tab.id ? '#0B132B' : 'transparent', color: activeTab === tab.id ? '#fff' : '#64748B', transition: 'all 0.15s' }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Map Tab */}
              {activeTab === 'map' && (
                <>
                  <TrackingMap
                    sourceCity={src}
                    destinationCity={dst}
                    progress={progress}
                    busPos={{ x: 0, y: 0 }}
                  />

                  {/* Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
                    {[
                      { icon: '📍', label: 'Distance Covered', value: `${distanceCovered} km`, color: '#10B981', bg: '#ECFDF5' },
                      { icon: '🏁', label: 'Distance Left',    value: `${distanceLeft} km`,    color: '#2563EB', bg: '#EFF6FF' },
                      { icon: '⚡', label: 'Current Speed',    value: '68 km/h',               color: '#FF6B35', bg: '#FFF7ED' },
                      { icon: '🕐', label: 'Last Updated',     value: lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), color: '#8B5CF6', bg: '#F5F3FF' },
                    ].map(s => (
                      <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.color}25`, borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{s.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '1.75rem' }}>
                  <h3 style={{ fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem', fontSize: '1.05rem' }}>🛤️ Live Journey Progress</h3>
                  <JourneyTimeline stops={stops} progress={progress} />

                  {/* Progress bar */}
                  <div style={{ marginTop: '1.5rem', background: '#F1F5F9', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#10B981' }}>{src}</span>
                      <span style={{ color: '#2563EB' }}>{Math.round(progress)}% complete</span>
                      <span style={{ color: '#EF4444' }}>{dst}</span>
                    </div>
                    <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${progress}%`,
                        background: 'linear-gradient(90deg,#10B981,#2563EB,#FF6B35)',
                        borderRadius: '5px', transition: 'width 1s ease',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', animation: 'shimmer 2s infinite' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bus Info Tab */}
              {activeTab === 'info' && (
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, color: '#0F172A', margin: 0 }}>🚌 Bus & Operator Details</h3>

                  <div style={{ background: 'linear-gradient(135deg,#0B132B,#1E3A5F)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bus size={28} color="#FF6B35" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>{booking.operatorName}</div>
                      <div style={{ color: '#93C5FD', fontSize: '0.78rem', marginTop: '2px' }}>{booking.busType?.replace(/_/g, ' ')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4].map(i => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                      <Star size={14} fill="rgba(245,158,11,0.3)" color="#F59E0B" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { icon: <Wifi size={16} />,    label: 'WiFi',          value: 'Available',  ok: true  },
                      { icon: <Battery size={16} />, label: 'USB Charging',  value: 'Every Berth', ok: true  },
                      { icon: <Shield size={16} />,  label: 'CCTV',          value: 'Active',      ok: true  },
                      { icon: <Navigation size={16} />, label: 'GPS',        value: 'Live Tracking', ok: true },
                      { icon: <Users size={16} />,   label: 'Cleanliness',   value: 'Sanitized',   ok: true  },
                      { icon: <Zap size={16} />,     label: 'Engine',        value: 'Diesel',       ok: true  },
                    ].map(f => (
                      <div key={f.label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ color: '#2563EB' }}>{f.icon}</div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>{f.label}</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{f.value}</div>
                        </div>
                        <CheckCircle2 size={14} color="#10B981" style={{ marginLeft: 'auto' }} />
                      </div>
                    ))}
                  </div>

                  {/* Emergency contact */}
                  <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '14px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={20} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '0.88rem' }}>Emergency Helpline</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#EF4444' }}>1800-BUS-GO-24</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>24/7 Available · Toll Free</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Passenger Card + Actions ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Live Status Card */}
              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.08)' }}>
                <div style={{ background: 'linear-gradient(135deg,#10B981,#059669)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Radio size={20} color="#fff" />
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>Bus Live Status</div>
                  <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800, color: '#fff' }}>
                    ON TIME ✓
                  </div>
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>Journey Progress</span>
                    <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.92rem' }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#10B981,#2563EB)', borderRadius: '4px', transition: 'width 1.5s ease' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '0.65rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>DEPARTED</div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>{booking.departureTime}</div>
                    </div>
                    <div style={{ background: '#FFF7ED', borderRadius: '10px', padding: '0.65rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>ETA</div>
                      <div style={{ fontWeight: 800, color: '#FF6B35', fontSize: '0.88rem' }}>{eta || booking.arrivalTime}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '1rem', fontSize: '0.92rem' }}>📋 Your Booking</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                  {[
                    { icon: <MapPin size={13} color="#2563EB" />, label: 'Boarding Point', value: booking.boardingPoint || '—' },
                    { icon: <MapPin size={13} color="#FF6B35" />, label: 'Dropping Point', value: booking.droppingPoint || '—' },
                    { icon: <Bus size={13} color="#8B5CF6" />,    label: 'Seat Numbers',  value: booking.seatNumbers },
                    { icon: <Clock size={13} color="#10B981" />,  label: 'Departure',     value: booking.departureTime },
                    { icon: <Clock size={13} color="#F59E0B" />,  label: 'Arrival',       value: booking.arrivalTime },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', borderBottom: '1px solid #F8FAFC' }}>
                      <div style={{ marginTop: '1px', flexShrink: 0 }}>{row.icon}</div>
                      <div style={{ color: '#64748B', fontSize: '0.78rem', minWidth: '100px' }}>{row.label}</div>
                      <div style={{ fontWeight: 700, color: '#0F172A', flex: 1, textAlign: 'right', fontSize: '0.82rem' }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '0.85rem', fontSize: '0.92rem' }}>⚡ Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    { label: '📱 Share Live Location', action: shareLink,                                          color: '#2563EB', bg: '#EFF6FF' },
                    { label: '🎫 View Full Ticket',    action: () => navigate('/my-bookings'),                    color: '#10B981', bg: '#ECFDF5' },
                    { label: '📞 Emergency Contact',   action: () => window.open('tel:18002874636'),               color: '#EF4444', bg: '#FEF2F2' },
                    { label: '🔔 Set Arrival Alert',   action: () => alert('Alert set! We will notify you 30 minutes before arrival.'), color: '#8B5CF6', bg: '#F5F3FF' },
                  ].map(a => (
                    <button key={a.label} onClick={a.action} style={{ width: '100%', textAlign: 'left', padding: '0.7rem 0.9rem', borderRadius: '10px', background: a.bg, border: `1.5px solid ${a.color}25`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: a.color, transition: 'all 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(3px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      {a.label}
                      <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate Bus */}
              <div style={{ background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '1.5px solid #FDE68A', borderRadius: '20px', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>⭐</div>
                <div style={{ fontWeight: 800, color: '#92400E', marginBottom: '4px', fontSize: '0.92rem' }}>Rate Your Journey</div>
                <div style={{ fontSize: '0.78rem', color: '#78350F', marginBottom: '0.85rem' }}>Help others by sharing your experience</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', fontSize: '1.5rem' }}
                      onClick={() => alert(`Thank you! You rated ${star} ⭐`)}>
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes liveBlip {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes blinkText {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
