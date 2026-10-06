import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

// =====================================================
// LOGO COMPONENT
// =====================================================
const Logo = ({ className = 'logo' }) => (
  <Link to="/" className={className} aria-label="Comrade Hub home">
    <span className="logo-mark" aria-hidden="true">✳</span>
    <span className="logo-text">Comrade <em>Hub</em></span>
  </Link>
);

// =====================================================
// HOME PAGE
// =====================================================
function Home() {
  const navigate = useNavigate();
  const { user, token, loading, logout } = useAuth();

  const isLoggedIn = Boolean(user && token);
  const firstName = user?.firstName || user?.email?.split('@')[0] || 'Account';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const services = [
    {
      icon: '🛒',
      title: 'Marketplace',
      text: 'Buy and sell phones, laptops, clothes, furniture and other products.',
      link: '/marketplace',
      action: 'Explore →',
    },
    {
      icon: '🏠',
      title: 'Houses',
      text: 'Find vacant houses, bedsitters, hostels and apartments near campus.',
      link: '/houses',
      action: 'Find a House →',
    },
    {
      icon: '🚌',
      title: 'Transport',
      text: 'Find motorists and transportation services around your campus.',
      link: '/transport',
      action: 'Find Transport →',
    },
    {
      icon: '🧺',
      title: 'Laundry Services',
      text: 'Book affordable laundry and cleaning services from trusted providers near you.',
      link: '/laundry',
      action: 'Book Laundry →',
    },
    {
      icon: '🛠️',
      title: 'Services',
      text: 'Discover businesses and services offered by people around the campus community.',
      link: '/services',
      action: 'Explore Services →',
    },
    {
      icon: '📢',
      title: 'Advertise',
      text: 'Promote your products, business, house or services to thousands of comrades.',
      link: '/advertise',
      action: 'Advertise →',
    },
    {
      icon: '🔎',
      title: 'I Need',
      text: "Can't find what you're looking for? Post a request and let sellers find you.",
      link: '/requests',
      action: 'Post a Request →',
    },
  ];

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <Logo />

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/laundry">
            🧺 Laundry
          </Link>
          <Link to="/services">Services</Link>
          <Link to="/advertise">Advertise</Link>
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="user-chip">
                <span className="user-avatar">
                  {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </span>
                <span className="user-name">
                  {user.firstName || user.email?.split('@')[0] || 'Account'}
                </span>
              </Link>
              <button className="login-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="register-btn" onClick={() => navigate('/register')}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            {isLoggedIn
              ? `👋 Welcome back${user.firstName ? `, ${user.firstName}` : ''}`
              : '🎓 Built for Comrades'}
          </span>

          <h1>
            {isLoggedIn ? 'Your Hub is Ready.' : 'Everything Comrades Need,'}
            <span>
              {isLoggedIn ? ' Explore, Buy, Sell & Connect.' : ' In One Place.'}
            </span>
          </h1>

          <p>
            Buy and sell products, find vacant houses, discover transportation,
            advertise your business and connect directly with people around you.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate('/houses/post')}
            >
              Post a House
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="What are you looking for?" />
            <button onClick={() => navigate('/marketplace')}>Search</button>
          </div>

          <div className="quick-categories">
            <Link to="/marketplace">
              <strong>🛒</strong>
              <p>Products</p>
            </Link>
            <Link to="/houses">
              <strong>🏠</strong>
              <p>Houses</p>
            </Link>
            <Link to="/transport">
              <strong>🚌</strong>
              <p>Transport</p>
            </Link>
            <Link to="/laundry">
              <strong>🧺</strong>
              <p>Laundry</p>
            </Link>
            <Link to="/services">
              <strong>🛠️</strong>
              <p>Services</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= LAUNDRY FEATURE STRIP ================= */}
      <section className="laundry-strip">
        <div className="laundry-strip-inner">
          <div className="laundry-strip-icon">🧺</div>
          <div className="laundry-strip-copy">
            <span className="laundry-strip-eyebrow">NEW ON COMRADEHUB</span>
            <h3>Laundry Services — Fresh clothes, zero hassle.</h3>
            <p>
              Book trusted laundry providers near campus for washing, ironing,
              and delivery right to your hostel.
            </p>
          </div>
          <button
            className="laundry-strip-btn"
            onClick={() => navigate('/laundry')}
          >
            Explore Laundry Services →
          </button>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="services">
        <div className="section-heading">
          <span>WHAT YOU CAN DO</span>
          <h2>One Platform, Many Services</h2>
          <p>
            ComradeHub connects students, sellers, landlords, motorists and
            businesses in one platform.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <Link to={service.link}>{service.action}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works">
        <div className="section-heading">
          <span>SIMPLE & EASY</span>
          <h2>How ComradeHub Works</h2>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Register as a comrade, seller, landlord, motorist or business.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Find or Post</h3>
            <p>Search for what you need or post your own product, house or service.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect Directly</h3>
            <p>Contact the owner, seller, landlord or service provider directly.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <h2>
          {isLoggedIn ? 'Grow Your ComradeHub Presence' : 'Ready to Join ComradeHub?'}
        </h2>
        <p>
          {isLoggedIn
            ? 'Post products, houses, transport or services and reach the community.'
            : 'Buy, sell, find, advertise and connect with your community.'}
        </p>
        <button
          className="primary-btn"
          onClick={() => navigate(isLoggedIn ? '/marketplace/post' : '/register')}
        >
          {isLoggedIn ? 'Post an Item' : 'Create Your Account'}
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-brand">
          <Logo className="footer-logo" />
          <p>Everything Comrades Need, In One Place.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/houses">Houses</Link>
            <Link to="/transport">Transport</Link>
            <Link to="/laundry">Laundry</Link>
            <Link to="/services">Services</Link>
            <Link to="/requests">I Need</Link>
            <Link to="/advertise">Advertise</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/notifications">Notifications</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>

        <div className="footer-bottom">© 2026 ComradeHub. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Home;