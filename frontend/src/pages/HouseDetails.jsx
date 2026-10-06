import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './HouseDetails.css';

// 👇 Same hardcoded backend base URL as elsewhere — change if needed
const API_BASE_URL = 'http://localhost:5000';
const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/1200x800?text=No+Image';

function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchHouse() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/houses/${id}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (response.status === 404) {
          throw new Error('This house listing was not found.');
        }
        if (!response.ok) {
          throw new Error(`Failed to load house (${response.status})`);
        }

        const data = await response.json();

        // Backend may return the house directly, or wrap it in { house } / { data }
        const raw = data?.house ?? data?.data ?? data;

        if (!raw || (!raw._id && !raw.id)) {
          throw new Error('Invalid house data received.');
        }

        const owner = raw.owner || {};

        const normalized = {
          id: raw._id ?? raw.id,
          title: raw.title ?? raw.name ?? 'Untitled listing',
          location: raw.location ?? raw.address ?? 'Location not specified',
          distance: raw.distance ?? raw.distance_from_campus ?? '',
          type: raw.type ?? raw.category ?? 'Other',
          rent: Number(raw.rent ?? raw.price ?? 0),
          deposit: Number(raw.deposit ?? raw.rent ?? raw.price ?? 0),
          availability: raw.availability ?? 'Available Now',
          verified: Boolean(raw.verified),
          featured: Boolean(raw.featured),
          description: raw.description ?? 'No description provided.',
          amenities: Array.isArray(raw.amenities)
            ? raw.amenities
            : typeof raw.amenities === 'string'
            ? raw.amenities.split(',').map((a) => a.trim()).filter(Boolean)
            : [],
          images:
            Array.isArray(raw.images) && raw.images.length > 0
              ? raw.images
              : raw.image
              ? [raw.image]
              : [PLACEHOLDER_IMAGE],
          owner: {
            name:
              owner.name ||
              owner.fullName ||
              raw.ownerName ||
              'ComradeHub User',
            phone: owner.phone || raw.contactPhone || '',
            email: owner.email || raw.contactEmail || '',
            verified: Boolean(owner.verified || raw.verified),
          },
        };

        if (isMounted) {
          setHouse(normalized);
          setActiveImage(0);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) setError(err.message || 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) fetchHouse();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="house-details-page">
        <nav className="details-navbar">
          <Link to="/" className="details-logo">
            <span>🎓</span>
            Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="details-state">
          <p>Loading house details…</p>
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error || !house) {
    return (
      <div className="house-details-page">
        <nav className="details-navbar">
          <Link to="/" className="details-logo">
            <span>🎓</span>
            Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="details-state">
          <h2>😕 {error || 'House not found'}</h2>
          <p>The listing you are looking for may have been removed.</p>
          <Link to="/houses" className="cta-button">
            ← Back to Houses
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello ${house.owner.name}, I found your house listing "${house.title}" on ComradeHub. I am interested in viewing it.`
  );

  const phoneDigits = house.owner.phone.replace(/\D/g, '');

  return (
    <div className="house-details-page">
      {/* NAVBAR */}
      <nav className="details-navbar">
        <Link to="/" className="details-logo">
          <span>🎓</span>
          Comrade<span>Hub</span>
        </Link>

        <div className="details-nav-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/houses" className="active">
            Houses
          </Link>
          <Link to="/transport">Transport</Link>
          <Link to="/services">Services</Link>
        </div>
      </nav>

      <div className="details-container">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <button onClick={() => navigate(-1)}>← Back</button>
          <span>/</span>
          <Link to="/houses">Houses</Link>
          <span>/</span>
          <span>{house.title}</span>
        </div>

        {/* IMAGE GALLERY */}
        <section className="house-gallery">
          <div className="main-house-image">
            <img
              src={house.images[activeImage] || PLACEHOLDER_IMAGE}
              alt={house.title}
            />

            {house.featured && (
              <span className="gallery-featured">Featured</span>
            )}

            <button className="gallery-heart" aria-label="Save listing">
              ♡
            </button>
          </div>

          {house.images.length > 1 && (
            <div className="small-house-images">
              {house.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${house.title} ${index + 1}`}
                  className={activeImage === index ? 'active-thumb' : ''}
                  onClick={() => setActiveImage(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </section>

        {/* MAIN CONTENT */}
        <div className="house-details-grid">
          <main className="house-main-content">
            <div className="house-title-row">
              <div>
                <div className="property-type">{house.type}</div>

                <h1>{house.title}</h1>

                <p className="house-location">
                  📍 {house.location}
                  {house.distance ? ` · ${house.distance}` : ''}
                </p>
              </div>

              <div className="house-price">
                <strong>KES {house.rent.toLocaleString()}</strong>
                <span>/ month</span>
              </div>
            </div>

            <div className="house-status-row">
              <span className="available-badge">
                ✓ {house.availability}
              </span>

              {house.verified && (
                <span className="verified-badge">✓ Verified Listing</span>
              )}
            </div>

            {/* DESCRIPTION */}
            <section className="details-section">
              <h2>About This Property</h2>
              <p>{house.description}</p>
            </section>

            {/* AMENITIES */}
            {house.amenities.length > 0 && (
              <section className="details-section">
                <h2>Property Features & Amenities</h2>
                <div className="amenities-grid">
                  {house.amenities.map((amenity) => (
                    <div className="amenity-item" key={amenity}>
                      <span>✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RENT */}
            <section className="details-section">
              <h2>Rental Information</h2>
              <div className="rental-info-grid">
                <div>
                  <span>Monthly Rent</span>
                  <strong>KES {house.rent.toLocaleString()}</strong>
                </div>

                <div>
                  <span>Security Deposit</span>
                  <strong>KES {house.deposit.toLocaleString()}</strong>
                </div>

                <div>
                  <span>Availability</span>
                  <strong>{house.availability}</strong>
                </div>
              </div>
            </section>

            {/* SAFETY */}
            <section className="safety-box">
              <div className="safety-icon">🛡️</div>
              <div>
                <h3>Stay Safe on ComradeHub</h3>
                <p>
                  Never send money before viewing the property and confirming
                  the landlord or agent. Meet in a safe location and verify
                  important details before making any payment.
                </p>
              </div>
            </section>
          </main>

          {/* SIDEBAR */}
          <aside className="house-sidebar">
            <div className="contact-card">
              <div className="owner-header">
                <div className="owner-avatar">
                  {house.owner.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <span>Listed by</span>
                  <h3>{house.owner.name}</h3>

                  {house.owner.verified && (
                    <small>✓ Verified Owner</small>
                  )}
                </div>
              </div>

              {house.owner.phone ? (
                <>
                  <a
                    href={`tel:${phoneDigits}`}
                    className="primary-contact-btn"
                  >
                    📞 Call Owner
                  </a>

                  <a
                    href={`https://wa.me/${phoneDigits}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-btn"
                  >
                    💬 WhatsApp
                  </a>
                </>
              ) : (
                <p className="no-contact">
                  Contact details not provided.
                </p>
              )}

              {house.owner.email && (
                <a
                  href={`mailto:${house.owner.email}?subject=${encodeURIComponent(
                    `Interested in "${house.title}"`
                  )}`}
                  className="message-btn"
                >
                  ✉ Send Message
                </a>
              )}

              <button className="report-btn" type="button">
                ⚠ Report Listing
              </button>
            </div>

            <div className="location-card">
              <h3>Location</h3>
              <div className="map-placeholder">
                <span>📍</span>
                <strong>{house.location}</strong>
                {house.distance && <small>{house.distance}</small>}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* CTA */}
      <section className="details-bottom-cta">
        <div>
          <h2>Looking for more houses?</h2>
          <p>Explore more accommodation listings on ComradeHub.</p>
        </div>

        <Link to="/houses" className="cta-button">
          Browse Houses →
        </Link>
      </section>

      <footer className="details-footer">
        <strong>ComradeHub</strong>
        <span>Everything Comrades Need, In One Place.</span>
      </footer>
    </div>
  );
}

export default HouseDetails;