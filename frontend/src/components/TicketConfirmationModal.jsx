import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Printer, Bus, QrCode, ArrowRight, Navigation } from 'lucide-react';

export default function TicketConfirmationModal({ booking, onClose }) {
  const navigate = useNavigate();

  let passengers = [];
  try {
    passengers = typeof booking.passengerDetails === 'string'
      ? JSON.parse(booking.passengerDetails)
      : booking.passengerDetails || [];
  } catch {
    passengers = [];
  }

  const handlePrint = () => {
    window.print();
  };

  const handleGoToBookings = () => {
    onClose();
    navigate('/my-bookings');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '750px', padding: '2rem' }}>
        {/* Success Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '1.75rem',
          boxShadow: '0 10px 20px -5px rgba(5,150,105,0.3)',
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
          }}>
            <CheckCircle2 size={32} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Booking Confirmed!
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem', color: '#D1FAE5' }}>
            Your BusGo reservation is locked and guaranteed. Digital M-Ticket has been issued.
          </p>
        </div>

        {/* Printable Ticket Pass */}
        <div id="printable-ticket" style={{
          background: '#FFFFFF',
          border: '2px solid #E2E8F0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '1.75rem',
        }}>
          {/* Ticket Header */}
          <div style={{
            background: '#0B132B',
            color: '#fff',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px' }}>
                <Bus size={20} />
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Bus<span style={{ color: '#FF6B35' }}>Go</span></span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Official Boarding Pass</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PNR / Booking Reference
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FF6B35', letterSpacing: '1px' }}>
                {booking.bookingReference}
              </div>
            </div>
          </div>

          {/* Ticket Main Details */}
          <div style={{ padding: '1.75rem' }}>
            {/* Route & Times */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              gap: '1rem',
              alignItems: 'center',
              borderBottom: '1.5px dashed #CBD5E1',
              paddingBottom: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Departure
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                  {booking.departureTime}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563EB' }}>
                  {booking.sourceCity}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px' }}>
                  {booking.boardingPoint || 'Central Boarding Terminal'}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#F1F5F9',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#475569',
                  display: 'inline-block',
                  marginBottom: '6px',
                }}>
                  {booking.journeyDate}
                </div>
                <div style={{ height: '2px', background: '#CBD5E1', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    padding: '0 6px',
                  }}>
                    <Bus size={18} color="#2563EB" />
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, marginTop: '8px' }}>
                  CONFIRMED
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Arrival
                </span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                  {booking.arrivalTime}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563EB' }}>
                  {booking.destinationCity}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px' }}>
                  {booking.droppingPoint || 'Central Drop Stand'}
                </div>
              </div>
            </div>

            {/* Operator & Seat Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Operator
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                  {booking.operatorName}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Bus Type
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                  {booking.busType?.replace('_', ' ')}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Seat Numbers
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EA580C' }}>
                  {booking.seatNumbers}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Total Paid
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                  ₹{booking.totalAmount}
                </div>
              </div>
            </div>

            {/* Passengers Table */}
            {passengers.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Passenger Manifest
                </span>
                <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '0.75rem', border: '1px solid #E2E8F0' }}>
                  {passengers.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.35rem 0',
                        fontSize: '0.88rem',
                        borderBottom: idx !== passengers.length - 1 ? '1px solid #E2E8F0' : 'none',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>
                        {idx + 1}. {p.name} ({p.gender}, {p.age} yrs)
                      </span>
                      <span style={{ fontWeight: 700, color: '#2563EB' }}>
                        Seat {p.seatNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code & Barcode Footprint */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F1F5F9',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#64748B',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={36} color="#0F172A" />
                <div>
                  <strong style={{ color: '#0F172A', display: 'block' }}>Scan to Verify Ticket</strong>
                  <span>Txn ID: {booking.transactionId || 'TXN-BUSGO-OK'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#10B981' }}>
                STATUS: CONFIRMED & VALID
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-outline"
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={18} />
            <span>Print / Save PDF Ticket</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{ padding: '0.75rem 1.25rem' }}
            >
              Close
            </button>
            <Link
              to={`/track/${booking.bookingReference}`}
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: '10px',
                background: 'linear-gradient(135deg,#10B981,#059669)',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '8px',
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
              }}
            >
              <Navigation size={18} />
              <span>Track My Bus Live</span>
            </Link>
            <button
              type="button"
              onClick={handleGoToBookings}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <span>View My Bookings</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
