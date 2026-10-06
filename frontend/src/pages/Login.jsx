import { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });

    setServerError('');
    setSuccessMessage('');
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email.trim(),
          password: formData.password,
          remember: formData.remember,
      });

      const data = response.data;

      // MAKE SURE TOKEN EXISTS
      if (!data.token) {
        setServerError(
          'Login was successful, but no authentication token was received.'
        );
        return;
      }

      login(data.user, data.token, formData.remember);

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================
      setSuccessMessage(data.message || 'Login successful!');

      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Unable to connect to the server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ================= LEFT BRANDING ================= */}
      <div className="login-brand-section">
        <div className="login-brand-content">
          <Link to="/" className="login-logo">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" width="34" height="34" role="img">
                <defs>
                  <linearGradient id="chGradLogin" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <rect
                  x="2"
                  y="2"
                  width="36"
                  height="36"
                  rx="10"
                  fill="url(#chGradLogin)"
                />
                <path
                  d="M13 22c0-4 3-7 7-7s7 3 7 7"
                  stroke="#fff"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="13" r="3.4" fill="#fff" />
              </svg>
            </span>
            <span className="login-logo-text">
              Comrade<span>Hub</span>
            </span>
          </Link>

          <div className="login-brand-text">
            <span className="login-badge">🎓 WELCOME BACK, COMRADE</span>

            <h1>
              Everything you need,
              <span> right where you left it.</span>
            </h1>

            <p>
              Sign in to continue buying, selling, finding accommodation,
              discovering services and connecting with your campus community.
            </p>
          </div>

          {/* ================= BENEFITS ================= */}
          <div className="login-benefits">
            <div className="login-benefit">
              <div className="benefit-icon">🛒</div>
              <div>
                <h3>Marketplace</h3>
                <p>Buy and sell products with fellow comrades.</p>
              </div>
            </div>

            <div className="login-benefit">
              <div className="benefit-icon">🏠</div>
              <div>
                <h3>Find Accommodation</h3>
                <p>Discover rooms, hostels and houses near campus.</p>
              </div>
            </div>

            <div className="login-benefit">
              <div className="benefit-icon">🤝</div>
              <div>
                <h3>Connect</h3>
                <p>Connect directly with sellers and service providers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT LOGIN SECTION ================= */}
      <div className="login-form-section">
        <div className="login-card">
          {/* ================= MOBILE LOGO ================= */}
          <Link to="/" className="mobile-login-logo">
            Comrade<span>Hub</span>
          </Link>

          {/* ================= HEADER ================= */}
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your ComradeHub account</p>
          </div>

          {/* ================= SERVER ERROR ================= */}
          {serverError && (
            <div className="form-message error-message">{serverError}</div>
          )}

          {/* ================= SUCCESS MESSAGE ================= */}
          {successMessage && (
            <div className="form-message success-message">{successMessage}</div>
          )}

          {/* ================= LOGIN FORM ================= */}
          <form onSubmit={handleSubmit}>
            {/* ================= EMAIL ================= */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className={`input-wrapper ${errors.email ? 'input-error' : ''}`}>
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>

              {errors.email && (
                <small className="error-message">{errors.email}</small>
              )}
            </div>

            {/* ================= PASSWORD ================= */}
            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {errors.password && (
                <small className="error-message">{errors.password}</small>
              )}
            </div>

            {/* ================= REMEMBER ME ================= */}
            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* ================= LOGIN BUTTON ================= */}
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  Sign In <span>→</span>
                </>
              )}
            </button>

            {/* ================= DIVIDER ================= */}
            <div className="login-divider">
              <span>OR</span>
            </div>

            {/* ================= REGISTER ================= */}
            <div className="register-prompt">
              <p>Don't have a ComradeHub account?</p>
              <Link to="/register">Create an account</Link>
            </div>
          </form>

          {/* ================= SECURITY ================= */}
          <div className="login-security">
            <span>🔐</span>
            <p>Your account information is securely protected.</p>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="login-footer">
          <Link to="/">← Back to ComradeHub</Link>
          <span>© 2026 ComradeHub</span>
        </div>
      </div>
    </div>
  );
}

export default Login;