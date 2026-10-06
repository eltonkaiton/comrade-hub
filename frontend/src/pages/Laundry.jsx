import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Laundry.css';

const API_BASE_URL = 'http://localhost:5000';
const LAUNDRY_ENDPOINT = `${API_BASE_URL}/api/laundry`;

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/600x400?text=No+Image';

const categories = [
  { icon: '🧺', title: 'Wash & Fold', text: 'Everyday laundry done for you' },
  { icon: '👔', title: 'Ironing', text: 'Crisp, wrinkle-free clothes' },
  { icon: '🧼', title: 'Dry Cleaning', text: 'Suits, dresses & delicate fabrics' },
  { icon: '🛏️', title: 'Bedding & Duvets', text: 'Duvets, blankets & bedsheets' },
  { icon: '🚚', title: 'Pickup & Delivery', text: 'We collect and return to your door' },
  { icon: '⚡', title: 'Express Service', text: 'Same-day turnaround options' },
];

const SERVICE_OPTIONS = [
  'Wash & Fold',
  'Ironing',
  'Dry Cleaning',
  'Bedding & Duvets',
  'Pickup & Delivery',
  'Express Service',
  'Stain Removal',
  'Sneaker Cleaning',
];

function LaundryHeroBackground({ services }) {
  const images = services
    .flatMap((service) => service.images)
    .filter((image) => image !== PLACEHOLDER_IMAGE);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="laundry-hero-background"
      aria-hidden="true"
      style={{ '--laundry-slide-image': `url("${images[activeImage]}")` }}
    >
      <div
        className={`laundry-hero-backdrop laundry-hero-backdrop-${activeImage % 3}`}
      />
      <img key={activeImage} src={images[activeImage]} alt="" />
    </div>
  );
}

function LaundryImageSlideshow({ images, serviceName }) {
  const imageList = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (imageList.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % imageList.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [imageList.length]);

  const showImage = (index) => {
    setActiveImage((index + imageList.length) % imageList.length);
  };

  return (
    <div className="laundry-image-slideshow">
      <img
        src={imageList[activeImage]}
        alt={`${serviceName} photo ${activeImage + 1}`}
      />
      {imageList.length > 1 && (
        <>
          <button
            type="button"
            className="laundry-slide-control laundry-slide-previous"
            onClick={() => showImage(activeImage - 1)}
            aria-label={`Previous photo for ${serviceName}`}
          >
            ‹
          </button>
          <button
            type="button"
            className="laundry-slide-control laundry-slide-next"
            onClick={() => showImage(activeImage + 1)}
            aria-label={`Next photo for ${serviceName}`}
          >
            ›
          </button>
          <div className="laundry-slide-indicators">
            {imageList.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={index === activeImage ? 'active' : ''}
                onClick={() => showImage(index)}
                aria-label={`Show photo ${index + 1} of ${serviceName}`}
                aria-current={index === activeImage ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Laundry() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(LAUNDRY_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to load laundry services (${response.status})`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : data.laundry || data.data || [];

        const normalized = list.map((item) => {
          const owner = item.owner || {};
          return {
            id: item._id ?? item.id,
            name: item.name ?? 'Unnamed provider',
            location: item.location ?? 'Location not specified',
            serviceArea: item.serviceArea ?? '',
            phone: item.phone ?? owner.phone ?? '',
            price: Number(item.price ?? 0),
            priceUnit: item.priceUnit ?? 'per load',
            availability: item.availability ?? 'Available Now',
            verified: Boolean(item.verified),
            featured: Boolean(item.featured),
            description: item.description ?? '',
            services: Array.isArray(item.services)
              ? item.services
              : typeof item.services === 'string'
              ? item.services.split(',').map((s) => s.trim()).filter(Boolean)
              : [],
            images:
              Array.isArray(item.images) && item.images.length > 0
                ? item.images
                : [PLACEHOLDER_IMAGE],
            rating: Number(item.rating ?? 0),
            reviews: Number(item.reviews ?? 0),
          };
        });

        if (isMounted) setServices(normalized);
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredServices = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    const result = services.filter((service) => {
      const matchesSearch =
        searchText.length === 0 ||
        service.name.toLowerCase().includes(searchText) ||
        service.location.toLowerCase().includes(searchText) ||
        service.serviceArea.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText) ||
        service.services.some((s) => s.toLowerCase().includes(searchText));

      const matchesLocation =
        !locationText ||
        service.location.toLowerCase().includes(locationText) ||
        service.serviceArea.toLowerCase().includes(locationText);

      const matchesCategory =
        category === 'All' ||
        service.services.some(
          (s) => s.toLowerCase() === category.toLowerCase()
        );

      return matchesSearch && matchesLocation && matchesCategory;
    });

    const sorted = [...result];
    if (sortBy === 'Highest Rated') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Lowest Price') {
      sorted.sort((a, b) => a.price - b.price);
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [services, search, location, category, sortBy]);

  return (
    <div className="laundry-page">
      {/* Navbar */}
      <nav className="laundry-navbar">
        <div className="laundry-container laundry-nav-inner">
          <Link to="/" className="laundry-logo">
            <span className="laundry-logo-icon">C</span>
            <span>
              Comrade<span>Hub</span>
            </span>
          </Link>

          <div className="laundry-nav-links">
            <Link to="/">Home</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/houses">Houses</Link>
            <Link to="/transport">Transport</Link>
            <Link to="/laundry" className="active">Laundry</Link>
            <Link to="/services">Services</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="laundry-hero">
        <LaundryHeroBackground services={services} />
        <div className="laundry-container">
          <div className="laundry-hero-content">
            <span className="laundry-eyebrow">🧺 FRESH CLOTHES, ZERO HASSLE</span>
            <h1>Laundry Services Near Campus</h1>
            <p>
              Find trusted laundries for washing, ironing, dry cleaning and
              door-to-door pickup — all within your community.
            </p>

            <div className="laundry-search-box">
              <div className="laundry-search-field">
                <span>🔎</span>
                <input
                  type="text"
                  placeholder="Search laundry or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="laundry-search-field">
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
                <option value="All">All Services</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button type="button" className="laundry-search-btn">
                Search
              </button>
            </div>

            <div className="laundry-quick-links">
              <span>Popular:</span>
              <button onClick={() => setCategory('Wash & Fold')}>Wash & Fold</button>
              <button onClick={() => setCategory('Ironing')}>Ironing</button>
              <button onClick={() => setCategory('Dry Cleaning')}>Dry Cleaning</button>
              <button onClick={() => setCategory('Pickup & Delivery')}>Pickup</button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="laundry-section">
        <div className="laundry-container">
          <div className="laundry-section-heading">
            <div>
              <span className="laundry-section-label">WHAT WE OFFER</span>
              <h2>Popular Laundry Services</h2>
              <p>Choose a service that fits your laundry needs.</p>
            </div>
          </div>

          <div className="laundry-category-grid">
            {categories.map((item) => (
              <button
                key={item.title}
                className="laundry-category-card"
                onClick={() => setCategory(item.title)}
              >
                <div className="laundry-category-icon">{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <strong>→</strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="laundry-section laundry-light-section">
        <div className="laundry-container">
          <div className="laundry-section-heading laundry-heading-row">
            <div>
              <span className="laundry-section-label">TRUSTED PROVIDERS</span>
              <h2>Laundry Providers Near You</h2>
              <p>Compare services, prices and contact directly through ComradeHub.</p>
            </div>

            <select
              className="laundry-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Recommended</option>
              <option>Highest Rated</option>
              <option>Lowest Price</option>
            </select>
          </div>

          {loading ? (
            <div className="laundry-empty">
              <div>⏳</div>
              <h3>Loading laundry providers…</h3>
            </div>
          ) : error ? (
            <div className="laundry-empty">
              <div>⚠️</div>
              <h3>Could not load providers</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="laundry-provider-grid">
              {filteredServices.map((service) => (
                <article className="laundry-provider-card" key={service.id}>
                  <div className="laundry-provider-top">
                    <LaundryImageSlideshow
                      images={service.images}
                      serviceName={service.name}
                    />
                    <button className="laundry-favorite" type="button">♡</button>
                  </div>

                  <div className="laundry-provider-body">
                    <div className="laundry-provider-title">
                      <h3>{service.name}</h3>
                      {service.verified && (
                        <span className="laundry-verified">✓ Verified</span>
                      )}
                    </div>

                    <div className="laundry-provider-location">
                      📍 {service.location}
                    </div>

                    <p>{service.description}</p>

                    {service.services.length > 0 && (
                      <div className="laundry-provider-services">
                        {service.services.slice(0, 3).map((s) => (
                          <span key={s} className="laundry-tag">{s}</span>
                        ))}
                        {service.services.length > 3 && (
                          <span className="laundry-tag">
                            +{service.services.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {(service.rating > 0 || service.reviews > 0) && (
                      <div className="laundry-provider-rating">
                        <span>★</span>
                        <strong>{service.rating || '—'}</strong>
                        <span>({service.reviews} reviews)</span>
                      </div>
                    )}

                    <div className="laundry-provider-meta">
                      <strong>
                        {service.price > 0
                          ? `KES ${service.price.toLocaleString()} ${service.priceUnit}`
                          : 'Contact for price'}
                      </strong>
                      <span>{service.availability}</span>
                    </div>

                    <div className="laundry-provider-actions">
                      <Link
                        to={`/laundry/${service.id}`}
                        className="laundry-view-btn"
                      >
                        View Details
                      </Link>

                      {service.phone && (
                        <>
                          <a
                            href={`tel:${service.phone.replace(/\s/g, '')}`}
                            className="laundry-call-btn"
                            aria-label={`Call ${service.name}`}
                          >
                            ☎
                          </a>

                          <a
                            href={`https://wa.me/${service.phone.replace(
                              /\D/g,
                              ''
                            )}?text=${encodeURIComponent(
                              `Hello ${service.name}, I found your laundry service on ComradeHub and would like to make an enquiry.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="laundry-whatsapp-btn"
                          >
                            WhatsApp
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="laundry-empty">
              <div>🔎</div>
              <h3>No laundry providers found</h3>
              <p>Try another search, service or location.</p>
              <button
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
      <section className="laundry-provider-cta">
        <div className="laundry-container">
          <div className="laundry-cta-card">
            <div>
              <span className="laundry-section-label">LAUNDRY PROVIDERS</span>
              <h2>Run a Laundry Service?</h2>
              <p>
                Register your laundry business and connect with comrades who
                need your services.
              </p>
            </div>
            <Link to="/laundry/post" className="laundry-cta-btn">
              Register Your Service →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="laundry-section">
        <div className="laundry-container">
          <div className="laundry-section-heading centered">
            <span className="laundry-section-label">HOW IT WORKS</span>
            <h2>Clean Clothes in 3 Steps</h2>
          </div>

          <div className="laundry-steps">
            <div className="laundry-step">
              <div className="laundry-step-number">1</div>
              <div>
                <h3>Browse</h3>
                <p>Find a laundry service near you.</p>
              </div>
            </div>
            <div className="laundry-step">
              <div className="laundry-step-number">2</div>
              <div>
                <h3>Contact</h3>
                <p>Call or WhatsApp the provider directly.</p>
              </div>
            </div>
            <div className="laundry-step">
              <div className="laundry-step-number">3</div>
              <div>
                <h3>Relax</h3>
                <p>Get fresh, clean clothes delivered.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="laundry-footer">
        <div className="laundry-container">
          <div className="laundry-footer-grid">
            <div>
              <Link to="/" className="laundry-logo footer-logo">
                <span className="laundry-logo-icon">C</span>
                <span>
                  Comrade<span>Hub</span>
                </span>
              </Link>
              <p>
                Everything comrades need, in one place. Find products, houses,
                transport, laundry and services within your community.
              </p>
            </div>

            <div>
              <h4>Explore</h4>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/houses">Houses</Link>
              <Link to="/transport">Transport</Link>
              <Link to="/laundry">Laundry</Link>
              <Link to="/services">Services</Link>
            </div>

            <div>
              <h4>For Providers</h4>
              <Link to="/laundry/post">Register Laundry</Link>
              <Link to="/transport/post">Register Transport</Link>
              <Link to="/advertise">Advertise</Link>
            </div>

            <div>
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>

          <div className="laundry-footer-bottom">
            <span>© 2026 ComradeHub. All rights reserved.</span>
            <span>Built for Comrades ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Laundry;