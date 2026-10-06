import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './LaundryDetails.css';

const API_BASE_URL = 'http://localhost:5000';
const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/1200x800?text=No+Image';

function LaundryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchProvider() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/laundry/${id}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (response.status === 404) {
          throw new Error('This laundry service was not found.');
        }
        if (!response.ok) {
          throw new Error(`Failed to load service (${response.status})`);
        }

        const data = await response.json();
        const raw = data?.laundry ?? data?.data ?? data;

        if (!raw || (!raw._id && !raw.id)) {
          throw new Error('Invalid laundry data received.');
        }

        const owner = raw.owner || {};

        const normalized = {
          id: raw._id ?? raw.id,
          name: raw.name ?? 'Unnamed provider',
          location: raw.location ?? 'Location not specified',
          serviceArea: raw.serviceArea ?? '',
          phone: raw.phone ?? owner.phone ?? '',
          email: raw.contactEmail ?? owner.email ?? '',
          price: Number(raw.price ?? 0),
          priceUnit: raw.priceUnit ?? 'per load',
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

  if (loading) {
    return (
      <div className="laundry-details-page">
        <nav className="laundry-details-nav">
          <Link to="/" className="laundry-details-logo">
            🎓 Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="laundry-details-state">
          <p>Loading laundry details…</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="laundry-details-page">
        <nav className="laundry-details-nav">
          <Link to="/" className="laundry-details-logo">
            🎓 Comrade<span>Hub</span>
          </Link>
        </nav>
        <div className="laundry-details-state">
          <h2>😕 {error || 'Provider not found'}</h2>
          <p>The laundry service you are looking for may have been removed.</p>
          <Link to="/laundry" className="laundry-details-cta">
            ← Back to Laundry
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello ${provider.name}, I found your laundry service on ComradeHub and would like to make an enquiry.`
  );

  const phoneDigits = provider.phone.replace(/\D/g, '');
  const hasPhone = phoneDigits.length > 0;

  return (
    <div className="laundry-details-page">
      <nav className="laundry-details-nav">
        <Link to="/" className="laundry-details-logo">
          🎓 Comrade<span>Hub</span>
        </Link>

        <div className="laundry-details-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/laundry" className="active">Laundry</Link>
          <Link to="/services">Services</Link>
        </div>
      </nav>

      <main className="laundry-details-container">
        <div className="laundry-breadcrumb">
          <button onClick={() => navigate(-1)}>← Back</button>
          <span>/</span>
          <Link to="/laundry">Laundry</Link>
          <span>/</span>
          <span>{provider.name}</span>
        </div>

        <section className="laundry-profile">
          <div className="laundry-cover">
            {provider.images[0] && provider.images[0] !== PLACEHOLDER_IMAGE ? (
              <img src={provider.images[0]} alt={provider.name} />
            ) : (
              <div className="laundry-cover-icon">🧺</div>
            )}
          </div>

          <div className="laundry-profile-content">
            <div className="laundry-profile-heading">
              <div>
                <span className="laundry-type">Laundry Service</span>
                <h1>{provider.name}</h1>
                <p>📍 {provider.location}</p>
              </div>

              {provider.verified && (
                <span className="laundry-verified">✓ Verified</span>
              )}
            </div>

            {(provider.rating > 0 || provider.reviews > 0) && (
              <div className="laundry-rating">
                <strong>★ {provider.rating || '—'}</strong>
                <span>{provider.reviews} reviews</span>
              </div>
            )}
          </div>
        </section>

        <div className="laundry-content-grid">
          <div className="laundry-main">
            <section className="laundry-info-card">
              <h2>About This Service</h2>
              <p>{provider.description}</p>
            </section>

            {provider.services.length > 0 && (
              <section className="laundry-info-card">
                <h2>Services Offered</h2>
                <div className="laundry-services">
                  {provider.services.map((service) => (
                    <div key={service} className="laundry-service">
                      ✓ {service}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {provider.serviceArea && (
              <section className="laundry-info-card">
                <h2>Service Area</h2>
                <div className="laundry-area-box">
                  📍
                  <div>
                    <strong>{provider.serviceArea}</strong>
                    <span>Pickup available depending on distance.</span>
                  </div>
                </div>
              </section>
            )}

            <section className="laundry-info-card">
              <h2>Pricing</h2>
              <div className="laundry-price">
                <strong>
                  {provider.price > 0
                    ? `KES ${provider.price.toLocaleString()} ${provider.priceUnit}`
                    : 'Contact for price'}
                </strong>
                <span>Final price may depend on quantity and service type.</span>
              </div>
            </section>

            {provider.images.length > 1 && (
              <section className="laundry-info-card">
                <h2>Photos</h2>
                <div className="laundry-gallery">
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

          <aside className="laundry-sidebar">
            <div className="laundry-contact-card">
              <h2>Contact Provider</h2>

              {hasPhone ? (
                <>
                  <a
                    href={`tel:${phoneDigits}`}
                    className="laundry-call-btn"
                  >
                    📞 Call Provider
                  </a>

                  <a
                    href={`https://wa.me/${phoneDigits}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="laundry-whatsapp-btn"
                  >
                    💬 WhatsApp
                  </a>
                </>
              ) : (
                <p className="laundry-no-contact">Contact details not provided.</p>
              )}

              {provider.email && (
                <a
                  href={`mailto:${provider.email}?subject=${encodeURIComponent(
                    `Laundry enquiry for ${provider.name}`
                  )}`}
                  className="laundry-message-btn"
                >
                  ✉ Send Message
                </a>
              )}
            </div>

            <div className="laundry-safety-card">
              <strong>🛡️ Safety First</strong>
              <p>
                Confirm the pickup and return time, agree on the price upfront
                and check your items before paying.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="laundry-details-footer">
        <strong>ComradeHub</strong>
        <span>Everything Comrades Need, In One Place.</span>
      </footer>
    </div>
  );
}

export default LaundryDetails;