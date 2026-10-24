import React, { useState } from 'react';
import { Star, Shield, ChevronDown, ChevronUp, Clock, Navigation, MapPin, AlertCircle } from 'lucide-react';
import SeatMap from './SeatMap';

export default function BusCard({ bus, journeyDate, onProceedToBooking }) {
  const [showSeats, setShowSeats] = useState(false);

  const originalFare  = Math.round(bus.fare * 1.2);
  const amenitiesList = bus.amenities ? bus.amenities.split(',') : ['AC', 'WiFi', 'Charging Point'];

  const handleSeatProceed = (summary) => {
    onProceedToBooking({ schedule: bus, journeyDate, ...summary });
  };

  // Parse multiple boarding/dropping points (comma-separated)
  const boardingPoints = bus.boardingPoint
    ? bus.boardingPoint.split('/').map(p => p.trim()).filter(Boolean)
    : ['Main Highway Plaza'];
  const droppingPoints = bus.droppingPoint
    ? bus.droppingPoint.split('/').map(p => p.trim()).filter(Boolean)
    : ['Central Terminal'];

  return (
    <div className="bus-card">
      {/* ── Header ── */}
      <div className="bus-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {bus.operatorName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
              <span className="badge badge-sleeper">{bus.busType?.replace(/_/g, ' ')}</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>#{bus.busNumber}</span>
              {bus.busModel && <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>· {bus.busModel}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="badge badge-rating" style={{ fontSize: '0.82rem', padding: '0.3rem 0.6rem' }}>
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{bus.rating?.toFixed(1) || '4.8'}</span>
            <span style={{ color: '#92400E', fontWeight: 500, fontSize: '0.72rem' }}>({bus.reviewsCount || 150})</span>
          </div>
          <span className="badge badge-live"><Shield size={11} /> Verified</span>
          {bus.engineType === 'ELECTRIC' && (
            <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
              ⚡ Electric
            </span>
          )}
        </div>
      </div>

      {/* ── Body: Timings + Seats + Price ── */}
      <div className="bus-card-body">
        {/* Route & Times */}
        <div className="time-route-container">
          <div className="time-block">
            <div className="time-text">{bus.departureTime}</div>
            <div className="station-text">{bus.sourceCity}</div>
            {/* Boarding Points */}
            <div style={{ marginTop: '4px' }}>
              {boardingPoints.slice(0, 2).map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
                  <Navigation size={9} color="#2563EB" />
                  <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pt}</span>
                </div>
              ))}
              {boardingPoints.length > 2 && (
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '2px' }}>+{boardingPoints.length - 2} more stops</div>
              )}
            </div>
          </div>

          <div className="duration-line-container">
            <div className="duration-pill">
              <Clock size={10} style={{ display: 'inline', marginRight: '2px' }} />
              {bus.durationHours}h
            </div>
            <div className="route-dash-line" />
            <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700, marginTop: '3px' }}>Non-Stop</div>
          </div>

          <div className="time-block" style={{ textAlign: 'right' }}>
            <div className="time-text">{bus.arrivalTime}</div>
            <div className="station-text">{bus.destinationCity}</div>
            {/* Dropping Points */}
            <div style={{ marginTop: '4px' }}>
              {droppingPoints.slice(0, 2).map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', color: '#FF6B35', fontWeight: 600, marginTop: '2px', justifyContent: 'flex-end' }}>
                  <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pt}</span>
                  <MapPin size={9} color="#FF6B35" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seats */}
        <div style={{ textAlign: 'center', borderLeft: '1px solid #F1F5F9', borderRight: '1px solid #F1F5F9', padding: '0 1rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: bus.availableSeats <= 5 ? '#DC2626' : '#2563EB' }}>
            {bus.availableSeats} Left
          </div>
          {bus.availableSeats <= 5 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: '#DC2626', fontWeight: 700, marginTop: '3px' }}>
              <AlertCircle size={11} /> Filling Fast
            </div>
          )}
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px' }}>{bus.totalSeats} total</div>
        </div>

        {/* Price & CTA */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>₹{originalFare}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '3px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>From</span>
            <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A' }}>₹{bus.fare}</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>Zero convenience fee</div>
          <button
            type="button"
            onClick={() => setShowSeats(!showSeats)}
            className={showSeats ? 'btn-outline' : 'btn-primary'}
            style={{ marginTop: '0.65rem', width: '100%', padding: '0.6rem 0.85rem' }}
          >
            <span>{showSeats ? 'Hide Seats' : 'View Seats'}</span>
            {showSeats ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* ── Amenities & Points Banner ── */}
      <div style={{ background: '#F8FAFC', padding: '0.6rem 1.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', color: '#64748B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {amenitiesList.slice(0, 5).map((a, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              ✓ {a.trim()}
            </span>
          ))}
        </div>
        <div style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.72rem' }}>
          Free cancellation up to 12h before
        </div>
      </div>

      {/* ── Seat Map (Expandable) ── */}
      {showSeats && (
        <SeatMap
          scheduleId={bus.scheduleId}
          journeyDate={journeyDate}
          baseFare={bus.fare}
          busInfo={bus}
          boardingPoints={boardingPoints}
          droppingPoints={droppingPoints}
          onProceed={handleSeatProceed}
        />
      )}
    </div>
  );
}
