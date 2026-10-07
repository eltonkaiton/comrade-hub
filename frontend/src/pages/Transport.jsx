import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Transport.css';

const API_BASE_URL = 'https://comradehub-api.onrender.com';
const TRANSPORT_ENDPOINT = `${API_BASE_URL}/api/transport`;

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/600x400?text=No+Image';

// Category cards shown on top of the page (static — not real data)
const transportCategories = [
  {
    icon: '🏍️',
    title: 'Boda Boda',
    description: 'Quick and affordable motorcycle rides',
  },
  {
    icon: '🛺',
    title: 'Tuk Tuk',
    description: 'Comfortable rides around town',
  },
  {
    icon: '🚗',
    title: 'Cars',
    description: 'Private cars for trips and daily transport',
  },
  {
    icon: '🚐',
    title: 'Vans & Shuttles',
    description: 'Group transport and campus transfers',
  },
  {
    icon: '🚚',
    title: 'Moving Services',
    description: 'Move your belongings with ease',
  },
  {
    icon: '📦',
    title: 'Delivery',
    description: 'Send packages around your town',
  },
];

// Maps the friendly card title to the backend enum value
const CARD_TO_BACKEND_TYPE = {
  'Boda Boda': 'Boda Boda',
  'Tuk Tuk': 'Tuk Tuk',
  Cars: 'Car Hire',
  'Vans & Shuttles': 'Van / Moving',
  'Moving Services': 'Van / Moving',
  Delivery: 'Other',
};

// Maps backend enum → display category on the provider card
const BACKEND_TO_DISPLAY_TYPE = {
  'Boda Boda': 'Boda Boda',
  'Tuk Tuk': 'Tuk Tuk',
  Taxi: 'Taxi',
  'Car Hire': 'Car',
  'Van / Moving': 'Van & Shuttle',
  'School / Campus Transport': 'Campus Transport',
  Bus: 'Bus',
  Other: 'Delivery',
};

// Picks an emoji icon based on the transport type
function iconForType(type) {
  switch (type) {
    case 'Boda Boda':
      return '🏍️';
    case 'Tuk Tuk':
      return '🛺';
    case 'Taxi':
    case 'Car Hire':
      return '🚗';
    case 'Van / Moving':
      return '🚐';
    case 'School / Campus Transport':
    case 'Bus':
      return '🚌';
    default:
      return '📦';
  }
}

function Transport() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transport providers from backend
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTransports() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(TRANSPORT_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to load transport (${response.status})`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : data.transports || data.data || [];

        const normalized = list.map((item) => {
          const owner = item.owner || {};
          const displayCategory =
            BACKEND_TO_DISPLAY_TYPE[item.type] || item.type || 'Other';

          return {
            id: item._id ?? item.id,
            name: item.name ?? 'Unnamed provider',
            category: displayCategory,
            backendType: item.type,
            location: item.location ?? 'Location not specified',
            serviceArea: item.serviceArea ?? '',
            price: item.price ? `From KES ${Number(item.price).toLocaleString()}` : 'Contact for price',
            availability: item.availability ?? 'Available Now',
            verified: Boolean(item.verified),
            featured: Boolean(item.featured),
            description: item.description ?? '',
            services: Array.isArray(item.services) ? item.services : [],
            icon: iconForType(item.type),
            images:
              Array.isArray(item.images) && item.images.length > 0
                ? item.images
                : [PLACEHOLDER_IMAGE],
            rating: item.rating ?? 0,
            reviews: item.reviews ?? 0,
          };
        });

        if (isMounted) setProviders(normalized);
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTransports();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Filter + sort
  const filteredProviders = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    const result = providers.filter((provider) => {
      const matchesSearch =
        searchText.length === 0 ||
        provider.name.toLowerCase().includes(searchText) ||
        provider.category.toLowerCase().includes(searchText) ||
        provider.location.toLowerCase().includes(searchText) ||
        provider.serviceArea.toLowerCase().includes(searchText) ||
        provider.description.toLowerCase().includes(searchText) ||
        provider.services.some((s) =>
          s.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        category === 'All' || provider.category === category;

      const matchesLocation =
        !locationText ||
        provider.location.toLowerCase().includes(locationText) ||
        provider.serviceArea.toLowerCase().includes(locationText);

      return matchesSearch && matchesCategory && matchesLocation;
    });

    const sorted = [...result];
    switch (sortBy) {
      case 'Highest Rated':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'Lowest Price':
        sorted.sort(
          (a, b) =>
            parseInt(a.price.replace(/\D/g, ''), 10) -
            parseInt(b.price.replace(/\D/g, ''), 10)
        );
        break;
      case 'Newest':
        // backend already returns newest first — leave as-is
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return sorted;
  }, [providers, search, category, location, sortBy]);

  return (
    <div className="transport-page">
      {/* Navbar */}
      <nav className="transport-navbar">
        <div className="transport-container transport-nav-inner">
          <Link to="/" className="transport-logo">
            <span className="transport-logo-icon">C</span>
            <span>
              Comrade<span>Hub</span>
            </span>
          </Link>

          <div className="transport-nav-links">
            <Link to="/">Home</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/houses">Houses</Link>
            <Link to="/transport" className="active">
              Transport
            </Link>
            <Link to="/laundry">Laundry</Link>
            <Link to="/services">Services</Link>
            <Link to="/advertise">Advertise</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="transport-hero">
        <div className="transport-container">
          <div className="transport-hero-content">
            <span className="transport-eyebrow">🚗 MOVE WITH EASE</span>

            <h1>Find Reliable Transport Around You</h1>

            <p>
              Connect with trusted boda bodas, tuk tuks, cars, shuttles,
              movers and delivery providers within your community.
            </p>

            <div className="transport-search-box">
              <div className="transport-search-field">
                <span>🔎</span>
                <input
                  type="text"
                  placeholder="Search transport or provider..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="transport-search-field">
                <span>📍</span>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Transport</option>
                <option value="Boda Boda">Boda Boda</option>
                <option value="Tuk Tuk">Tuk Tuk</option>
                <option value="Car">Cars</option>
                <option value="Van & Shuttle">Vans & Shuttles</option>
                <option value="Delivery">Delivery</option>
              </select>

              <button type="button" className="transport-search-btn">
                Search
              </button>
            </div>

            <div className="transport-quick-links">
              <span>Popular:</span>
              <button onClick={() => setCategory('Boda Boda')}>
                Boda Boda
              </button>
              <button onClick={() => setCategory('Van & Shuttle')}>
                Shuttle
              </button>
              <button onClick={() => setCategory('Van & Shuttle')}>
                Movers
              </button>
              <button onClick={() => setCategory('Delivery')}>
                Delivery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="transport-section">
        <div className="transport-container">
          <div className="transport-section-heading">
            <div>
              <span className="transport-section-label">TRANSPORT</span>
              <h2>What Type of Transport Do You Need?</h2>
              <p>
                Choose a transport option that works best for your journey.
              </p>
            </div>
          </div>

          <div className="transport-category-grid">
            {transportCategories.map((item) => (
              <button
                key={item.title}
                className="transport-category-card"
                onClick={() =>
                  setCategory(CARD_TO_BACKEND_TYPE[item.title] ?? 'All')
                }
              >
                <div className="transport-category-icon">{item.icon}</div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <strong>→</strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="transport-section transport-light-section">
        <div className="transport-container">
          <div className="transport-section-heading transport-heading-row">
            <div>
              <span className="transport-section-label">TRUSTED PROVIDERS</span>
              <h2>Transport Providers Near You</h2>
              <p>
                Find reliable transport providers and book directly through
                ComradeHub.
              </p>
            </div>

            <select
              className="transport-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Recommended</option>
              <option>Highest Rated</option>
              <option>Lowest Price</option>
              <option>Newest</option>
            </select>
          </div>

          {loading ? (
            <div className="transport-empty">
              <div>⏳</div>
              <h3>Loading transport providers…</h3>
            </div>
          ) : error ? (
            <div className="transport-empty">
              <div>⚠️</div>
              <h3>Could not load providers</h3>
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : filteredProviders.length > 0 ? (
            <div className="transport-provider-grid">
              {filteredProviders.map((provider) => (
                <article
                  className="transport-provider-card"
                  key={provider.id}
                >
                  <div className="transport-provider-top">
                    {provider.images[0] !== PLACEHOLDER_IMAGE ? (
                      <>
                        <div
                          className="transport-provider-backdrop"
                          aria-hidden="true"
                          style={{ backgroundImage: `url("${provider.images[0]}")` }}
                        />
                        <img
                          className="transport-provider-image"
                          src={provider.images[0]}
                          alt={`${provider.name} vehicle`}
                        />
                      </>
                    ) : (
                      <div className="transport-provider-icon" aria-hidden="true">
                        {provider.icon}
                      </div>
                    )}

                    <button
                      className="transport-favorite"
                      type="button"
                      aria-label="Save provider"
                    >
                      ♡
                    </button>
                  </div>

                  <div className="transport-provider-body">
                    <div className="transport-provider-title">
                      <h3>{provider.name}</h3>

                      {provider.verified && (
                        <span className="transport-verified">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <span className="transport-provider-category">
                      {provider.category}
                    </span>

                    <div className="transport-provider-location">
                      📍 {provider.location}
                    </div>

                    <p>{provider.description}</p>

                    {(provider.rating > 0 || provider.reviews > 0) && (
                      <div className="transport-provider-rating">
                        <span>★</span>
                        <strong>{provider.rating || '—'}</strong>
                        <span>({provider.reviews} reviews)</span>
                      </div>
                    )}

                    <div className="transport-provider-meta">
                      <strong>{provider.price}</strong>
                      <span>{provider.availability}</span>
                    </div>

                    <div className="transport-provider-actions">
                      <Link
                        to={`/transport/${provider.id}`}
                        className="transport-view-btn"
                      >
                        View Details
                      </Link>

                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="transport-empty">
              <div>🔎</div>
              <h3>No transport providers found</h3>
              <p>Try another search, category or location.</p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setLocation('');
                  setCategory('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Provider CTA */}
      <section className="transport-provider-cta">
        <div className="transport-container">
          <div className="transport-cta-card">
            <div>
              <span className="transport-section-label">
                TRANSPORT PROVIDERS
              </span>

              <h2>Do You Offer Transport Services?</h2>

              <p>
                Register your boda boda, tuk tuk, car, shuttle, moving or
                delivery service and connect with thousands of comrades.
              </p>
            </div>

            <Link to="/transport/post" className="transport-cta-btn">
              Register Your Service →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="transport-section">
        <div className="transport-container">
          <div className="transport-section-heading centered">
            <span className="transport-section-label">HOW IT WORKS</span>
            <h2>Getting Transport Is Simple</h2>
            <p>
                Find a transport provider and send a booking request with your trip details.
            </p>
          </div>

          <div className="transport-steps">
            <div className="transport-step">
              <div className="transport-step-number">1</div>
              <div>
                <h3>Search</h3>
                <p>Search for the transport service you need.</p>
              </div>
            </div>

            <div className="transport-step">
              <div className="transport-step-number">2</div>
              <div>
                <h3>Compare</h3>
                <p>Compare prices, ratings and provider details.</p>
              </div>
            </div>

            <div className="transport-step">
              <div className="transport-step-number">3</div>
              <div>
                <h3>Contact</h3>
                <p>Call, WhatsApp or message the provider.</p>
              </div>
            </div>

            <div className="transport-step">
              <div className="transport-step-number">4</div>
              <div>
                <h3>Ride</h3>
                <p>Meet your provider and get moving.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="transport-footer">
        <div className="transport-container">
          <div className="transport-footer-grid">
            <div>
              <Link to="/" className="transport-logo footer-logo">
                <span className="transport-logo-icon">C</span>
                <span>
                  Comrade<span>Hub</span>
                </span>
              </Link>

              <p>
                Everything comrades need, in one place. Find products,
                houses, transport and services within your community.
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
              <h4>For Providers</h4>
              <Link to="/transport/post">Register Transport</Link>
              <Link to="/advertise">Advertise</Link>
              <Link to="/advertise/create">Create Ad</Link>
            </div>

            <div>
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>

          <div className="transport-footer-bottom">
            <span>© 2026 ComradeHub. All rights reserved.</span>
            <span>Built for Comrades ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Transport;