import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PostHouse.css';

const API_BASE_URL = 'https://comradehub-api.onrender.com';

const HOUSE_TYPES = ['Single Room', 'Bedsitter', 'One Bedroom', 'Hostel', 'Other'];
const AVAILABILITY_OPTIONS = ['Available Now', 'Available Soon', 'Taken'];
const COMMON_AMENITIES = [
  'WiFi',
  'Water',
  'Security',
  'Parking',
  'Electricity',
  'Balcony',
  'Meals',
  'Furnished',
  'CCTV',
  'Backup Generator',
];

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const initialForm = {
  title: '',
  description: '',
  location: '',
  distance: '',
  type: 'Bedsitter',
  rent: '',
  availability: 'Available Now',
  amenities: [],
  contactPhone: '',
  contactEmail: '',
};

function PostHouse() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]); // { file, preview }
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const token = useMemo(() => {
    try {
      return (
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        JSON.parse(localStorage.getItem('user') || '{}')?.token ||
        null
      );
    } catch {
      return null;
    }
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const has = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: has
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const valid = [];
    const rejected = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        rejected.push(`${file.name} is not an image`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name} exceeds 5MB`);
        continue;
      }
      valid.push(file);
    }

    const room = MAX_IMAGES - images.length;
    const accepted = valid.slice(0, room);

    if (valid.length > room) {
      rejected.push(`Only ${MAX_IMAGES} images allowed`);
    }

    const newEntries = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newEntries]);

    if (rejected.length) {
      setErrors((prev) => ({ ...prev, images: rejected.join(', ') }));
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }

    // Reset input so the same file can be re-picked
    event.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return copy;
    });
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (!form.type) next.type = 'House type is required';
    if (form.rent === '' || Number(form.rent) < 0)
      next.rent = 'Enter a valid rent amount';
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
      next.contactEmail = 'Enter a valid email address';
    if (form.contactPhone && !/^[+\d\s()-]{7,}$/.test(form.contactPhone))
      next.contactPhone = 'Enter a valid phone number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!token) {
      setServerError('You must be logged in to post a house.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('location', form.location.trim());
      formData.append('distance', form.distance.trim());
      formData.append('type', form.type);
      formData.append('rent', String(Number(form.rent)));
      formData.append('availability', form.availability);
      formData.append('amenities', JSON.stringify(form.amenities));
      formData.append('contactPhone', form.contactPhone.trim());
      formData.append('contactEmail', form.contactEmail.trim());

      images.forEach(({ file }) => formData.append('images', file));

      const response = await fetch(`${API_BASE_URL}/api/houses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type — fetch sets multipart boundary automatically
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Failed to post house (${response.status})`);
      }

      const createdId = data?.house?._id || data?.house?.id;
      if (createdId) {
        navigate(`/houses/${createdId}`);
      } else {
        navigate('/houses');
      }
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setForm(initialForm);
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="post-house-page">
      <div className="post-house-shell">
        {/* Header */}
        <header className="post-house-header">
          <Link to="/houses" className="back-link" aria-label="Back to houses">
            ← Back to Houses
          </Link>
          <div className="brand-lockup" aria-label="Comrade Hub logo">
            <span className="brand-mark">C</span>
            <span className="brand-word">Comrade Hub</span>
          </div>
        </header>

        <div className="post-house-grid">
          {/* Form column */}
          <form className="post-house-form" onSubmit={handleSubmit} noValidate>
            <div className="form-heading">
              <h1>Post a House</h1>
              <p>Fill in the details below to list your property on Comrade Hub.</p>
            </div>

            {serverError && (
              <div className="form-alert error" role="alert">
                ⚠️ {serverError}
              </div>
            )}

            {/* Section: Basics */}
            <section className="form-section">
              <h2>Basic Information</h2>

              <div className="field">
                <label htmlFor="title">Listing title *</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  placeholder="e.g. Modern Bedsitter Near Campus"
                  maxLength={120}
                />
                <div className="field-meta">
                  <span className="error-text">{errors.title}</span>
                  <span className="char-count">{form.title.length}/120</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Describe the house, its condition, surroundings, rules…"
                  maxLength={2000}
                />
                <div className="field-meta">
                  <span className="error-text">{errors.description}</span>
                  <span className="char-count">
                    {form.description.length}/2000
                  </span>
                </div>
              </div>
            </section>

            {/* Section: Location */}
            <section className="form-section">
              <h2>Location</h2>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange('location')}
                    placeholder="e.g. Kahawa, Nairobi"
                  />
                  <span className="error-text">{errors.location}</span>
                </div>

                <div className="field">
                  <label htmlFor="distance">Distance from campus</label>
                  <input
                    id="distance"
                    type="text"
                    value={form.distance}
                    onChange={handleChange('distance')}
                    placeholder="e.g. 0.8 km from campus"
                  />
                </div>
              </div>
            </section>

            {/* Section: Details */}
            <section className="form-section">
              <h2>House Details</h2>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="type">House type *</label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={handleChange('type')}
                  >
                    {HOUSE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="error-text">{errors.type}</span>
                </div>

                <div className="field">
                  <label htmlFor="rent">Monthly rent (KES) *</label>
                  <input
                    id="rent"
                    type="number"
                    min="0"
                    step="100"
                    value={form.rent}
                    onChange={handleChange('rent')}
                    placeholder="e.g. 8500"
                  />
                  <span className="error-text">{errors.rent}</span>
                </div>

                <div className="field">
                  <label htmlFor="availability">Availability</label>
                  <select
                    id="availability"
                    value={form.availability}
                    onChange={handleChange('availability')}
                  >
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section: Amenities */}
            <section className="form-section">
              <h2>Amenities</h2>
              <p className="section-hint">Tap to select all that apply.</p>
              <div className="chip-group">
                {COMMON_AMENITIES.map((amenity) => {
                  const active = form.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      className={`chip ${active ? 'chip-active' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                      aria-pressed={active}
                    >
                      {active ? '✓ ' : '+ '}
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section: Images */}
            <section className="form-section">
              <h2>Photos</h2>
              <p className="section-hint">
                Up to {MAX_IMAGES} images, max 5MB each. First image becomes the cover.
              </p>

              <label className="upload-drop" htmlFor="images">
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  hidden
                />
                <div className="upload-inner">
                  <span className="upload-icon">📷</span>
                  <span className="upload-title">Click to upload images</span>
                  <span className="upload-sub">
                    JPG, PNG, WEBP or GIF — max 5MB each
                  </span>
                </div>
              </label>

              {errors.images && (
                <span className="error-text block">{errors.images}</span>
              )}

              {images.length > 0 && (
                <div className="image-grid">
                  {images.map((img, index) => (
                    <div className="image-tile" key={img.preview}>
                      <img src={img.preview} alt={`Preview ${index + 1}`} />
                      {index === 0 && <span className="cover-tag">Cover</span>}
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section: Contact */}
            <section className="form-section">
              <h2>Contact</h2>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="contactPhone">Phone</label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={form.contactPhone}
                    onChange={handleChange('contactPhone')}
                    placeholder="+254 7XX XXX XXX"
                  />
                  <span className="error-text">{errors.contactPhone}</span>
                </div>

                <div className="field">
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={handleChange('contactEmail')}
                    placeholder="you@example.com"
                  />
                  <span className="error-text">{errors.contactEmail}</span>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="ghost-btn"
                onClick={handleReset}
                disabled={submitting}
              >
                Reset
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? 'Posting…' : 'Post House'}
              </button>
            </div>
          </form>

          {/* Live preview column */}
          <aside className="post-house-preview">
            <h2>Live Preview</h2>
            <div className="preview-card">
              <div className="preview-image">
                {images[0] ? (
                  <img src={images[0].preview} alt="Cover preview" />
                ) : (
                  <div className="preview-placeholder">No image yet</div>
                )}
                <span className="preview-badge">
                  {form.availability || 'Available Now'}
                </span>
              </div>
              <div className="preview-body">
                <h3>{form.title || 'Your listing title'}</h3>
                <p className="preview-location">
                  📍 {form.location || 'Location'}
                  {form.distance ? ` · ${form.distance}` : ''}
                </p>
                <div className="preview-price">
                  <strong>
                    KES{' '}
                    {form.rent
                      ? Number(form.rent).toLocaleString()
                      : '0'}
                    /mo
                  </strong>
                  <span>{form.type}</span>
                </div>
                {form.amenities.length > 0 && (
                  <div className="preview-amenities">
                    {form.amenities.slice(0, 5).map((a) => (
                      <span key={a} className="preview-amenity">
                        {a}
                      </span>
                    ))}
                    {form.amenities.length > 5 && (
                      <span className="preview-amenity">
                        +{form.amenities.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="preview-tips">
              <h4>Tips for a great listing</h4>
              <ul>
                <li>Use a clear, descriptive title.</li>
                <li>Add at least 3 bright, recent photos.</li>
                <li>Mention water, security, and electricity.</li>
                <li>Be honest about the distance from campus.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PostHouse;