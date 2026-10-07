import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TransportDetails.css';

const BookingMap = lazy(() => import('./TransportBookingMap'));

const API_BASE_URL = 'https://comradehub-api.onrender.com';
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
  const location = useLocation();
  const { user, token } = useAuth();

  const [provider, setProvider] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState('');
  const [locationError, setLocationError] = useState('');

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

  const openBooking = () => {
    setBookingForm({
      customerName: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      serviceDate: '',
      pickupLocation: '',
      pickupCoordinates: null,
      destination: '',
      destinationCoordinates: null,
      message: '',
    });
    setBookingError('');
    setBookingSuccess('');
    setLocationError('');
    setBookingOpen(true);
  };

  const captureLiveLocation = (point) => {
    if (!navigator.geolocation) {
      setLocationError('Live location is not supported by this browser.');
      return;
    }

    setLocationLoading(point);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        };
        const locationText = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;

        setBookingForm((current) => ({
          ...current,
          [`${point}Location`]: locationText,
          [`${point}Coordinates`]: coordinates,
        }));
        setLocationLoading('');
      },
      (geolocationError) => {
        const messages = {
          1: 'Location permission was denied. Allow location access in your browser settings and try again.',
          2: 'Your current location could not be determined. Try again where GPS reception is available.',
          3: 'The location request timed out. Please try again.',
        };
        setLocationError(messages[geolocationError.code] || 'Could not get your live location.');
        setLocationLoading('');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const findLocationOnMap = async (point) => {
    const address = bookingForm[`${point}Location`]?.trim();
    if (!address) {
      setLocationError(`Enter a ${point} address first.`);
      return;
    }

    setLocationLoading(`${point}-search`);
    setLocationError('');

    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`
      );
      if (!response.ok) throw new Error('Location search is temporarily unavailable.');

      const result = await response.json();
      const feature = result.features?.[0];
      if (!feature) throw new Error(`No map result found for "${address}". Try a more specific address.`);

      const [longitude, latitude] = feature.geometry.coordinates;
      const properties = feature.properties || {};
      const formattedAddress = [...new Set([
        properties.name,
        properties.street,
        properties.city || properties.town || properties.village,
        properties.state,
        properties.country,
      ].filter(Boolean))].join(', ') || address;

      setBookingForm((current) => ({
        ...current,
        [`${point}Location`]: formattedAddress,
        [`${point}Coordinates`]: { latitude, longitude },
      }));
    } catch (geocodeError) {
      setLocationError(geocodeError.message || 'Could not find this address on the map.');
    } finally {
      setLocationLoading('');
    }
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    const point = name === 'pickupLocation' ? 'pickup' : name === 'destination' ? 'destination' : null;
    setBookingForm((current) => ({
      ...current,
      [name]: value,
      ...(point ? { [`${point}Coordinates`]: null } : {}),
    }));
    if (point) setLocationError('');
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setBookingError('');
    if (!bookingForm.pickupCoordinates || !bookingForm.destinationCoordinates) {
      setBookingError('Find both addresses on the map or capture their live locations before submitting.');
      return;
    }
    setBookingSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/transport/${provider.id}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingForm),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Could not submit the booking request.');
      }

      setBookingSuccess(data.message || 'Your booking request has been submitted.');
    } catch (bookingSubmitError) {
      setBookingError(bookingSubmitError.message || 'Could not submit the booking request.');
    } finally {
      setBookingSubmitting(false);
    }
  };

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
              <h2>Book This Service</h2>
              <p>Send a booking request to {provider.name} with your trip details.</p>
              <button
                type="button"
                className="transport-booking-btn"
                onClick={openBooking}
              >
                Book Service
              </button>
            </div>

            <div className="transport-safety-card">
              <strong>🛡️ Safety First</strong>
              <p>
                Confirm the driver's identity before
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

      {bookingOpen && (
        <div
          className="transport-booking-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setBookingOpen(false);
          }}
        >
          <section
            className="transport-booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transport-booking-title"
          >
            <div className="transport-booking-header">
              <div>
                <span className="transport-type">BOOKING REQUEST</span>
                <h2 id="transport-booking-title">Book {provider.name}</h2>
              </div>
              <button
                type="button"
                className="transport-booking-close"
                aria-label="Close booking form"
                onClick={() => setBookingOpen(false)}
              >
                ×
              </button>
            </div>

            {bookingSuccess ? (
              <div className="transport-booking-confirmation" role="status">
                <strong>Request sent</strong>
                <p>{bookingSuccess}</p>
                <button type="button" className="transport-booking-btn" onClick={() => setBookingOpen(false)}>
                  Done
                </button>
              </div>
            ) : !user || !token ? (
              <div className="transport-booking-login">
                <p>Sign in to book this transport service.</p>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="transport-booking-btn"
                >
                  Sign in to continue
                </Link>
              </div>
            ) : (
              <form className="transport-booking-form" onSubmit={submitBooking}>
                {bookingError && <p className="transport-booking-error" role="alert">{bookingError}</p>}
                <div className="transport-booking-grid">
                  <label>
                    Full name
                    <input name="customerName" value={bookingForm.customerName || ''} onChange={handleBookingChange} autoComplete="name" required />
                  </label>
                  <label>
                    Email
                    <input name="customerEmail" type="email" value={bookingForm.customerEmail || ''} onChange={handleBookingChange} autoComplete="email" required />
                  </label>
                  <label>
                    Phone
                    <input name="customerPhone" type="tel" value={bookingForm.customerPhone || ''} onChange={handleBookingChange} autoComplete="tel" required />
                  </label>
                  <label>
                    Date and time
                    <input name="serviceDate" type="datetime-local" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={bookingForm.serviceDate || ''} onChange={handleBookingChange} required />
                  </label>
                  <label className="transport-booking-location">
                    Pickup point
                    <input
                      name="pickupLocation"
                      value={bookingForm.pickupLocation || ''}
                      placeholder="Type an address or place"
                      onChange={handleBookingChange}
                      required
                    />
                    <div className="transport-location-actions">
                      <button
                        type="button"
                        className="transport-location-button"
                        onClick={() => findLocationOnMap('pickup')}
                        disabled={Boolean(locationLoading)}
                      >
                        {locationLoading === 'pickup-search' ? 'Searching…' : 'Find on map'}
                      </button>
                      <button
                        type="button"
                        className="transport-location-button secondary"
                        onClick={() => captureLiveLocation('pickup')}
                        disabled={Boolean(locationLoading)}
                      >
                        {locationLoading === 'pickup' ? 'Getting location…' : '⌖ Use live location'}
                      </button>
                    </div>
                  </label>
                  <label className="transport-booking-location">
                    Destination point
                    <input
                      name="destination"
                      value={bookingForm.destination || ''}
                      placeholder="Type an address or place"
                      onChange={handleBookingChange}
                      required
                    />
                    <div className="transport-location-actions">
                      <button
                        type="button"
                        className="transport-location-button"
                        onClick={() => findLocationOnMap('destination')}
                        disabled={Boolean(locationLoading)}
                      >
                        {locationLoading === 'destination-search' ? 'Searching…' : 'Find on map'}
                      </button>
                      <button
                        type="button"
                        className="transport-location-button secondary"
                        onClick={() => captureLiveLocation('destination')}
                        disabled={Boolean(locationLoading)}
                      >
                        {locationLoading === 'destination' ? 'Getting location…' : '⌖ Use live location'}
                      </button>
                    </div>
                  </label>
                </div>
                {locationError && (
                  <p className="transport-booking-error" role="alert">
                    {locationError}
                  </p>
                )}
                {(bookingForm.pickupCoordinates || bookingForm.destinationCoordinates) && (
                  <section className="transport-booking-map-section" aria-label="Selected location map">
                    <div className="transport-booking-map-heading">
                      <strong>Route preview</strong>
                      <span>
                        {bookingForm.pickupCoordinates && bookingForm.destinationCoordinates
                          ? 'Pickup to destination'
                          : 'One point selected'}
                      </span>
                    </div>
                    <Suspense fallback={<div className="transport-booking-map-loading">Loading map…</div>}>
                      <BookingMap
                        pickup={bookingForm.pickupCoordinates
                          ? [bookingForm.pickupCoordinates.latitude, bookingForm.pickupCoordinates.longitude]
                          : null}
                        destination={bookingForm.destinationCoordinates
                          ? [bookingForm.destinationCoordinates.latitude, bookingForm.destinationCoordinates.longitude]
                          : null}
                      />
                    </Suspense>
                  </section>
                )}
                <label className="transport-booking-message">
                  Message for the provider (optional)
                  <textarea name="message" value={bookingForm.message || ''} onChange={handleBookingChange} rows="3" maxLength="1000" />
                </label>
                <div className="transport-booking-actions">
                  <button type="button" className="transport-booking-cancel" onClick={() => setBookingOpen(false)} disabled={bookingSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="transport-booking-btn" disabled={bookingSubmitting}>
                    {bookingSubmitting ? 'Sending request…' : 'Send booking request'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default TransportDetails;