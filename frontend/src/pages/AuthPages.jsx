import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bus, Lock, Mail, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 76px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #070B19 0%, #0B132B 100%)',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem auto', width: '50px', height: '50px' }}>
            <Bus size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Sign In to Bus<span style={{ color: '#FF6B35' }}>Go</span>
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>
            Enter your credentials to manage your journeys and tickets
          </p>
        </div>

        {/* Demo Credentials Quick Buttons for College Viva */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: '12px',
          padding: '0.85rem',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
        }}>
          <strong style={{ color: '#1E40AF', display: 'block', marginBottom: '6px' }}>
            🎓 Quick Demo Evaluator Logins:
          </strong>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillCredentials('user@busgo.com', 'user123')}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: '6px',
                background: '#fff',
                border: '1px solid #93C5FD',
                color: '#1D4ED8',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.78rem',
              }}
            >
              Fill Passenger
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@busgo.com', 'admin123')}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: '6px',
                background: '#fff',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.78rem',
              }}
            >
              Fill Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                }}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '13px',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent"
            style={{
              padding: '0.85rem',
              fontSize: '1rem',
              borderRadius: '12px',
              marginTop: '0.5rem',
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In to Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#64748B' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#2563EB', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password strength check
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '#E2E8F0' };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
    if (score <= 3) return { score, label: 'Moderate', color: '#F59E0B' };
    return { score, label: 'Strong', color: '#10B981' };
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await register(name, email, password, phone);
      showToast(`Account created! Welcome to BusGo, ${user.name}.`, 'success');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 76px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #070B19 0%, #0B132B 100%)',
      padding: '2.5rem 1rem',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem auto', width: '50px', height: '50px' }}>
            <Bus size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Join Bus<span style={{ color: '#FF6B35' }}>Go</span>
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>
            Create an account to book tickets with zero convenience fee
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Yuvraj Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                }}
              />
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="yuvraj@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Mobile Phone
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                }}
              />
              <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  boxSizing: 'border-box',
                }}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '15px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '13px',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(strength.score / 4) * 100}%`,
                    background: strength.color,
                    transition: 'all 0.3s',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '3px', color: '#64748B' }}>
                  <span>Strength: <strong style={{ color: strength.color }}>{strength.label}</strong></span>
                  <span>Min 6 characters</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent"
            style={{
              padding: '0.85rem',
              fontSize: '1rem',
              borderRadius: '12px',
              marginTop: '0.5rem',
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Register & Start Booking'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563EB', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
