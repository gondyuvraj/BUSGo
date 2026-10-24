import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PassengerFormModal({ bookingData, onClose, onProceedToPayment }) {
  const { user } = useAuth();
  const { schedule, selectedSeats, totalAmount, journeyDate } = bookingData;

  const [passengers, setPassengers] = useState(
    selectedSeats.map((seat, idx) => ({
      name: idx === 0 && user?.name ? user.name : '',
      age: '',
      gender: 'MALE',
      seatNumber: seat.seatNumber,
    }))
  );

  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98190 12345');
  const [contactEmail, setContactEmail] = useState(user?.email || 'traveler@busgo.com');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setErrorMsg(`Please enter passenger name for seat ${passengers[i].seatNumber}`);
        return;
      }
      if (!passengers[i].age || Number(passengers[i].age) < 1 || Number(passengers[i].age) > 110) {
        setErrorMsg(`Please enter valid age for passenger in seat ${passengers[i].seatNumber}`);
        return;
      }
    }

    if (!contactPhone.trim() || !contactEmail.trim()) {
      setErrorMsg('Please enter valid contact details for M-Ticket dispatch');
      return;
    }

    onProceedToPayment({
      ...bookingData,
      passengers,
      contactPhone,
      contactEmail,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Passenger & Contact Details
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              {schedule.sourceCity} → {schedule.destinationCity} | {journeyDate} | {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#94A3B8', padding: '6px', borderRadius: '50%', background: '#F1F5F9' }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Passenger Details Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
            {passengers.map((p, idx) => (
              <div
                key={p.seatNumber}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase' }}>
                    Passenger {idx + 1}
                  </span>
                  <span style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    Seat {p.seatNumber}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={p.name}
                      onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="110"
                      value={p.age}
                      onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      Gender
                    </label>
                    <select
                      value={p.gender}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        background: '#fff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Details */}
          <div style={{
            background: '#F0F9FF',
            border: '1.5px solid #BAE6FD',
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369A1', marginBottom: '0.85rem' }}>
              M-Ticket Delivery Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                  Mobile Number (for SMS & WhatsApp Ticket)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>Total Amount</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>₹{totalAmount}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-accent"
                style={{ padding: '0.75rem 1.75rem' }}
              >
                <span>Proceed to Payment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
