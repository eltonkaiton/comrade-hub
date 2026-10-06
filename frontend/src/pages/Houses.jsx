import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Houses.css';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Houses', to: '/houses' },
  { label: 'Transport', to: '/transport' },
  { label: 'Laundry', to: '/laundry' },
  { label: 'Services', to: '/services' },
  { label: 'Advertise', to: '/advertise' },
];

const categories = [
  { icon: '🚪', name: 'Single Room', badge: 'Private single rooms' },
  { icon: '🛏️', name: 'Bedsitter', badge: 'Affordable rooms' },
  { icon: '🏢', name: 'One Bedroom', badge: 'Private apartments' },
  { icon: '🏠', name: 'Hostel', badge: 'Student living' },
  { icon: '🏘️', name: 'Other', badge: 'More housing options' },
];

const popularHouseSearches = [
  'Kahawa',
  'Kilimani',
  'Madaraka',
  'Near campus',
  'WiFi',
  'Verified homes',
];

// 👇 Hardcoded backend base URL — change if your backend runs elsewhere
const API_BASE_URL = 'https://comradehub-api.onrender.com';
const HOUSES_ENDPOINT = `${API_BASE_URL}/api/houses`;

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/900x600?text=No+Image';

function Houses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryOptions = ['All', ...categories.map((category) => category.name)];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchHouses() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(HOUSES_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to load houses (${response.status})`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : data.houses || data.data || [];

        const normalized = list.map((house) => ({
          id: house.id ?? house._id,
          title: house.title ?? house.name ?? 'Untitled listing',
          location: house.location ?? house.address ?? 'Location not specified',
          distance: house.distance ?? house.distance_from_campus ?? '',
          type: house.type ?? house.category ?? 'Other',
          rent: Number(house.rent ?? house.price ?? 0),
          availability: house.availability ?? 'Available Now',
          verified: Boolean(house.verified),
          featured: Boolean(house.featured),
          description: house.description ?? '',
          amenities: Array.isArray(house.amenities)
            ? house.amenities
            : typeof house.amenities === 'string'
            ? house.amenities.split(',').map((a) => a.trim()).filter(Boolean)
            : [],
          images:
            Array.isArray(house.images) && house.images.length > 0
              ? house.images
              : house.image
              ? [house.image]
              : [PLACEHOLDER_IMAGE],
        }));

        if (isMounted) setHouses(normalized);
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHouses();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredHouses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return houses.filter((house) => {
      const matchesCategory =
        selectedCategory === 'All' || house.type === selectedCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        house.title.toLowerCase().includes(normalizedSearch) ||
        house.type.toLowerCase().includes(normalizedSearch) ||
        house.location.toLowerCase().includes(normalizedSearch) ||
        house.distance.toLowerCase().includes(normalizedSearch) ||
        house.amenities.some((amenity) =>
          amenity.toLowerCase().includes(normalizedSearch)
        ) ||
        (normalizedSearch.includes('verified') && house.verified);

      return matchesCategory && matchesSearch;
    });
  }, [houses, searchTerm, selectedCategory]);

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handlePostHouse = () => {
    navigate('/houses/post');
  };

  return (
    <div className="houses-page storefront-page">
      <div className="store-shell">
        <header className="store-header">
          <div className="store-mainbar">
            <div className="store-menu">☰</div>
            <div className="brand-lockup" aria-label="Comrade Hub logo">
              <span className="brand-mark">C</span>
              <span className="brand-word">Comrade Hub</span>
            </div>

            <nav className="store-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <Link key={item.label} to={item.to} className={item.label === 'Houses' ? 'active' : ''}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="store-tools">
              <button className="icon-btn" aria-label="Search houses" title="Search houses">
                ⌕
              </button>
              <button className="icon-btn" aria-label="Cart" title="Cart">
                🛒
              </button>
              <button
                type="button"
                className="post-house-btn"
                onClick={handlePostHouse}
              >
                + Post a House
              </button>
            </div>
          </div>
        </header>

        <main className="store-main">
          <div className="store-toolbar">
            <label className="store-search" htmlFor="store-search-input">
              <span>⌕</span>
              <input
                id="store-search-input"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search houses, locations or amenities..."
                aria-label="Search houses, locations or amenities"
              />
            </label>

            <div className="store-category-filters" aria-label="Category filters">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <section className="hero-strip">
            <div className="hero-card hero-card-small">
              <div>
                <span className="mini-tag">Near campus</span>
                <h3>Student Housing</h3>
                <p>Comfortable homes for comrades</p>
              </div>
              <div className="mini-art">🏠</div>
            </div>

            <div className="hero-card hero-card-large">
              <div className="hero-copy">
                <span className="mini-tag light">Featured homes</span>
                <h1>
                  Find <span>Your Next Home</span>
                </h1>
                <p>Explore clean, secure and affordable homes near campus.</p>
                <div className="hero-actions">
                  <button className="primary-btn" type="button">
                    Explore Houses
                  </button>
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={handlePostHouse}
                  >
                    + Post a House
                  </button>
                </div>
              </div>
              <div className="product-slab">
                <div className="phone-glow">🏠</div>
              </div>
            </div>

            <div className="hero-card hero-card-small right-card">
              <div className="mini-badge">MOVE-IN READY</div>
              <div>
                <h3>Verified Homes</h3>
                <p>Ready for viewing</p>
              </div>
              <div className="mini-art">🔑</div>
            </div>
          </section>

          <section className="shop-section">
            <div className="section-head">
              <h2>Browse by House Type</h2>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setSelectedCategory('All')}
              >
                View All
              </button>
            </div>

            <div className="category-grid">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  className="category-item"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-copy">
                    <h3>{category.name}</h3>
                    <p>{category.badge}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="shop-section">
            <div className="section-head">
              <h2>Available Homes</h2>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                See more
              </button>
            </div>

            {loading ? (
              <div className="product-empty-state">
                <p>Loading houses…</p>
              </div>
            ) : error ? (
              <div className="product-empty-state">
                <p>⚠️ {error}</p>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : filteredHouses.length > 0 ? (
              <div className="product-grid">
                {filteredHouses.map((house) => (
                  <Link
                    key={house.id}
                    className="product-card"
                    to={`/houses/${house.id}`}
                  >
                    <div className="product-topline">
                      <span className="product-badge">
                        {house.featured ? 'Featured' : house.availability}
                      </span>
                      <button
                        className="wishlist"
                        type="button"
                        aria-label="Save item"
                        onClick={handleWishlistClick}
                      >
                        ♡
                      </button>
                    </div>
                    <div className="product-art house-art">
                      <img src={house.images[0]} alt={house.title} />
                    </div>
                    <div className="product-info">
                      <h3>{house.title}</h3>
                      <p className="house-location">📍 {house.location}</p>
                      <div className="price-row">
                        <strong>KES {house.rent.toLocaleString()}/mo</strong>
                        <span>{house.distance}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="product-empty-state">
                <p>No houses yet. Be the first to post one!</p>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handlePostHouse}
                >
                  + Post a House
                </button>
              </div>
            )}
          </section>

          <section className="flash-banner">
            <div className="promo-copy">
              <span className="flash-tag">ComradeHub housing</span>
              <h2>Find a place close to campus</h2>
              <p>Compare rent, location and amenities before you book a viewing.</p>
              <div className="countdown">
                <span>{houses.length}</span>
                <span>{houses.filter((house) => house.verified).length}</span>
                <span>{houses.filter((house) => house.featured).length}</span>
              </div>
            </div>
            <div className="promo-visual">🏠</div>
          </section>

          {filteredHouses.length > 0 && (
            <section className="shop-section">
              <div className="section-head">
                <h2>Featured Houses</h2>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All
                </button>
              </div>

              <div className="product-grid arrival-grid">
                {filteredHouses.slice(0, 4).map((house) => (
                  <Link
                    key={house.id}
                    className="product-card"
                    to={`/houses/${house.id}`}
                  >
                    <div className="product-topline">
                      <span className="product-badge">
                        {house.featured ? 'Featured' : house.availability}
                      </span>
                      <button
                        className="wishlist"
                        type="button"
                        aria-label="Save item"
                        onClick={handleWishlistClick}
                      >
                        ♡
                      </button>
                    </div>
                    <div className="product-art house-art">
                      <img src={house.images[0]} alt={house.title} />
                    </div>
                    <div className="product-info">
                      <h3>{house.title}</h3>
                      <p className="house-location">📍 {house.location}</p>
                      <div className="price-row">
                        <strong>KES {house.rent.toLocaleString()}/mo</strong>
                        <span>{house.distance}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="brand-section">
            <div className="section-head center-head">
              <h2>Popular House Searches</h2>
            </div>
            <div className="brand-row">
              {popularHouseSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  className="brand-pill"
                  onClick={() => setSearchTerm(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </section>
        </main>

        <footer className="store-footer">
          <div className="footer-brand-row">
            <div className="brand-lockup light-brand" aria-label="Comrade Hub logo">
              <span className="brand-mark">C</span>
              <span className="brand-word">Comrade Hub</span>
            </div>
            <p>Everything you need, in one storefront.</p>
          </div>

          <div className="footer-menu">
            <div>
              <h4>Company</h4>
              <Link to="/">Home</Link>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/houses">Houses</Link>
            </div>
            <div>
              <h4>Services</h4>
              <Link to="/transport">Transport</Link>
              <Link to="/services">Services</Link>
              <Link to="/advertise">Advertise</Link>
            </div>
            <div>
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating action button for quick posting (great on mobile) */}
      <button
        type="button"
        className="post-house-fab"
        onClick={handlePostHouse}
        aria-label="Post a house"
      >
        +
      </button>
    </div>
  );
}

export default Houses;