import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  ShieldAlert, LayoutDashboard, Bus, Route as RouteIcon,
  Ticket, Users, DollarSign, TrendingUp, Plus, Trash2, Search,
  XCircle, RefreshCw, BarChart3, PieChart,
  Zap, Bot, Lightbulb, ArrowUpRight,
  ArrowDownRight, Download, Activity,
  MapPin, Award, TrendingDown, Bell,
  ChevronRight, Loader2, X, ToggleLeft, ToggleRight, Palmtree, Pencil
} from 'lucide-react';

// ── AI Insights Engine ─────────────────────────────────────────────────────────
function generateAiInsights(stats, bookings, buses, routes) {
  const insights = [];

  if (stats) {
    const avgRevenuePerBooking = stats.totalBookings > 0
      ? (stats.totalRevenue / stats.totalBookings).toFixed(0) : 0;

    if (avgRevenuePerBooking > 800) {
      insights.push({
        type: 'positive', icon: '📈',
        title: 'High Revenue Per Booking',
        desc: `Average ticket value is ₹${avgRevenuePerBooking} — premium sleeper routes are performing strongly.`,
        action: 'Add more AC Sleeper schedules on peak routes',
      });
    }

    if (stats.totalBuses > 0 && stats.totalRoutes / stats.totalBuses < 1.5) {
      insights.push({
        type: 'warning', icon: '⚠️',
        title: 'Low Route-to-Bus Ratio',
        desc: `Only ${stats.totalRoutes} routes for ${stats.totalBuses} buses. Some buses may be underutilized.`,
        action: 'Create new route corridors for idle fleet',
      });
    }

    if (stats.totalUsers > 10 && stats.totalBookings / stats.totalUsers < 1.5) {
      insights.push({
        type: 'warning', icon: '🎯',
        title: 'Low Repeat Booking Rate',
        desc: `${stats.totalUsers} users but only ${stats.totalBookings} bookings. Users are not rebooking.`,
        action: 'Launch promo campaign with loyalty discounts',
      });
    }

    insights.push({
      type: 'info', icon: '🤖',
      title: 'Peak Demand Prediction',
      desc: 'Fridays and Sundays typically see 68% higher booking volume. Pre-deploy extra coaches on these days.',
      action: 'Schedule additional Friday departures',
    });

    if (stats.totalRevenue > 0) {
      insights.push({
        type: 'positive', icon: '💡',
        title: 'Dynamic Pricing Opportunity',
        desc: 'Mumbai-Pune & Mumbai-Goa routes show consistent high demand. Increase fares by 15% on weekends.',
        action: 'Update schedule fares for peak days',
      });
    }

    if (buses && buses.length > 0 && routes && routes.length > 0) {
      const inactiveCount = buses.filter(b => b.isActive === false).length;
      if (inactiveCount > 0) {
        insights.push({
          type: 'warning', icon: '⚡',
          title: 'Fleet Utilization Opportunity',
          desc: `${inactiveCount} bus(es) are currently inactive while popular corridors have active demand.`,
          action: 'Review inactive buses under Bus Fleet tab',
        });
      }
    }

    if (bookings && bookings.length > 0) {
      const cancelledCount = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
      if (cancelledCount > 0) {
        insights.push({
          type: 'info', icon: '🛡️',
          title: 'Cancellation Trend Monitored',
          desc: `${cancelledCount} booking(s) processed with standard 90% refund policy.`,
          action: 'Check refund statuses in Bookings tab',
        });
      }
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info', icon: '📊',
      title: 'Gathering Intelligence',
      desc: 'Add more bookings and routes to unlock AI-powered insights and recommendations.',
      action: 'Add more schedules to see predictions',
    });
  }

  return insights;
}

// ── Mini Bar Chart ─────────────────────────────────────────────────────────────
function MiniBarChart({ data, color = '#2563EB' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.revenue || d.bookings || 0));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
      {data.map((item, i) => {
        const val = item.revenue || item.bookings || 0;
        const height = max > 0 ? Math.max(4, (val / max) * 60) : 4;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{
              width: '100%', height: `${height}px`,
              background: i === data.length - 1
                ? `linear-gradient(180deg, ${color}, ${color}cc)`
                : `${color}55`,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.5s ease',
            }} />
            <span style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600 }}>{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, subColor, trend, trendUp, bg, chartData }) {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px',
      padding: '1.25rem 1.4rem', boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
      display: 'flex', flexDirection: 'column', gap: '0.6rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: bg || '#EFF6FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            fontSize: '0.75rem', fontWeight: 700,
            color: trendUp ? '#10B981' : '#EF4444',
            background: trendUp ? '#DCFCE7' : '#FEE2E2',
            padding: '3px 8px', borderRadius: '9999px',
          }}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, marginTop: '2px' }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: '0.75rem', color: subColor || '#64748B', fontWeight: 600, marginTop: '2px' }}>
            {sub}
          </div>
        )}
      </div>
      {chartData && <MiniBarChart data={chartData} color={bg?.includes('green') ? '#10B981' : '#2563EB'} />}
    </div>
  );
}

const EMPTY_HOLIDAY_PLAN = {
  name: '',
  sourceCity: '',
  destinationCity: '',
  theme: 'Beach',
  duration: '',
  fare: '',
  image: '',
  description: '',
  highlights: [],
  itinerary: [],
  published: false,
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [holidayPlans, setHolidayPlans] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsights, setAiInsights] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('ALL');
  const [holidayPlanFilter, setHolidayPlanFilter] = useState('ALL');
  const [notifications, setNotifications] = useState([]);

  // Modals
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showHolidayPlanModal, setShowHolidayPlanModal] = useState(false);
  const [editingHolidayPlan, setEditingHolidayPlan] = useState(null);
  const [holidayPlanForm, setHolidayPlanForm] = useState({ ...EMPTY_HOLIDAY_PLAN });

  const [newBus, setNewBus] = useState({
    busNumber: '', operatorName: '', busType: 'AC_SLEEPER', totalSeats: 30,
    amenities: 'WiFi,AC,Blanket,Water Bottle,Reading Light,GPS',
    rating: 4.5, reviewsCount: 0,
    brandName: '', companyWebsite: '', companyPhone: '', companyEmail: '', establishedYear: '',
    busModel: '', engineType: 'DIESEL', busColor: '', busAgeYears: '', averageSpeedKmh: '',
    hasAC: true, hasSleeper: true, hasSeater: false,
    hasWifi: false, hasChargingPoint: false, hasGPS: false, hasCCTV: false,
    hasReadingLight: false, hasBlanketPillow: false, hasWaterBottle: false,
    hasEmergencySOS: false, hasLadiesSeat: false, hasPanicButton: false,
    hasLiveTracking: false, hasCleanWashroom: false,
    insuranceProvider: '', permitNumber: '', lastServiceDate: '',
  });
  const [newRoute, setNewRoute] = useState({
    sourceCity: '', destinationCity: '', distanceKm: 200, estimatedDurationHours: 4.0,
  });
  const [newSchedule, setNewSchedule] = useState({
    busId: '', routeId: '', departureTime: '09:00 PM', arrivalTime: '06:00 AM',
    fare: 799.0, boardingPoint: '', droppingPoint: '',
  });

  const fetchAllAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, busesData, routesData, schedulesData, bookingsData, usersData, holidayPlansData] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAdminBuses().catch(() => []),
        api.getAdminRoutes().catch(() => []),
        api.getAdminSchedules().catch(() => []),
        api.getAdminBookings().catch(() => []),
        api.getAdminUsers().catch(() => []),
        api.getAdminHolidayPlans().catch(() => []),
      ]);
      setStats(statsData);
      setBuses(busesData || []);
      setRoutes(routesData || []);
      setSchedules(schedulesData || []);
      setHolidayPlans(holidayPlansData || []);
      setBookings(bookingsData || []);
      setUsers(usersData || []);

      // Generate AI insights
      const insights = generateAiInsights(statsData, bookingsData, busesData, routesData);
      setAiInsights(insights);

      // Build notifications
      const notifs = [];
      const confirmed = (bookingsData || []).filter(b => b.bookingStatus === 'CONFIRMED');
      if (confirmed.length > 0) notifs.push({ type: 'success', msg: `${confirmed.length} active confirmed bookings` });
      const cancelled = (bookingsData || []).filter(b => b.bookingStatus === 'CANCELLED');
      if (cancelled.length > 0) notifs.push({ type: 'warning', msg: `${cancelled.length} cancellations need refund review` });
      if ((busesData || []).length < 3) notifs.push({ type: 'warning', msg: 'Low fleet count — add more buses to meet demand' });
      setNotifications(notifs);

      if (busesData?.length > 0) setNewSchedule(p => ({ ...p, busId: busesData[0].id }));
      if (routesData?.length > 0) setNewSchedule(p => ({ ...p, routeId: routesData[0].id }));
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!isAdmin) { showToast('Admin access required.', 'error'); navigate('/'); return; }
    fetchAllAdminData();
  }, [isAuthenticated, isAdmin, fetchAllAdminData, navigate, showToast]);

  // CRUD handlers
  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const savedBus = await api.addAdminBus(newBus);
      showToast('Bus added! Now add a schedule so it appears in search results.', 'success');
      setShowAddBusModal(false);
      setNewBus({ busNumber: '', operatorName: '', busType: 'AC_SLEEPER', totalSeats: 30, amenities: 'WiFi,AC,Blanket,Water Bottle', rating: 4.5, reviewsCount: 0, brandName: '', companyWebsite: '', companyPhone: '', companyEmail: '', establishedYear: '', busModel: '', engineType: 'DIESEL', busColor: '', busAgeYears: '', averageSpeedKmh: '', hasAC: true, hasSleeper: true, hasSeater: false, hasWifi: false, hasChargingPoint: false, hasGPS: false, hasCCTV: false, hasReadingLight: false, hasBlanketPillow: false, hasWaterBottle: false, hasEmergencySOS: false, hasLadiesSeat: false, hasPanicButton: false, hasLiveTracking: false, hasCleanWashroom: false, insuranceProvider: '', permitNumber: '', lastServiceDate: '' });

      // Refresh data then auto-open schedule modal with the new bus pre-selected
      const [busesData, routesData] = await Promise.all([
        api.getAdminBuses().catch(() => []),
        api.getAdminRoutes().catch(() => []),
      ]);
      setBuses(busesData || []);
      setRoutes(routesData || []);

      // Pre-select the newly added bus in the schedule form
      const newBusId = savedBus?.id || (busesData.length > 0 ? busesData[busesData.length - 1].id : '');
      const firstRouteId = routesData.length > 0 ? routesData[0].id : '';
      setNewSchedule(p => ({ ...p, busId: newBusId, routeId: firstRouteId }));
      setActiveTab('ROUTES');
      setShowAddScheduleModal(true);
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed to add bus', 'error'); }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Delete this bus? All its schedules will be affected.')) return;
    try {
      await api.deleteAdminBus(id);
      showToast('Bus removed successfully', 'success');
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      await api.addAdminRoute(newRoute);
      showToast('Route created!', 'success');
      setShowAddRouteModal(false);
      setNewRoute({ sourceCity: '', destinationCity: '', distanceKm: 200, estimatedDurationHours: 4.0 });
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await api.deleteAdminRoute(id);
      showToast('Route removed', 'success');
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.addAdminSchedule(newSchedule);
      showToast('Schedule created!', 'success');
      setShowAddScheduleModal(false);
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  const openHolidayPlanForm = (plan = null) => {
    setEditingHolidayPlan(plan);
    setHolidayPlanForm(plan ? {
      ...plan,
      highlights: plan.highlights || [],
      itinerary: plan.itinerary || [],
    } : { ...EMPTY_HOLIDAY_PLAN });
    setShowHolidayPlanModal(true);
  };

  const handleSaveHolidayPlan = async (e) => {
    e.preventDefault();
    const planData = {
      ...holidayPlanForm,
      fare: Number(holidayPlanForm.fare),
      highlights: holidayPlanForm.highlights.filter((line) => line.trim()),
      itinerary: holidayPlanForm.itinerary.filter((line) => line.trim()),
    };

    if (!planData.highlights.length || !planData.itinerary.length) {
      showToast('Add at least one highlight and one itinerary step.', 'error');
      return;
    }

    try {
      if (editingHolidayPlan) {
        await api.updateAdminHolidayPlan(editingHolidayPlan.id, planData);
        showToast('Holiday plan updated.', 'success');
      } else {
        await api.addAdminHolidayPlan(planData);
        showToast('Holiday plan created.', 'success');
      }
      setShowHolidayPlanModal(false);
      setEditingHolidayPlan(null);
      setHolidayPlanForm({ ...EMPTY_HOLIDAY_PLAN });
      fetchAllAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to save holiday plan.', 'error');
    }
  };

  const handleToggleHolidayPlan = async (plan) => {
    try {
      await api.updateAdminHolidayPlan(plan.id, { ...plan, published: !plan.published });
      showToast(plan.published ? 'Holiday plan unpublished.' : 'Holiday plan published to users.', 'success');
      fetchAllAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to update holiday plan.', 'error');
    }
  };

  const handleDeleteHolidayPlan = async (plan) => {
    if (!window.confirm(`Delete "${plan.name}"? This removes it from the holiday page.`)) return;
    try {
      await api.deleteAdminHolidayPlan(plan.id);
      showToast('Holiday plan deleted.', 'success');
      fetchAllAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to delete holiday plan.', 'error');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      await api.deleteAdminSchedule(id);
      showToast('Schedule removed', 'success');
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  const handleToggleRole = async (userId) => {
    try {
      const res = await api.toggleUserRole(userId);
      showToast(`Role updated to ${res.newRole}`, 'success');
      fetchAllAdminData();
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  // Export CSV
  const exportCSV = (data, filename) => {
    if (!data || data.length === 0) { showToast('No data to export', 'warning'); return; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    showToast(`${filename} exported successfully!`, 'success');
  };

  // Filtered data helpers
  const filteredBookings = bookings.filter(b => {
    const matchStatus = bookingFilter === 'ALL' || b.bookingStatus === bookingFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      b.bookingReference?.toLowerCase().includes(q) ||
      b.user?.name?.toLowerCase().includes(q) ||
      b.schedule?.route?.sourceCity?.toLowerCase().includes(q) ||
      b.schedule?.route?.destinationCity?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const filteredBuses = buses.filter(b => {
    const q = searchQuery.toLowerCase();
    return !q || b.busNumber?.toLowerCase().includes(q) || b.operatorName?.toLowerCase().includes(q);
  });

  const filteredHolidayPlans = holidayPlans.filter((plan) => {
    const q = searchQuery.toLowerCase();
    const matchesStatus = holidayPlanFilter === 'ALL'
      || (holidayPlanFilter === 'PUBLISHED' ? plan.published : !plan.published);
    return matchesStatus && (!q
      || plan.name?.toLowerCase().includes(q)
      || plan.sourceCity?.toLowerCase().includes(q)
      || plan.destinationCity?.toLowerCase().includes(q)
      || plan.theme?.toLowerCase().includes(q));
  });

  const SIDEBAR_ITEMS = [
    { id: 'OVERVIEW', icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { id: 'AI_INSIGHTS', icon: <Bot size={18} />, label: 'AI Insights', badge: aiInsights.length },
    { id: 'BUSES', icon: <Bus size={18} />, label: 'Fleet Management', badge: buses.length },
    { id: 'ROUTES', icon: <RouteIcon size={18} />, label: 'Routes & Schedules', badge: schedules.length },
    { id: 'HOLIDAYS', icon: <Palmtree size={18} />, label: 'Holiday Plans', badge: holidayPlans.length },
    { id: 'BOOKINGS', icon: <Ticket size={18} />, label: 'Bookings', badge: bookings.length },
    { id: 'USERS', icon: <Users size={18} />, label: 'Users', badge: users.length },
    { id: 'ANALYTICS', icon: <BarChart3 size={18} />, label: 'Analytics' },
  ];

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem',
    border: '1.5px solid #E2E8F0', borderRadius: '10px',
    fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none',
  };

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 0.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Admin Console</div>
            <div style={{ fontSize: '0.68rem', color: '#F87171', fontWeight: 700 }}>BUSGO FLEET OPS</div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div style={{ margin: '1rem 0.5rem 0', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#F87171', marginBottom: '6px' }}>
              <Bell size={12} /> {notifications.length} Alert{notifications.length > 1 ? 's' : ''}
            </div>
            {notifications.map((n, i) => (
              <div key={i} style={{ fontSize: '0.72rem', color: '#FCA5A5', marginTop: '3px', lineHeight: '1.4' }}>
                • {n.msg}
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <nav style={{ marginTop: '1.25rem', flex: 1 }}>
          <ul className="admin-sidebar-menu">
            {SIDEBAR_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span style={{ background: activeTab === item.id ? '#FF6B35' : 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin Info */}
        <div style={{ padding: '1rem 0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #EF4444, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ padding: '1.75rem', overflowY: 'auto', background: '#F8FAFC' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {activeTab === 'OVERVIEW' && '📊 Platform Overview'}
              {activeTab === 'AI_INSIGHTS' && '🤖 AI Insights & Recommendations'}
              {activeTab === 'BUSES' && '🚌 Fleet Management'}
              {activeTab === 'ROUTES' && '🗺️ Routes & Schedules'}
              {activeTab === 'HOLIDAYS' && '🌴 Holiday Plans'}
              {activeTab === 'BOOKINGS' && '🎫 Bookings Register'}
              {activeTab === 'USERS' && '👥 User Accounts'}
              {activeTab === 'ANALYTICS' && '📈 Revenue Analytics'}
            </h1>
            <p style={{ margin: '2px 0 0', color: '#64748B', fontSize: '0.82rem' }}>
              Synced with MySQL · Last updated just now
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Global Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.55rem 0.85rem 0.55rem 2.1rem', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '0.85rem', width: '210px', outline: 'none', background: '#fff' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '8px', top: '9px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={14} color="#94A3B8" />
                </button>
              )}
            </div>
            <button onClick={fetchAllAdminData} className="btn-outline" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', gap: '1rem' }}>
            <Loader2 size={40} className="animate-spin" color="#2563EB" />
            <p style={{ color: '#64748B', fontWeight: 600 }}>Loading admin data from MySQL...</p>
          </div>
        ) : (
          <>
            {/* ══════════════════ OVERVIEW ══════════════════ */}
            {activeTab === 'OVERVIEW' && (
              <div>
                {/* KPI Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.1rem', marginBottom: '1.75rem' }}>
                  <StatCard
                    icon={<DollarSign size={20} color="#10B981" />}
                    label="Total Revenue" bg="#DCFCE7"
                    value={`₹${stats?.totalRevenue?.toLocaleString('en-IN') || '0'}`}
                    sub="● Live from bookings" subColor="#10B981"
                    trend="+12%" trendUp
                  />
                  <StatCard
                    icon={<Ticket size={20} color="#2563EB" />}
                    label="Total Bookings" bg="#EFF6FF"
                    value={stats?.totalBookings || 0}
                    sub={`${bookings.filter(b => b.bookingStatus === 'CONFIRMED').length} confirmed`}
                    subColor="#2563EB" trend="+8%" trendUp
                    chartData={stats?.revenueTrend}
                  />
                  <StatCard
                    icon={<Bus size={20} color="#FF6B35" />}
                    label="Fleet Size" bg="#FFF7ED"
                    value={`${stats?.totalBuses || 0} Buses`}
                    sub="Active coaches" subColor="#FF6B35"
                  />
                  <StatCard
                    icon={<RouteIcon size={20} color="#06B6D4" />}
                    label="Active Routes" bg="#ECFEFF"
                    value={stats?.totalRoutes || 0}
                    sub={`${schedules.length} schedules`} subColor="#06B6D4"
                  />
                  <StatCard
                    icon={<Users size={20} color="#8B5CF6" />}
                    label="Registered Users" bg="#F5F3FF"
                    value={stats?.totalUsers || 0}
                    sub={`${users.filter(u => u.role === 'ROLE_ADMIN').length} admins`} subColor="#8B5CF6"
                    trend="+5%" trendUp
                  />
                  <StatCard
                    icon={<XCircle size={20} color="#EF4444" />}
                    label="Cancellations" bg="#FEF2F2"
                    value={bookings.filter(b => b.bookingStatus === 'CANCELLED').length}
                    sub="Need refund review" subColor="#EF4444"
                  />
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
                  {/* Revenue Bar Chart */}
                  <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
                        <BarChart3 size={18} color="#2563EB" /> 7-Day Revenue (₹)
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, background: '#DCFCE7', padding: '3px 10px', borderRadius: '9999px' }}>
                        +28% this week
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', paddingTop: '1rem' }}>
                      {stats?.revenueTrend?.map((item, idx) => (
                        <div key={idx} style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>
                            ₹{(item.revenue / 1000).toFixed(0)}k
                          </span>
                          <div
                            title={`₹${item.revenue.toLocaleString('en-IN')}`}
                            style={{
                              height: `${(item.revenue / 55000) * 110}px`,
                              background: idx === 5 || idx === 6
                                ? 'linear-gradient(180deg, #FF6B35, #EA580C)'
                                : 'linear-gradient(180deg, #2563EB, #1D4ED8)',
                              borderRadius: '6px 6px 0 0',
                              width: '70%',
                              transition: 'height 0.4s',
                              cursor: 'pointer',
                              minHeight: '8px',
                            }}
                          />
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Route Popularity */}
                  <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '1.25rem' }}>
                      <PieChart size={18} color="#FF6B35" /> Route Popularity
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {stats?.routePopularity?.map((rp, idx) => {
                        const colors = ['#2563EB', '#FF6B35', '#06B6D4', '#10B981'];
                        return (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                              <span style={{ color: '#334155' }}>{rp.route}</span>
                              <span style={{ color: colors[idx], fontWeight: 800 }}>{rp.share}%</span>
                            </div>
                            <div style={{ height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${rp.share}%`, background: colors[idx], borderRadius: '4px', transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '1.5rem', marginBottom: '1.75rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="#F59E0B" /> Quick Actions
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {[
                      { label: '+ Add Bus', color: '#2563EB', action: () => { setActiveTab('BUSES'); setShowAddBusModal(true); } },
                      { label: '+ Add Route', color: '#10B981', action: () => { setActiveTab('ROUTES'); setShowAddRouteModal(true); } },
                      { label: '+ Add Schedule', color: '#FF6B35', action: () => { setActiveTab('ROUTES'); setShowAddScheduleModal(true); } },
                      { label: '📥 Export Bookings', color: '#8B5CF6', action: () => exportCSV(bookings.map(b => ({ ref: b.bookingReference, user: b.user?.name, route: `${b.schedule?.route?.sourceCity} → ${b.schedule?.route?.destinationCity}`, date: b.journeyDate, amount: b.totalAmount, status: b.bookingStatus })), 'busgo_bookings.csv') },
                      { label: '📥 Export Users', color: '#06B6D4', action: () => exportCSV(users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role })), 'busgo_users.csv') },
                      { label: '🤖 AI Insights', color: '#EF4444', action: () => setActiveTab('AI_INSIGHTS') },
                    ].map((btn, i) => (
                      <button
                        key={i}
                        onClick={btn.action}
                        style={{
                          padding: '0.6rem 1.15rem', borderRadius: '10px',
                          background: btn.color + '15', border: `1.5px solid ${btn.color}40`,
                          color: btn.color, fontWeight: 700, fontSize: '0.85rem',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = btn.color; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = btn.color + '15'; e.currentTarget.style.color = btn.color; }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings preview */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden' }}>
                  <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} color="#2563EB" /> Recent Bookings
                    </div>
                    <button onClick={() => setActiveTab('BOOKINGS')} style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View All <ChevronRight size={14} />
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#64748B' }}>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>PNR</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Passenger</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Route</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Amount</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 800, color: '#2563EB' }}>{b.bookingReference}</td>
                          <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0F172A' }}>{b.user?.name}</td>
                          <td style={{ padding: '10px 16px', color: '#475569' }}>{b.schedule?.route?.sourceCity} → {b.schedule?.route?.destinationCity}</td>
                          <td style={{ padding: '10px 16px', fontWeight: 800 }}>₹{b.totalAmount}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                              background: b.bookingStatus === 'CONFIRMED' ? '#DCFCE7' : '#FEE2E2',
                              color: b.bookingStatus === 'CONFIRMED' ? '#166534' : '#991B1B',
                            }}>
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ AI INSIGHTS ══════════════════ */}
            {activeTab === 'AI_INSIGHTS' && (
              <div>
                <div style={{ background: 'linear-gradient(135deg, #0B132B, #1D4ED8)', borderRadius: '20px', padding: '2rem', marginBottom: '1.75rem', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={24} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>BusGo AI Operations Engine</div>
                      <div style={{ fontSize: '0.82rem', color: '#93C5FD' }}>Analyzing your fleet, routes, bookings & revenue patterns in real-time</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {[
                      { label: 'Data Points Analyzed', value: bookings.length + buses.length + routes.length + users.length },
                      { label: 'Insights Generated', value: aiInsights.length },
                      { label: 'Revenue Optimizations', value: aiInsights.filter(i => i.type === 'positive').length },
                      { label: 'Risk Alerts', value: aiInsights.filter(i => i.type === 'warning').length },
                    ].map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 600 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {aiInsights.map((insight, i) => (
                    <div key={i} style={{
                      background: '#fff', border: `1.5px solid ${insight.type === 'positive' ? '#BBF7D0' : insight.type === 'warning' ? '#FDE68A' : '#BFDBFE'}`,
                      borderRadius: '16px', padding: '1.5rem',
                      borderLeft: `4px solid ${insight.type === 'positive' ? '#10B981' : insight.type === 'warning' ? '#F59E0B' : '#2563EB'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '1.25rem' }}>{insight.icon}</span>
                            <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{insight.title}</span>
                            <span style={{
                              padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 700,
                              background: insight.type === 'positive' ? '#DCFCE7' : insight.type === 'warning' ? '#FEF3C7' : '#EFF6FF',
                              color: insight.type === 'positive' ? '#166534' : insight.type === 'warning' ? '#92400E' : '#1D4ED8',
                            }}>
                              {insight.type === 'positive' ? '📈 Opportunity' : insight.type === 'warning' ? '⚠️ Alert' : 'ℹ️ Info'}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 0.75rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>{insight.desc}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#2563EB' }}>
                            <Lightbulb size={14} /> Recommended Action: {insight.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Performance Summary */}
                <div style={{ marginTop: '1.75rem', background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '1.5rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} color="#F59E0B" /> Fleet Performance Score
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {[
                      { label: 'Route Coverage', score: Math.min(100, (routes.length / 10) * 100), color: '#2563EB' },
                      { label: 'Fleet Utilization', score: Math.min(100, schedules.length > 0 ? (schedules.length / buses.length) * 50 : 0), color: '#10B981' },
                      { label: 'Booking Conversion', score: Math.min(100, users.length > 0 ? (bookings.length / users.length) * 50 : 0), color: '#FF6B35' },
                      { label: 'Revenue Health', score: Math.min(100, stats?.totalRevenue > 0 ? 75 : 20), color: '#8B5CF6' },
                    ].map((m, i) => (
                      <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>{m.label}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: m.color }}>{Math.round(m.score)}%</span>
                        </div>
                        <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${m.score}%`, background: m.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════ BUSES ══════════════════ */}
            {activeTab === 'BUSES' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.88rem', color: '#64748B' }}>
                    Showing <strong>{filteredBuses.length}</strong> of {buses.length} coaches
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => exportCSV(buses, 'busgo_fleet.csv')} className="btn-outline" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                      <Download size={14} /> Export Fleet
                    </button>
                    <button onClick={() => setShowAddBusModal(true)} className="btn-accent" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                      <Plus size={15} /> Add Coach
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
                  {/* Warn about buses without schedules */}
                  {(() => {
                    const scheduledBusIds = new Set(schedules.map(s => s.bus?.id));
                    const unscheduled = filteredBuses.filter(b => !scheduledBusIds.has(b.id));
                    return unscheduled.length > 0 ? (
                      <div style={{ gridColumn: '1 / -1', background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                        <div>
                          <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.92rem', marginBottom: '4px' }}>
                            {unscheduled.length} bus{unscheduled.length > 1 ? 'es are' : ' is'} not visible to users yet
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#78350F', marginBottom: '8px' }}>
                            <strong>{unscheduled.map(b => b.busNumber).join(', ')}</strong> — these buses have no schedule assigned. Users cannot search or book them until you add a schedule (Route + Time + Fare).
                          </div>
                          <button
                            onClick={() => { setActiveTab('ROUTES'); setShowAddScheduleModal(true); }}
                            style={{ background: '#F59E0B', color: '#fff', border: 'none', padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            + Add Schedule Now →
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })()}
                  {filteredBuses.map((b) => (
                    <div key={b.id} style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(15,23,42,0.05)' }}>
                      <div style={{ background: 'linear-gradient(135deg, #0B132B, #1E3A5F)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{b.operatorName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#93C5FD', marginTop: '2px' }}>{b.busNumber}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, background: 'rgba(255,107,53,0.2)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}>
                            {b.busType?.replace('_', ' ')}
                          </span>
                          {/* Show warning badge if this bus has no schedule */}
                          {!schedules.some(s => s.bus?.id === b.id) && (
                            <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(245,158,11,0.25)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.4)' }}>
                              ⚠️ No Schedule
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.6rem' }}>
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Seats</div>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{b.totalSeats} Berths</div>
                          </div>
                          <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.6rem' }}>
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
                            <div style={{ fontWeight: 800, color: '#F59E0B' }}>★ {b.rating}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.85rem' }}>
                          {b.amenities?.split(',').map((a) => (
                            <span key={a} style={{ display: 'inline-block', margin: '2px 4px 2px 0', padding: '2px 8px', background: '#EFF6FF', color: '#2563EB', borderRadius: '9999px', fontWeight: 600 }}>
                              {a.trim()}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleDeleteBus(b.id)} style={{ padding: '6px 12px', borderRadius: '8px', background: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════ ROUTES ══════════════════ */}
            {activeTab === 'ROUTES' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowAddRouteModal(true)} className="btn-outline" style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}>
                    <Plus size={15} /> Add Route
                  </button>
                  <button onClick={() => setShowAddScheduleModal(true)} className="btn-accent" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                    <Plus size={15} /> Add Schedule
                  </button>
                </div>

                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RouteIcon size={16} color="#2563EB" /> Active Schedules ({schedules.length})
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#64748B' }}>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Route</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Bus</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Timings</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Fare</th>
                        <th style={{ padding: '10px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>
                              {s.route?.sourceCity} <span style={{ color: '#FF6B35' }}>→</span> {s.route?.destinationCity}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
                              <MapPin size={10} style={{ marginRight: '3px' }} />{s.boardingPoint}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>
                            <div style={{ fontWeight: 600 }}>{s.bus?.operatorName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{s.bus?.busNumber}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{s.departureTime} → {s.arrivalTime}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#EA580C', fontSize: '1rem' }}>₹{s.fare}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button onClick={() => handleDeleteSchedule(s.id)} style={{ padding: '5px 10px', borderRadius: '7px', background: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Routes table */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.5rem', background: '#F8FAFC', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#10B981" /> Route Corridors ({routes.length})
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#64748B' }}>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Corridor</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Distance</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Duration</th>
                        <th style={{ padding: '10px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                          <td style={{ padding: '10px 16px', fontWeight: 800, color: '#0F172A' }}>
                            {r.sourceCity} → {r.destinationCity}
                          </td>
                          <td style={{ padding: '10px 16px', color: '#475569' }}>{r.distanceKm} km</td>
                          <td style={{ padding: '10px 16px', color: '#475569' }}>{r.estimatedDurationHours}h</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                            <button onClick={() => handleDeleteRoute(r.id)} style={{ padding: '5px 10px', borderRadius: '7px', background: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ HOLIDAY PLANS ══════════════════ */}
            {activeTab === 'HOLIDAYS' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'ALL', label: `All plans (${holidayPlans.length})` },
                      { id: 'PUBLISHED', label: `Published (${holidayPlans.filter((plan) => plan.published).length})` },
                      { id: 'DRAFT', label: `Drafts (${holidayPlans.filter((plan) => !plan.published).length})` },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setHolidayPlanFilter(filter.id)}
                        style={{
                          padding: '0.55rem 0.85rem',
                          borderRadius: '9999px',
                          border: `1px solid ${holidayPlanFilter === filter.id ? '#2563EB' : '#E2E8F0'}`,
                          background: holidayPlanFilter === filter.id ? '#EFF6FF' : '#fff',
                          color: holidayPlanFilter === filter.id ? '#1D4ED8' : '#64748B',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => openHolidayPlanForm()}
                    className="btn-accent"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.84rem' }}
                  >
                    <Plus size={15} /> Create Holiday Plan
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', gap: '1rem' }}>
                  {filteredHolidayPlans.map((plan) => (
                    <article key={plan.id} style={{
                      background: '#fff',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
                    }}>
                      <div style={{
                        height: '130px',
                        background: plan.image
                          ? `linear-gradient(180deg,rgba(7,11,25,.05),rgba(7,11,25,.6)),url("${plan.image}") center/cover`
                          : 'linear-gradient(135deg,#0F766E,#0E7490 48%,#1D4ED8)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        padding: '0.8rem',
                      }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.82rem' }}>{plan.theme}</span>
                        <span style={{
                          padding: '4px 9px',
                          borderRadius: '9999px',
                          background: plan.published ? '#DCFCE7' : '#FEF3C7',
                          color: plan.published ? '#166534' : '#92400E',
                          fontWeight: 800,
                          fontSize: '0.66rem',
                        }}>
                          {plan.published ? 'LIVE TO USERS' : 'DRAFT'}
                        </span>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ color: '#2563EB', fontWeight: 800, fontSize: '0.73rem' }}>
                          {plan.sourceCity} <span style={{ color: '#FF6B35' }}>→</span> {plan.destinationCity}
                        </div>
                        <h3 style={{ margin: '0.3rem 0', color: '#0F172A', fontSize: '1.05rem' }}>{plan.name}</h3>
                        <p style={{ minHeight: '40px', color: '#64748B', fontSize: '0.78rem', lineHeight: 1.45 }}>
                          {plan.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.8rem 0', paddingTop: '0.7rem', borderTop: '1px solid #F1F5F9' }}>
                          <span style={{ color: '#64748B', fontSize: '0.74rem' }}>{plan.duration}</span>
                          <strong style={{ color: '#EA580C' }}>Bus fare from ₹{Number(plan.fare).toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          <button
                            type="button"
                            onClick={() => openHolidayPlanForm(plan)}
                            className="btn-outline"
                            style={{ flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleHolidayPlan(plan)}
                            className="btn-outline"
                            style={{ flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.75rem', color: plan.published ? '#B45309' : '#047857' }}
                          >
                            {plan.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHolidayPlan(plan)}
                            aria-label={`Delete ${plan.name}`}
                            style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', background: '#FEF2F2', color: '#DC2626' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {filteredHolidayPlans.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', border: '1.5px dashed #CBD5E1', borderRadius: '16px', textAlign: 'center', background: '#fff' }}>
                      <Palmtree size={30} color="#10B981" style={{ margin: '0 auto 0.75rem' }} />
                      <h3 style={{ color: '#0F172A', marginBottom: '0.35rem' }}>No holiday plans in this view</h3>
                      <p style={{ color: '#64748B', fontSize: '0.84rem' }}>Create a plan, then publish it when it is ready for users.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════ BOOKINGS ══════════════════ */}
            {activeTab === 'BOOKINGS' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Status Filter Tabs */}
                  <div style={{ display: 'flex', gap: '6px', background: '#E2E8F0', padding: '4px', borderRadius: '10px' }}>
                    {['ALL', 'CONFIRMED', 'CANCELLED'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setBookingFilter(f)}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                          background: bookingFilter === f ? '#fff' : 'transparent',
                          color: bookingFilter === f ? '#0F172A' : '#64748B',
                          border: 'none', boxShadow: bookingFilter === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        }}
                      >
                        {f} ({f === 'ALL' ? bookings.length : bookings.filter(b => b.bookingStatus === f).length})
                      </button>
                    ))}
                  </div>
                  <button onClick={() => exportCSV(filteredBookings.map(b => ({ ref: b.bookingReference, user: b.user?.name, from: b.schedule?.route?.sourceCity, to: b.schedule?.route?.destinationCity, date: b.journeyDate, seats: b.seatNumbers, amount: b.totalAmount, status: b.bookingStatus, cancellationReason: b.cancellationReason, cancellationDetails: b.cancellationReasonDetails })), 'bookings_export.csv')} className="btn-outline" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                    <Download size={14} /> Export CSV
                  </button>
                </div>

                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#64748B' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>PNR</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Passenger</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Route & Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Seats</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #F8FAFC' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#2563EB' }}>{b.bookingReference}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{b.user?.name}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 700 }}>{b.schedule?.route?.sourceCity} → {b.schedule?.route?.destinationCity}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{b.journeyDate}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#EA580C' }}>{b.seatNumbers}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 800 }}>₹{b.totalAmount}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                              background: b.bookingStatus === 'CONFIRMED' ? '#DCFCE7' : '#FEE2E2',
                              color: b.bookingStatus === 'CONFIRMED' ? '#166534' : '#991B1B',
                            }}>
                              {b.bookingStatus === 'CONFIRMED' ? '● CONFIRMED' : '● CANCELLED'}
                            </span>
                            {b.cancellationReason && (
                              <div style={{ marginTop: '5px', maxWidth: '190px', color: '#64748B', fontSize: '0.72rem', lineHeight: 1.4 }}>
                                Reason: {b.cancellationReason.replaceAll('_', ' ').toLowerCase()}
                                {b.cancellationReasonDetails && <div>{b.cancellationReasonDetails}</div>}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No bookings found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ USERS ══════════════════ */}
            {activeTab === 'USERS' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                  <button onClick={() => exportCSV(users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role })), 'users_export.csv')} className="btn-outline" style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
                    <Download size={14} /> Export Users
                  </button>
                </div>
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#64748B' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>#</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Phone</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Role</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left' }}>Bookings</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const userBookings = bookings.filter(b => b.user?.id === u.id);
                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid #F8FAFC' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '12px 16px', color: '#94A3B8', fontWeight: 700 }}>#{u.id}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '32px', height: '32px', borderRadius: '50%',
                                  background: u.role === 'ROLE_ADMIN' ? 'linear-gradient(135deg, #EF4444, #F59E0B)' : 'linear-gradient(135deg, #2563EB, #06B6D4)',
                                  color: '#fff', fontWeight: 800, fontSize: '0.85rem',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  {u.name?.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 700, color: '#0F172A' }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{u.email}</td>
                            <td style={{ padding: '12px 16px', color: '#475569' }}>{u.phone || '—'}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800,
                                background: u.role === 'ROLE_ADMIN' ? '#FEE2E2' : '#EFF6FF',
                                color: u.role === 'ROLE_ADMIN' ? '#991B1B' : '#1D4ED8',
                              }}>
                                {u.role === 'ROLE_ADMIN' ? '🔴 ADMIN' : '🔵 USER'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                              {userBookings.length} trip{userBookings.length !== 1 ? 's' : ''}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => handleToggleRole(u.id)}
                                style={{
                                  padding: '5px 12px', borderRadius: '8px',
                                  background: '#F1F5F9', border: '1px solid #CBD5E1',
                                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '5px',
                                }}
                              >
                                {u.role === 'ROLE_ADMIN' ? <ToggleRight size={14} color="#EF4444" /> : <ToggleLeft size={14} color="#2563EB" />}
                                Toggle Role
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════ ANALYTICS ══════════════════ */}
            {activeTab === 'ANALYTICS' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem', marginBottom: '1.75rem' }}>
                  <StatCard icon={<DollarSign size={20} color="#10B981" />} label="Avg Ticket Value" bg="#DCFCE7"
                    value={`₹${stats?.totalBookings > 0 ? Math.round(stats.totalRevenue / stats.totalBookings) : 0}`}
                    sub="Per booking" subColor="#10B981" />
                  <StatCard icon={<TrendingUp size={20} color="#2563EB" />} label="Confirmed Rate" bg="#EFF6FF"
                    value={`${bookings.length > 0 ? Math.round((bookings.filter(b => b.bookingStatus === 'CONFIRMED').length / bookings.length) * 100) : 0}%`}
                    sub="Booking success rate" subColor="#2563EB" trend="+3%" trendUp />
                  <StatCard icon={<TrendingDown size={20} color="#EF4444" />} label="Cancellation Rate" bg="#FEF2F2"
                    value={`${bookings.length > 0 ? Math.round((bookings.filter(b => b.bookingStatus === 'CANCELLED').length / bookings.length) * 100) : 0}%`}
                    sub="Industry avg: 12%" subColor="#EF4444" />
                  <StatCard icon={<Users size={20} color="#8B5CF6" />} label="Users per Bus" bg="#F5F3FF"
                    value={buses.length > 0 ? Math.round(users.length / buses.length) : 0}
                    sub="Demand ratio" subColor="#8B5CF6" />
                </div>

                {/* Revenue breakdown */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={18} color="#2563EB" /> Weekly Revenue Breakdown
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px' }}>
                    {stats?.revenueTrend?.map((item, idx) => (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>₹{(item.revenue / 1000).toFixed(0)}k</span>
                        <div
                          style={{
                            width: '100%', borderRadius: '6px 6px 0 0',
                            height: `${(item.revenue / 55000) * 140}px`,
                            background: idx === 5 || idx === 6 ? 'linear-gradient(180deg,#FF6B35,#EA580C)' : 'linear-gradient(180deg,#2563EB,#1D4ED8)',
                            minHeight: '8px', transition: 'height 0.5s',
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>{item.day}</span>
                          <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{item.bookings} trips</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top routes by revenue */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '1.5rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} color="#F59E0B" /> Top Routes by Revenue Share
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats?.routePopularity?.map((rp, idx) => {
                      const colors = ['#2563EB', '#FF6B35', '#06B6D4', '#10B981'];
                      const estRevenue = ((rp.share / 100) * (stats?.totalRevenue || 0)).toFixed(0);
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: colors[idx] + '20', color: colors[idx], fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '5px' }}>
                              <span style={{ color: '#0F172A' }}>{rp.route}</span>
                              <span style={{ color: colors[idx] }}>₹{Number(estRevenue).toLocaleString('en-IN')} ({rp.share}%)</span>
                            </div>
                            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${rp.share}%`, background: colors[idx], borderRadius: '4px', transition: 'width 0.6s' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ══════════════════ MODALS ══════════════════ */}

      {showHolidayPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '760px', padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
            <div style={{ padding: '1.3rem 1.6rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg,#0B132B,#1D4ED8)', borderRadius: '20px 20px 0 0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                  <Palmtree size={19} /> {editingHolidayPlan ? 'Edit Holiday Plan' : 'Create Holiday Plan'}
                </div>
                <div style={{ color: '#BFDBFE', fontSize: '0.76rem', marginTop: '3px' }}>
                  Published plans appear on the public Holiday Trips page.
                </div>
              </div>
              <button type="button" onClick={() => setShowHolidayPlanModal(false)} aria-label="Close holiday plan form" style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '6px' }}>
                <X size={19} color="#fff" />
              </button>
            </div>

            <form onSubmit={handleSaveHolidayPlan} style={{ overflowY: 'auto', padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="holiday-plan-form-grid">
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Plan title *
                  <input
                    value={holidayPlanForm.name}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, name: e.target.value })}
                    required
                    maxLength={120}
                    placeholder="e.g. Goa coast & slow mornings"
                    style={{ ...inputStyle, marginTop: '5px' }}
                  />
                </label>
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Holiday theme *
                  <select value={holidayPlanForm.theme} onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, theme: e.target.value })} required style={{ ...inputStyle, marginTop: '5px', background: '#fff' }}>
                    {['Beach', 'Culture', 'City break', 'Food & culture', 'Adventure', 'Nature', 'Spiritual', 'Family'].map((theme) => <option key={theme}>{theme}</option>)}
                  </select>
                </label>
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Starting city *
                  <input
                    value={holidayPlanForm.sourceCity}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, sourceCity: e.target.value })}
                    required
                    maxLength={100}
                    placeholder="Mumbai"
                    style={{ ...inputStyle, marginTop: '5px' }}
                  />
                </label>
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Destination city *
                  <input
                    value={holidayPlanForm.destinationCity}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, destinationCity: e.target.value })}
                    required
                    maxLength={100}
                    placeholder="Goa"
                    style={{ ...inputStyle, marginTop: '5px' }}
                  />
                </label>
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Trip duration *
                  <input
                    value={holidayPlanForm.duration}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, duration: e.target.value })}
                    required
                    maxLength={80}
                    placeholder="3 days · 2 nights"
                    style={{ ...inputStyle, marginTop: '5px' }}
                  />
                </label>
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Indicative bus fare (₹) *
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={holidayPlanForm.fare}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, fare: e.target.value })}
                    required
                    style={{ ...inputStyle, marginTop: '5px' }}
                  />
                </label>
              </div>

              <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                Image URL (optional)
                <input
                  type="text"
                  value={holidayPlanForm.image}
                  onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, image: e.target.value })}
                  maxLength={1000}
                  placeholder="/images/hero-bus.jpg or https://..."
                  style={{ ...inputStyle, marginTop: '5px' }}
                />
              </label>

              <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                Short description *
                <textarea
                  value={holidayPlanForm.description}
                  onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, description: e.target.value })}
                  required
                  maxLength={2000}
                  rows={3}
                  placeholder="Describe the trip idea for travelers."
                  style={{ ...inputStyle, marginTop: '5px', resize: 'vertical' }}
                />
              </label>

              <div className="holiday-plan-form-grid">
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Trip highlights * <span style={{ color: '#94A3B8', fontWeight: 500 }}>(one per line)</span>
                  <textarea
                    value={holidayPlanForm.highlights.join('\n')}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, highlights: e.target.value.split(/\r?\n/) })}
                    required
                    rows={5}
                    placeholder={'Sunset at the shore\nHeritage walk\nLocal food'}
                    style={{ ...inputStyle, marginTop: '5px', resize: 'vertical' }}
                  />
                </label>
                <label style={{ color: '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                  Suggested itinerary * <span style={{ color: '#94A3B8', fontWeight: 500 }}>(one step per line)</span>
                  <textarea
                    value={holidayPlanForm.itinerary.join('\n')}
                    onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, itinerary: e.target.value.split(/\r?\n/) })}
                    required
                    rows={5}
                    placeholder={'Day 1 · Arrive and explore\nDay 2 · Visit local sights'}
                    style={{ ...inputStyle, marginTop: '5px', resize: 'vertical' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '0.8rem 0.9rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', color: '#334155', fontSize: '0.82rem', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={holidayPlanForm.published}
                  onChange={(e) => setHolidayPlanForm({ ...holidayPlanForm, published: e.target.checked })}
                />
                Publish this plan so users can see it
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.7rem', paddingTop: '0.35rem' }}>
                <button type="button" onClick={() => setShowHolidayPlanModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-accent">{editingHolidayPlan ? 'Save Changes' : 'Create Plan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bus */}
      {showAddBusModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #0B132B, #1D4ED8)', borderRadius: '20px 20px 0 0' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>🚌 Add New Coach</div>
                <div style={{ color: '#93C5FD', fontSize: '0.78rem', marginTop: '2px' }}>Fill all sections to register a new bus on BusGo</div>
              </div>
              <button onClick={() => setShowAddBusModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                <X size={20} color="#fff" />
              </button>
            </div>

            <form onSubmit={handleAddBus} style={{ overflowY: 'auto', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

              {/* ── Section 1: Core Identity ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #EFF6FF' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>1</div>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>Core Identity</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Registration Number *</label>
                    <input value={newBus.busNumber} onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })} required placeholder="MH-04-BG-8008" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Operator / Company Name *</label>
                    <input value={newBus.operatorName} onChange={(e) => setNewBus({ ...newBus, operatorName: e.target.value })} required placeholder="e.g. Zingbus Premium" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Bus Type *</label>
                    <select value={newBus.busType} onChange={(e) => setNewBus({ ...newBus, busType: e.target.value,
                      hasAC: e.target.value.startsWith('AC'),
                      hasSleeper: e.target.value.includes('SLEEPER'),
                      hasSeater: e.target.value.includes('SEATER'),
                    })} style={inputStyle}>
                      <option value="AC_SLEEPER">AC Sleeper (2+1)</option>
                      <option value="AC_SEATER">AC Seater (2+2)</option>
                      <option value="NON_AC_SLEEPER">Non-AC Sleeper</option>
                      <option value="NON_AC_SEATER">Non-AC Seater</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Total Seats *</label>
                    <input type="number" min="10" max="60" value={newBus.totalSeats} onChange={(e) => setNewBus({ ...newBus, totalSeats: Number(e.target.value) })} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Initial Rating</label>
                    <input type="number" step="0.1" min="1" max="5" value={newBus.rating || 4.5} onChange={(e) => setNewBus({ ...newBus, rating: Number(e.target.value) })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Reviews Count</label>
                    <input type="number" min="0" value={newBus.reviewsCount || 0} onChange={(e) => setNewBus({ ...newBus, reviewsCount: Number(e.target.value) })} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* ── Section 2: Brand & Company ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FFF7ED' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>2</div>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>Brand & Company Info</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Brand Name</label>
                    <input value={newBus.brandName || ''} onChange={(e) => setNewBus({ ...newBus, brandName: e.target.value })} placeholder="e.g. Zingbus, VRL, SRS" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Established Year</label>
                    <input value={newBus.establishedYear || ''} onChange={(e) => setNewBus({ ...newBus, establishedYear: e.target.value })} placeholder="e.g. 2018" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Company Phone</label>
                    <input value={newBus.companyPhone || ''} onChange={(e) => setNewBus({ ...newBus, companyPhone: e.target.value })} placeholder="+91 98765 43210" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Company Email</label>
                    <input type="email" value={newBus.companyEmail || ''} onChange={(e) => setNewBus({ ...newBus, companyEmail: e.target.value })} placeholder="support@operator.com" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Company Website</label>
                    <input value={newBus.companyWebsite || ''} onChange={(e) => setNewBus({ ...newBus, companyWebsite: e.target.value })} placeholder="https://zingbus.com" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* ── Section 3: Bus Specs ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #ECFDF5' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>3</div>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>Bus Specifications</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Bus Model</label>
                    <select value={newBus.busModel || ''} onChange={(e) => setNewBus({ ...newBus, busModel: e.target.value })} style={inputStyle}>
                      <option value="">-- Select Model --</option>
                      <option value="Volvo 9600">Volvo 9600</option>
                      <option value="Volvo 9400">Volvo 9400</option>
                      <option value="Scania Metrolink">Scania Metrolink</option>
                      <option value="Mercedes-Benz OC500">Mercedes-Benz OC500</option>
                      <option value="Isuzu NQR">Isuzu NQR</option>
                      <option value="SML Isuzu Falcon">SML Isuzu Falcon</option>
                      <option value="Tata Starbus">Tata Starbus</option>
                      <option value="Ashok Leyland Viking">Ashok Leyland Viking</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Engine Type</label>
                    <select value={newBus.engineType || ''} onChange={(e) => setNewBus({ ...newBus, engineType: e.target.value })} style={inputStyle}>
                      <option value="">-- Select Engine --</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="CNG">CNG</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Bus Age (Years)</label>
                    <input type="number" min="0" max="20" value={newBus.busAgeYears || ''} onChange={(e) => setNewBus({ ...newBus, busAgeYears: Number(e.target.value) })} placeholder="e.g. 2" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Avg Speed (km/h)</label>
                    <input type="number" value={newBus.averageSpeedKmh || ''} onChange={(e) => setNewBus({ ...newBus, averageSpeedKmh: Number(e.target.value) })} placeholder="e.g. 65" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Amenities (comma-separated)</label>
                    <input value={newBus.amenities} onChange={(e) => setNewBus({ ...newBus, amenities: e.target.value })} placeholder="WiFi,AC,Blanket,Water Bottle,Reading Light,GPS" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* ── Section 4: Comfort Features (Toggles) ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F5F3FF' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>4</div>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>Comfort & Safety Features</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {[
                    { key: 'hasAC', label: '❄️ Air Conditioning' },
                    { key: 'hasSleeper', label: '🛏️ Sleeper Berths' },
                    { key: 'hasSeater', label: '💺 Seater Chairs' },
                    { key: 'hasWifi', label: '📶 WiFi' },
                    { key: 'hasChargingPoint', label: '🔌 Charging Ports' },
                    { key: 'hasGPS', label: '📍 GPS Tracking' },
                    { key: 'hasCCTV', label: '📹 CCTV Camera' },
                    { key: 'hasReadingLight', label: '💡 Reading Light' },
                    { key: 'hasBlanketPillow', label: '🛌 Blanket & Pillow' },
                    { key: 'hasWaterBottle', label: '💧 Water Bottle' },
                    { key: 'hasEmergencySOS', label: '🆘 Emergency SOS' },
                    { key: 'hasLadiesSeat', label: '👩 Ladies Seat' },
                    { key: 'hasPanicButton', label: '🚨 Panic Button' },
                    { key: 'hasLiveTracking', label: '🗺️ Live Tracking' },
                    { key: 'hasCleanWashroom', label: '🚻 Clean Washroom' },
                  ].map((feat) => (
                    <label key={feat.key} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '0.6rem 0.75rem', borderRadius: '10px', cursor: 'pointer',
                      background: newBus[feat.key] ? '#EFF6FF' : '#F8FAFC',
                      border: `1.5px solid ${newBus[feat.key] ? '#BFDBFE' : '#E2E8F0'}`,
                      transition: 'all 0.15s',
                    }}>
                      <input
                        type="checkbox"
                        checked={!!newBus[feat.key]}
                        onChange={(e) => setNewBus({ ...newBus, [feat.key]: e.target.checked })}
                        style={{ accentColor: '#2563EB', width: '15px', height: '15px' }}
                      />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: newBus[feat.key] ? '#1D4ED8' : '#64748B' }}>
                        {feat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Section 5: Safety & Compliance ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #FEF2F2' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>5</div>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>Safety & Compliance</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Insurance Provider</label>
                    <input value={newBus.insuranceProvider || ''} onChange={(e) => setNewBus({ ...newBus, insuranceProvider: e.target.value })} placeholder="e.g. New India Assurance" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Permit Number</label>
                    <input value={newBus.permitNumber || ''} onChange={(e) => setNewBus({ ...newBus, permitNumber: e.target.value })} placeholder="MH/TC/2023/12345" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Last Service Date</label>
                    <input type="date" value={newBus.lastServiceDate || ''} onChange={(e) => setNewBus({ ...newBus, lastServiceDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Bus Color / Livery</label>
                    <input value={newBus.busColor || ''} onChange={(e) => setNewBus({ ...newBus, busColor: e.target.value })} placeholder="e.g. Orange & White" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <button type="button" onClick={() => setShowAddBusModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-accent" style={{ padding: '0.75rem 2rem' }}>
                  🚌 Register Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Route */}
      {showAddRouteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>🗺️ Add Route Corridor</h3>
              <button onClick={() => setShowAddRouteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
            </div>
            <form onSubmit={handleAddRoute} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>From City *</label>
                  <input value={newRoute.sourceCity} onChange={(e) => setNewRoute({ ...newRoute, sourceCity: e.target.value })} required placeholder="Mumbai" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>To City *</label>
                  <input value={newRoute.destinationCity} onChange={(e) => setNewRoute({ ...newRoute, destinationCity: e.target.value })} required placeholder="Pune" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Distance (km) *</label>
                  <input type="number" value={newRoute.distanceKm} onChange={(e) => setNewRoute({ ...newRoute, distanceKm: Number(e.target.value) })} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Duration (hrs) *</label>
                  <input type="number" step="0.5" value={newRoute.estimatedDurationHours} onChange={(e) => setNewRoute({ ...newRoute, estimatedDurationHours: Number(e.target.value) })} required style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddRouteModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-accent">Save Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Schedule */}
      {showAddScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>📅 Schedule Departure</h3>
              <button onClick={() => setShowAddScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
            </div>

            {/* ── WHY THIS MATTERS banner ── */}
            <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#1D4ED8' }}>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>⚠️ A bus ONLY appears in user search after you add a schedule.</div>
              <div style={{ color: '#3B82F6', lineHeight: '1.5' }}>
                A schedule links a <strong>Bus</strong> + <strong>Route</strong> + <strong>Departure time</strong> + <strong>Fare</strong>.
                Without this, users cannot find or book the bus.
              </div>
            </div>

            <form onSubmit={handleAddSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Select Route *</label>
                <select value={newSchedule.routeId} onChange={(e) => setNewSchedule({ ...newSchedule, routeId: e.target.value })} required style={inputStyle}>
                  <option value="">-- Choose Route --</option>
                  {routes.map((r) => <option key={r.id} value={r.id}>{r.sourceCity} → {r.destinationCity}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Select Bus *</label>
                <select value={newSchedule.busId} onChange={(e) => setNewSchedule({ ...newSchedule, busId: e.target.value })} required style={inputStyle}>
                  <option value="">-- Choose Bus --</option>
                  {buses.map((b) => <option key={b.id} value={b.id}>{b.operatorName} ({b.busNumber})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Departure Time *</label>
                  <input value={newSchedule.departureTime} onChange={(e) => setNewSchedule({ ...newSchedule, departureTime: e.target.value })} required placeholder="09:00 PM" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Arrival Time *</label>
                  <input value={newSchedule.arrivalTime} onChange={(e) => setNewSchedule({ ...newSchedule, arrivalTime: e.target.value })} required placeholder="06:00 AM" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Boarding Point</label>
                  <input value={newSchedule.boardingPoint} onChange={(e) => setNewSchedule({ ...newSchedule, boardingPoint: e.target.value })} placeholder="Borivali / Dadar" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Dropping Point</label>
                  <input value={newSchedule.droppingPoint} onChange={(e) => setNewSchedule({ ...newSchedule, droppingPoint: e.target.value })} placeholder="Swargate / Pune Station" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>Fare (₹) *</label>
                <input type="number" value={newSchedule.fare} onChange={(e) => setNewSchedule({ ...newSchedule, fare: Number(e.target.value) })} required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddScheduleModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-accent">Confirm Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
