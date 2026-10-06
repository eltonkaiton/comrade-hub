import { useState } from 'react';
import './Register.css';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'Comrade',
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear messages when user starts editing
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check password length
    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    // Check terms
    if (!formData.agree) {
      setError('Please accept the Terms and Privacy Policy.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'https://comradehub-api.onrender.com/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }

      // Save authentication information
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess(data.message || 'Account created successfully!');

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        accountType: 'Comrade',
        agree: false,
      });

      console.log('Registration successful:', data);

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);

    } catch (error) {
      console.error('Registration error:', error);

      setError(
        'Unable to connect to the server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Section */}
      <section className="register-info">

        <div className="brand">
          Comrade<span>Hub</span>
        </div>

        <div className="info-content">

          <span className="info-badge">
            🎓 WELCOME TO COMRADEHUB
          </span>

          <h1>
            Everything Comrades Need,
            <span> In One Place.</span>
          </h1>

          <p>
            Join a growing community where students and businesses
            can buy, sell, find houses, discover transport, advertise
            services and connect directly.
          </p>

          <div className="benefits">

            <div className="benefit">
              <div className="benefit-icon">🛒</div>

              <div>
                <h3>Buy & Sell</h3>
                <p>
                  Find great products or sell what you no longer need.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">🏠</div>

              <div>
                <h3>Find Accommodation</h3>
                <p>
                  Discover available houses and hostels near campus.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">🚌</div>

              <div>
                <h3>Find Transport</h3>
                <p>
                  Connect with motorists and transport providers.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="info-footer">
          © 2026 ComradeHub. Built for the community.
        </div>

      </section>

      {/* Registration Section */}
      <section className="register-section">

        <div className="register-card">

          <div className="form-header">
            <h2>Create your account</h2>

            <p>
              Join ComradeHub and start connecting with your community.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="form-message error-message">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="form-message success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="form-row">

              <div className="form-group">
                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Email */}
            <div className="form-group">

              <label>Email Address</label>

              <div className="input-with-icon">

                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Phone */}
            <div className="form-group">

              <label>Phone Number</label>

              <div className="input-with-icon">

                <span>📱</span>

                <input
                  type="tel"
                  name="phone"
                  placeholder="07XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Account Type */}
            <div className="form-group">

              <label>Account Type</label>

              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="Comrade">
                  Comrade / Customer
                </option>

                <option value="Seller">
                  Seller
                </option>

                <option value="Landlord">
                  Landlord / Agent
                </option>

                <option value="Motorist">
                  Motorist / Transport Provider
                </option>

                <option value="Business">
                  Business
                </option>
              </select>

              <small>
                You can access more services based on your account type.
              </small>

            </div>

            {/* Password */}
            <div className="form-group">

              <label>Password</label>

              <div className="password-input">

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>

              </div>

              <small>
                Password must contain at least 8 characters.
              </small>

            </div>

            {/* Confirm Password */}
            <div className="form-group">

              <label>Confirm Password</label>

              <div className="password-input">

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>

              </div>

            </div>

            {/* Terms */}
            <label className="terms">

              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />

              <span>
                I agree to the{' '}
                <a href="/terms">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy">Privacy Policy</a>.
              </span>

            </label>

            {/* Submit */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="login-link">

            Already have an account?

            <a href="/login"> Sign in</a>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;
