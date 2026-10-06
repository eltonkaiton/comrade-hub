import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './TransportDetails.css';

const API_BASE_URL = 'http://localhost:5000';
const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/1200x800?text=No+Image';

// Maps the backend enum → emoji + display label
const TYPE_META = {
  'Boda Boda': { icon: '🏍️', label: 'Boda Boda' },
  'Tuk Tuk': { icon: '🛺', label: 'Tuk Tuk' },
  Taxi: { icon: '🚕', label: 'Taxi' },
  'Car Hire': { icon: '🚗', label: 'Car Hire' },
  'Van / Moving': { icon: '🚐', label: 'Van / Moving' },
  'School / Campus Transport': { icon: '🚌', label: 'Campus Transport' },
  Bus: { icon: '🚌', label: 'Bus' },
  Other: { icon: '📦', label: 'Other' },
};

function TransportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchProvider() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/transport/${id}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (response.status === 404) {
          throw new Error('This transport service was not found.');
        }
        if (!response.ok) {
          throw new Error(`Failed to load transport service (${response.status})`);
        }

        const data = await response.json();
        const raw = data?.transport ?? data?.data ?? data;

        if (!raw || (!raw._id && !raw.id)) {
          throw new Error('Invalid transport data received.');
        }

        const owner = raw.owner || {};
        const typeMeta = TYPE_META[raw.type] || TYPE_META.Other;

        const normalized = {
          id: raw._id ?? raw.id,
          name: raw.name ?? 'Unnamed provider',
          type: typeMeta.label,
          icon: typeMeta.icon,
          location: raw.location ?? 'Location not specified',
          serviceArea: raw.serviceArea ?? '',
          phone: raw.phone ?? owner.phone ?? '',
          email: raw.contactEmail ?? owner.email ?? '',
          price: Number(raw.price ?? 0),
          availability: raw.availability ?? 'Available Now',
          verified: Boolean(raw.verified),
          featured: Boolean(raw.featured),
          description: raw.description ?? 'No description provided.',
          services: Array.isArray(raw.services)
            ? raw.services
            : typeof raw.services === 'string'
            ? raw.services.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          images:
            Array.isArray(raw.images) && raw.images.length > 0
              ? raw.images
              : [PLACEHOLDER_IMAGE],
          rating: Number(raw.rating ?? 0),
          reviews: Number(raw.reviews ?? 0),
          owner: {
            name: owner.name || owner.fullName || raw.name || 'ComradeHub User',
            verified: Boolean(owner.verified || raw.verified),
          },
        };

        if (isMounted) setProvider(normalized);
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) fetchProvider();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (!provider || provider.images.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        (currentIndex + 1) % provider.images.length
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [provider]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="transport-details-page">
        <nav className="transport-details-nav">
          <Link to="/" className="transport-details-logo">
            🎓 Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="transport-details-state">
          <p>Loading transport details…</p>
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error || !provider) {
    return (
      <div className="transport-details-page">
        <nav className="transport-details-nav">
          <Link to="/" className="transport-details-logo">
            🎓 Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="transport-details-state">
          <h2>😕 {error || 'Provider not found'}</h2>
          <p>The transport service you are looking for may have been removed.</p>
          <Link to="/transport" className="transport-details-cta">
            ← Back to Transport
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello ${provider.name}, I found your transport service on ComradeHub and would like to make an enquiry.`
  );

  const phoneDigits = provider.phone.replace(/\D/g, '');
  const hasPhone = phoneDigits.length > 0;
  const activeImage = provider.images[activeImageIndex];

  return (
    <div className="transport-details-page">
      <nav className="transport-details-nav">
        <Link to="/" className="transport-details-logo">
          🎓 Comrade<span>Hub</span>
        </Link>

        <div className="transport-details-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/transport" className="active">
            Transport
          </Link>
          <Link to="/services">Services</Link>
        </div>
      </nav>

      <main className="transport-details-container">
        <div className="transport-breadcrumb">
          <button onClick={() => navigate(-1)}>← Back</button>
          <span>/</span>
          <Link to="/transport">Transport</Link>
          <span>/</span>
          <span>{provider.name}</span>
        </div>

        <section className="transport-profile">
          <div className="transport-cover" aria-label={`${provider.name} photos`}>
            {activeImage && activeImage !== PLACEHOLDER_IMAGE ? (
              <>
                <div
                  className="transport-cover-backdrop"
                  aria-hidden="true"
                  style={{ backgroundImage: `url("${activeImage}")` }}
                />
              <img
                key={activeImageIndex}
                src={activeImage}
                alt={`${provider.name} vehicle ${activeImageIndex + 1}`}
                className="transport-cover-image"
              />
              </>
            ) : (
              <div className="transport-cover-icon">{provider.icon}</div>
            )}
            {provider.images.length > 1 && (
              <div className="transport-cover-controls" aria-label="Photo slideshow controls">
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setActiveImageIndex((currentIndex) =>
                      (currentIndex - 1 + provider.images.length) % provider.images.length
                    )
                  }
                >
                  ‹
                </button>
                <div className="transport-cover-dots">
                  {provider.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`Show photo ${index + 1}`}
                      aria-current={activeImageIndex === index ? 'true' : undefined}
                      className={activeImageIndex === index ? 'active' : ''}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() =>
                    setActiveImageIndex((currentIndex) =>
                      (currentIndex + 1) % provider.images.length
                    )
                  }
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="transport-profile-content">
            <div className="transport-profile-heading">
              <div>
                <span className="transport-type">{provider.type}</span>

                <h1>{provider.name}</h1>

                <p>📍 {provider.location}</p>
                {hasPhone && (
                  <a className="transport-driver-phone" href={`tel:${phoneDigits}`}>
                    <span aria-hidden="true">☎</span>
                    Driver number: {provider.phone}
                  </a>
                )}
              </div>

              {provider.verified && (
                <span className="transport-verified">
                  ✓ Verified Provider
                </span>
              )}
            </div>

            {(provider.rating > 0 || provider.reviews > 0) && (
              <div className="transport-rating">
                <strong>★ {provider.rating || '—'}</strong>
                <span>{provider.reviews} reviews</span>
              </div>
            )}
          </div>
        </section>

        <div className="transport-content-grid">
          <div className="transport-main">
            <section className="transport-info-card">
              <h2>About This Service</h2>
              <p>{provider.description}</p>
            </section>

            {provider.services.length > 0 && (
              <section className="transport-info-card">
                <h2>Services Offered</h2>
                <div className="transport-services">
                  {provider.services.map((service) => (
                    <div key={service} className="transport-service">
                      ✓ {service}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {provider.serviceArea && (
              <section className="transport-info-card">
                <h2>Service Area</h2>
                <div className="service-area-box">
                  📍
                  <div>
                    <strong>{provider.serviceArea}</strong>
                    <span>Available depending on trip distance.</span>
                  </div>
                </div>
              </section>
            )}

            <section className="transport-info-card">
              <h2>Starting Price</h2>
              <div className="transport-price">
                <strong>
                  {provider.price > 0
                    ? `KES ${provider.price.toLocaleString()}`
                    : 'Contact for price'}
                </strong>
                <span>
                  Starting fare — final price may depend on distance and
                  service.
                </span>
              </div>
            </section>

            {provider.images.length > 1 && (
              <section className="transport-info-card">
                <h2>Photos</h2>
                <div className="transport-gallery">
                  {provider.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${provider.name} ${index + 1}`}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="transport-sidebar">
            <div className="transport-contact-card">
              <h2>Contact Provider</h2>

              {hasPhone ? (
                <>
                  <a
                    href={`tel:${phoneDigits}`}
                    className="transport-call-btn"
                  >
                    📞 Call Provider
                  </a>

                  <a
                    href={`https://wa.me/${phoneDigits}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="transport-whatsapp-btn"
                  >
                    💬 WhatsApp
                  </a>
                </>
              ) : (
                <p className="transport-no-contact">
                  Contact details not provided.
                </p>
              )}

              {provider.email && (
                <a
                  href={`mailto:${provider.email}?subject=${encodeURIComponent(
                    `Enquiry about ${provider.name}`
                  )}`}
                  className="transport-message-btn"
                >
                  ✉ Send Message
                </a>
              )}
            </div>

            <div className="transport-safety-card">
              <strong>🛡️ Safety First</strong>
              <p>
                Confirm the driver's identity, agree on the fare before
                travelling and avoid sharing sensitive information.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="transport-details-footer">
        <strong>ComradeHub</strong>
        <span>Everything Comrades Need, In One Place.</span>
      </footer>
    </div>
  );
}

export default TransportDetails;