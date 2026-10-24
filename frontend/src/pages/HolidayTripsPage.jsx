import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Compass,
  MapPin, Palmtree, RefreshCw, Sparkles, Sun, Ticket, Waves,
} from 'lucide-react';
import { api } from '../services/api';

function getLocalDate() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function HolidayTripsPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [origin, setOrigin] = useState('Any city');
  const [travelDate, setTravelDate] = useState(getLocalDate);
  const [activeTheme, setActiveTheme] = useState('All trips');
  const [expandedTrip, setExpandedTrip] = useState(null);

  const loadPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getHolidayPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load holiday plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const origins = useMemo(
    () => [...new Set(plans.map((plan) => plan.sourceCity).filter(Boolean))].sort(),
    [plans],
  );
  const themes = useMemo(
    () => ['All trips', ...new Set(plans.map((plan) => plan.theme).filter(Boolean))],
    [plans],
  );
  const visiblePlans = plans.filter((plan) => (
    (origin === 'Any city' || plan.sourceCity === origin)
    && (activeTheme === 'All trips' || plan.theme === activeTheme)
  ));

  const findBuses = (plan) => {
    const params = new URLSearchParams({
      from: plan.sourceCity,
      to: plan.destinationCity,
      date: travelDate,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main className="holiday-page">
      <section className="holiday-hero">
        <div className="holiday-hero-glow holiday-hero-glow-one" />
        <div className="holiday-hero-glow holiday-hero-glow-two" />
        <div className="container holiday-hero-content">
          <div className="holiday-eyebrow"><Sparkles size={15} /> Your next story starts on the way</div>
          <h1>Plan a holiday.<br /><span>We’ll get you there.</span></h1>
          <p>Find a little inspiration, pick your dates, and book your bus. Your getaway is closer than you think.</p>
          <a className="holiday-hero-cta" href="#trip-ideas">
            Explore trip ideas <ArrowRight size={17} />
          </a>
          <div className="holiday-hero-note">
            <Ticket size={15} /> Bus tickets on BusGo · Build the rest of your trip your way
          </div>
        </div>
      </section>

      <section className="container holiday-planner" aria-label="Filter holiday trip ideas">
        <div className="holiday-planner-intro">
          <div className="holiday-planner-icon"><Compass size={21} /></div>
          <div>
            <h2>Where are you heading?</h2>
            <p>Choose a starting city and travel date to find your kind of break.</p>
          </div>
        </div>
        <div className="holiday-planner-fields">
          <label>
            <span><MapPin size={14} /> Starting city</span>
            <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
              <option>Any city</option>
              {origins.map((city) => <option key={city}>{city}</option>)}
            </select>
          </label>
          <label>
            <span><CalendarDays size={14} /> Travel date</span>
            <input type="date" min={getLocalDate()} value={travelDate} onChange={(event) => setTravelDate(event.target.value)} />
          </label>
        </div>
      </section>

      <section className="container holiday-trips-section" id="trip-ideas">
        <div className="holiday-section-heading">
          <div>
            <span className="holiday-section-kicker">CURATED FOR YOUR NEXT BREAK</span>
            <h2>Pick your kind of getaway</h2>
            <p>Trip ideas paired with routes you can search and book on BusGo.</p>
          </div>
          <div className="holiday-heading-stamp"><Sun size={18} /> Good trips, better views</div>
        </div>

        {!loading && !error && plans.length > 0 && (
          <div className="holiday-theme-filters" aria-label="Filter trips by theme">
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                className={activeTheme === theme ? 'holiday-theme-chip active' : 'holiday-theme-chip'}
                aria-pressed={activeTheme === theme}
                onClick={() => setActiveTheme(theme)}
              >
                {theme === 'Beach' && <Waves size={14} />}
                {theme === 'All trips' && <Compass size={14} />}
                {theme}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="holiday-empty-state" role="status">
            <RefreshCw size={28} className="animate-spin" />
            <h3>Finding your next getaway</h3>
            <p>Loading holiday plans...</p>
          </div>
        ) : error ? (
          <div className="holiday-empty-state" role="alert">
            <Palmtree size={30} />
            <h3>Holiday plans are unavailable</h3>
            <p>{error}</p>
            <button type="button" onClick={loadPlans}>Try again</button>
          </div>
        ) : visiblePlans.length > 0 ? (
          <div className="holiday-trip-grid">
            {visiblePlans.map((plan) => {
              const isExpanded = expandedTrip === plan.id;
              return (
                <article className="holiday-trip-card" key={plan.id}>
                  <div
                    className={`holiday-trip-image${plan.image ? ' has-photo' : ''}`}
                    style={plan.image ? { backgroundImage: `linear-gradient(180deg, rgba(7,11,25,.05), rgba(7,11,25,.6)), url("${plan.image}")` } : undefined}
                  >
                    {!plan.image && <div className="holiday-trip-art"><Palmtree size={45} strokeWidth={1.2} /></div>}
                    <span className="holiday-trip-theme">{plan.theme}</span>
                    <span className="holiday-trip-duration"><Clock3 size={13} /> {plan.duration}</span>
                  </div>
                  <div className="holiday-trip-body">
                    <div className="holiday-trip-route">{plan.sourceCity} <span>→</span> {plan.destinationCity}</div>
                    <h3>{plan.name}</h3>
                    <p className="holiday-trip-description">{plan.description}</p>
                    <div className="holiday-trip-highlights">
                      {(plan.highlights || []).map((highlight) => (
                        <span key={highlight}><Check size={13} /> {highlight}</span>
                      ))}
                    </div>
                    {isExpanded && (
                      <div className="holiday-itinerary">
                        <strong>A little itinerary inspiration</strong>
                        {(plan.itinerary || []).map((day) => <p key={day}>{day}</p>)}
                      </div>
                    )}
                    <div className="holiday-trip-footer">
                      <div>
                        <span>Bus fare from</span>
                        <strong>₹{Number(plan.fare).toLocaleString('en-IN')}</strong>
                      </div>
                      <button
                        type="button"
                        className="holiday-trip-details"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedTrip(isExpanded ? null : plan.id)}
                      >
                        {isExpanded ? 'Hide plan' : 'Trip plan'} <ChevronDown size={15} />
                      </button>
                    </div>
                    <button type="button" className="holiday-book-button" onClick={() => findBuses(plan)}>
                      Find buses <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="holiday-empty-state">
            <Palmtree size={30} />
            <h3>{plans.length ? 'No trip ideas for this combination yet' : 'New getaways are on their way'}</h3>
            <p>{plans.length
              ? 'Try another starting city or choose “All trips” to browse every getaway.'
              : 'Our travel team is preparing holiday plans. Please check back soon.'}</p>
            {plans.length > 0 && (
              <button type="button" onClick={() => { setOrigin('Any city'); setActiveTheme('All trips'); }}>
                Show all trips
              </button>
            )}
          </div>
        )}
      </section>

      <section className="holiday-how-section">
        <div className="container holiday-how-content">
          <div>
            <span className="holiday-section-kicker">SIMPLE FROM START TO RIDE</span>
            <h2>Make the journey part of the holiday.</h2>
          </div>
          <div className="holiday-steps">
            <div><span>01</span><strong>Choose a getaway</strong><p>Browse ideas by city and travel mood.</p></div>
            <div><span>02</span><strong>Pick your date</strong><p>Set a date that works for your plans.</p></div>
            <div><span>03</span><strong>Book your bus</strong><p>See live availability on the selected route.</p></div>
          </div>
        </div>
        <div className="container holiday-disclaimer">
          <Palmtree size={15} />
          <span>These are trip-planning ideas, not bundled holiday packages. Bus fares are indicative; accommodation and activities are planned separately.</span>
        </div>
      </section>
    </main>
  );
}
