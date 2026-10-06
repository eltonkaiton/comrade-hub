import React from 'react';
import { Link } from 'react-router-dom';
import './Advertise.css';

const advertisingOptions = [
  {
    icon: '📌',
    title: 'Featured Listing',
    description:
      'Push your marketplace, house or service listing to the top of relevant searches.',
    price: 'From KES 100',
    features: [
      'Higher visibility',
      'Featured badge',
      'Priority placement',
      'More potential customers',
    ],
  },
  {
    icon: '📣',
    title: 'Business Promotion',
    description:
      'Promote your business directly to students and young professionals in your community.',
    price: 'From KES 500',
    features: [
      'Business spotlight',
      'Contact information',
      'Business profile link',
      'Increased reach',
    ],
    popular: true,
  },
  {
    icon: '🚀',
    title: 'Premium Campaign',
    description:
      'Run a powerful advertising campaign across multiple sections of ComradeHub.',
    price: 'From KES 1,500',
    features: [
      'Homepage placement',
      'Category promotion',
      'Featured business',
      'Campaign analytics',
    ],
  },
];

const audiences = [
  {
    icon: '🎓',
    title: 'Students',
    description:
      'Reach students looking for products, accommodation, food, transport and services.',
  },
  {
    icon: '💼',
    title: 'Young Professionals',
    description:
      'Connect with young professionals searching for services, housing and everyday products.',
  },
  {
    icon: '🏪',
    title: 'Local Businesses',
    description:
      'Put your business in front of customers within your target community.',
  },
  {
    icon: '🏠',
    title: 'Landlords & Agents',
    description:
      'Promote available rooms, apartments, hostels and other properties.',
  },
];

function Advertise() {
  return (
    <div className="advertise-page">
      {/* Navbar */}
      <nav className="advertise-navbar">
        <div className="advertise-container advertise-nav-inner">
          <Link to="/" className="advertise-logo">
            <span className="advertise-logo-icon">C</span>
            <span>
              Comrade<span>Hub</span>
            </span>
          </Link>

          <div className="advertise-nav-links">
            <Link to="/">Home</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/houses">Houses</Link>
            <Link to="/transport">Transport</Link>
            <Link to="/laundry">Laundry</Link>
            <Link to="/services">Services</Link>
            <Link to="/advertise" className="active">
              Advertise
            </Link>
          </div>

          <div className="advertise-nav-actions">
            <Link to="/advertise/create" className="advertise-nav-btn">
              Create Ad
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="advertise-hero">
        <div className="advertise-container">
          <div className="advertise-hero-content">
            <span className="advertise-eyebrow">
              📣 GROW YOUR BUSINESS
            </span>

            <h1>
              Get Your Business in Front of
              <span> More Comrades</span>
            </h1>

            <p>
              Promote your products, services, accommodation or business on
              ComradeHub and reach people actively looking for what you offer.
            </p>

            <div className="advertise-hero-actions">
              <Link to="/advertise/create" className="advertise-primary-btn">
                Start Advertising →
              </Link>

              <a href="#pricing" className="advertise-secondary-btn">
                View Advertising Plans
              </a>
            </div>

            <div className="advertise-trust-row">
              <div>
                <strong>10K+</strong>
                <span>Potential Customers</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Online Visibility</span>
              </div>

              <div>
                <strong>📊</strong>
                <span>Campaign Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="advertise-section">
        <div className="advertise-container">
          <div className="advertise-section-heading centered">
            <span className="advertise-section-label">
              WHY COMRADEHUB
            </span>

            <h2>Advertise Where Comrades Are Looking</h2>

            <p>
              Instead of waiting for customers to discover you, put your
              business directly in front of the right audience.
            </p>
          </div>

          <div className="advertise-audience-grid">
            {audiences.map((audience) => (
              <div className="advertise-audience-card" key={audience.title}>
                <div className="advertise-audience-icon">
                  {audience.icon}
                </div>

                <h3>{audience.title}</h3>

                <p>{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising Plans */}
      <section
        className="advertise-section advertise-pricing-section"
        id="pricing"
      >
        <div className="advertise-container">
          <div className="advertise-section-heading centered">
            <span className="advertise-section-label">
              ADVERTISING PLANS
            </span>

            <h2>Choose How You Want to Be Seen</h2>

            <p>
              Start small or run a complete campaign depending on your
              business goals.
            </p>
          </div>

          <div className="advertise-plans-grid">
            {advertisingOptions.map((plan) => (
              <div
                className={`advertise-plan-card ${
                  plan.popular ? 'popular' : ''
                }`}
                key={plan.title}
              >
                {plan.popular && (
                  <div className="advertise-popular-badge">
                    MOST POPULAR
                  </div>
                )}

                <div className="advertise-plan-icon">{plan.icon}</div>

                <h3>{plan.title}</h3>

                <p>{plan.description}</p>

                <div className="advertise-plan-price">
                  {plan.price}
                </div>

                <div className="advertise-plan-divider" />

                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/advertise/create"
                  className="advertise-plan-btn"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Advertise */}
      <section className="advertise-section">
        <div className="advertise-container">
          <div className="advertise-split">
            <div className="advertise-split-content">
              <span className="advertise-section-label">
                MANY POSSIBILITIES
              </span>

              <h2>What Can You Advertise?</h2>

              <p>
                ComradeHub is designed for businesses, individuals and
                service providers. Whatever you offer, there is a place for
                it.
              </p>

              <div className="advertise-check-list">
                <div>
                  <span>✓</span>
                  Products and marketplace items
                </div>

                <div>
                  <span>✓</span>
                  Houses, hostels and apartments
                </div>

                <div>
                  <span>✓</span>
                  Restaurants and food businesses
                </div>

                <div>
                  <span>✓</span>
                  Salons, barbers and fashion
                </div>

                <div>
                  <span>✓</span>
                  Electronics and repair services
                </div>

                <div>
                  <span>✓</span>
                  Events, tutoring and professional services
                </div>
              </div>

              <Link
                to="/advertise/create"
                className="advertise-primary-btn dark-btn"
              >
                Create Your Advertisement
              </Link>
            </div>

            <div className="advertise-visual">
              <div className="advertise-dashboard-card">
                <div className="advertise-dashboard-header">
                  <span>Campaign Overview</span>
                  <span className="live-dot">● Live</span>
                </div>

                <div className="advertise-stat-main">
                  <span>Total Views</span>
                  <strong>12,840</strong>
                  <small>↑ 28.4% this week</small>
                </div>

                <div className="advertise-mini-stats">
                  <div>
                    <span>Clicks</span>
                    <strong>1,284</strong>
                  </div>

                  <div>
                    <span>Contacts</span>
                    <strong>342</strong>
                  </div>

                  <div>
                    <span>Leads</span>
                    <strong>87</strong>
                  </div>
                </div>

                <div className="advertise-chart">
                  <div style={{ height: '30%' }} />
                  <div style={{ height: '48%' }} />
                  <div style={{ height: '42%' }} />
                  <div style={{ height: '65%' }} />
                  <div style={{ height: '57%' }} />
                  <div style={{ height: '78%' }} />
                  <div style={{ height: '92%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="advertise-section advertise-how-section">
        <div className="advertise-container">
          <div className="advertise-section-heading centered">
            <span className="advertise-section-label">
              SIMPLE PROCESS
            </span>

            <h2>Start Advertising in 4 Steps</h2>

            <p>
              Creating and managing your advertisement is simple.
            </p>
          </div>

          <div className="advertise-steps">
            <div className="advertise-step">
              <span>01</span>
              <div>
                <h3>Create Your Ad</h3>
                <p>
                  Tell us about your business, product or service.
                </p>
              </div>
            </div>

            <div className="advertise-step">
              <span>02</span>
              <div>
                <h3>Choose a Plan</h3>
                <p>
                  Select the advertising package that suits you.
                </p>
              </div>
            </div>

            <div className="advertise-step">
              <span>03</span>
              <div>
                <h3>Make Payment</h3>
                <p>
                  Pay securely using the available payment options.
                </p>
              </div>
            </div>

            <div className="advertise-step">
              <span>04</span>
              <div>
                <h3>Reach Customers</h3>
                <p>
                  Your advertisement goes live and starts reaching comrades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="advertise-final-cta">
        <div className="advertise-container">
          <div className="advertise-final-card">
            <div>
              <span className="advertise-section-label">
                READY TO GROW?
              </span>

              <h2>Put Your Business in the Spotlight</h2>

              <p>
                Join ComradeHub and connect your business with customers
                looking for exactly what you offer.
              </p>
            </div>

            <Link
              to="/advertise/create"
              className="advertise-final-btn"
            >
              Start Advertising →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="advertise-footer">
        <div className="advertise-container">
          <div className="advertise-footer-grid">
            <div>
              <Link to="/" className="advertise-logo footer-logo">
                <span className="advertise-logo-icon">C</span>
                <span>
                  Comrade<span>Hub</span>
                </span>
              </Link>

              <p>
                Everything comrades need, in one place. Discover products,
                houses, transport, services and businesses.
              </p>
            </div>

            <div>
              <h4>Explore</h4>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/houses">Houses</Link>
              <Link to="/transport">Transport</Link>
              <Link to="/services">Services</Link>
            </div>

            <div>
              <h4>Advertise</h4>
              <Link to="/advertise">Advertising</Link>
              <Link to="/advertise/create">Create Advertisement</Link>
              <Link to="/register">Create Account</Link>
            </div>

            <div>
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>

          <div className="advertise-footer-bottom">
            <span>© 2026 ComradeHub. All rights reserved.</span>
            <span>Everything Comrades Need, In One Place.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Advertise;