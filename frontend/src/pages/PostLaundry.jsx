import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PostLaundry.css';

const API_BASE_URL = 'http://localhost:5000';
const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function PostLaundry() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    location: '',
    serviceArea: '',
    phone: '',
    price: '',
    priceUnit: 'per load',
    description: '',
    services: [],
    contactEmail: '',
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const serviceOptions = [
    'Wash & Fold',
    'Ironing',
    'Dry Cleaning',
    'Bedding & Duvets',
    'Pickup & Delivery',
    'Express Service',
    'Stain Removal',
    'Sneaker Cleaning',
  ];

  const priceUnits = ['per load', 'per kg', 'per item', 'per duvet', 'per delivery'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
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
    if (valid.length > room) rejected.push(`Only ${MAX_IMAGES} images allowed`);

    const newEntries = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newEntries]);
    setErrors((prev) => ({
      ...prev,
      images: rejected.length ? rejected.join(', ') : undefined,
    }));

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
    if (!form.name.trim()) next.name = 'Business name is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (!form.serviceArea.trim()) next.serviceArea = 'Service area is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.description.trim()) next.description = 'Description is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      null;

    if (!token) {
      setServerError('You must be logged in to register a laundry service.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('location', form.location.trim());
      formData.append('serviceArea', form.serviceArea.trim());
      formData.append('phone', form.phone.trim());
      formData.append('price', String(Number(form.price) || 0));
      formData.append('priceUnit', form.priceUnit);
      formData.append('description', form.description.trim());
      formData.append('services', JSON.stringify(form.services));
      formData.append('contactEmail', form.contactEmail.trim());

      images.forEach(({ file }) => formData.append('images', file));

      const response = await fetch(`${API_BASE_URL}/api/laundry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to register laundry (${response.status})`
        );
      }

      const createdId = data?.laundry?._id || data?.laundry?.id;
      navigate(createdId ? `/laundry/${createdId}` : '/laundry');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-laundry-page">
      <nav className="post-laundry-nav">
        <Link to="/" className="post-laundry-logo">
          🎓 Comrade<span>Hub</span>
        </Link>
        <Link to="/laundry" className="laundry-back-link">
          ← Back to Laundry
        </Link>
      </nav>

      <main className="post-laundry-container">
        <div className="laundry-form-heading">
          <span>🧺</span>
          <div>
            <h1>Register Laundry Service</h1>
            <p>Connect your laundry business with thousands of comrades.</p>
          </div>
        </div>

        {serverError && (
          <div className="laundry-form-alert error" role="alert">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="laundry-form">
          <section className="laundry-form-section">
            <h2>Service Information</h2>
            <div className="laundry-form-grid">
              <div className="laundry-form-group">
                <label>Business Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Fold Laundry"
                />
                {errors.name && <span className="laundry-error">{errors.name}</span>}
              </div>

              <div className="laundry-form-group">
                <label>Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Kahawa, Nairobi"
                />
                {errors.location && (
                  <span className="laundry-error">{errors.location}</span>
                )}
              </div>

              <div className="laundry-form-group full">
                <label>Service Area *</label>
                <input
                  name="serviceArea"
                  value={form.serviceArea}
                  onChange={handleChange}
                  placeholder="e.g. Kahawa, Roysambu, Ruiru"
                />
                {errors.serviceArea && (
                  <span className="laundry-error">{errors.serviceArea}</span>
                )}
              </div>

              <div className="laundry-form-group">
                <label>Starting Price (KES)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="200"
                  min="0"
                />
              </div>

              <div className="laundry-form-group">
                <label>Price Unit</label>
                <select
                  name="priceUnit"
                  value={form.priceUnit}
                  onChange={handleChange}
                >
                  {priceUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="laundry-form-section">
            <h2>Services Offered</h2>
            <div className="laundry-service-options">
              {serviceOptions.map((service) => (
                <button
                  type="button"
                  key={service}
                  className={
                    form.services.includes(service)
                      ? 'laundry-option selected'
                      : 'laundry-option'
                  }
                  onClick={() => toggleService(service)}
                >
                  {form.services.includes(service) ? '✓' : '+'}
                  {service}
                </button>
              ))}
            </div>
          </section>

          <section className="laundry-form-section">
            <h2>About Your Service</h2>
            <div className="laundry-form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="6"
                placeholder="Tell comrades about your laundry service..."
              />
              {errors.description && (
                <span className="laundry-error">{errors.description}</span>
              )}
            </div>
          </section>

          <section className="laundry-form-section">
            <h2>Photos</h2>
            <label className="laundry-photo-upload" htmlFor="laundry-images">
              <input
                id="laundry-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                hidden
              />
              <div>📷</div>
              <h3>Upload Photos</h3>
              <p>
                Add clear photos. Up to {MAX_IMAGES} images, max 5MB each.
              </p>
            </label>

            {errors.images && (
              <span className="laundry-error block">{errors.images}</span>
            )}

            {images.length > 0 && (
              <div className="laundry-image-grid">
                {images.map((img, index) => (
                  <div className="laundry-image-tile" key={img.preview}>
                    <img src={img.preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="laundry-remove-image"
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

          <section className="laundry-form-section">
            <h2>Contact</h2>
            <div className="laundry-form-grid">
              <div className="laundry-form-group">
                <label>Phone Number *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                />
                {errors.phone && <span className="laundry-error">{errors.phone}</span>}
              </div>

              <div className="laundry-form-group">
                <label>Email (optional)</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </section>

          <div className="laundry-form-actions">
            <button
              type="button"
              className="laundry-cancel"
              onClick={() => navigate('/laundry')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="laundry-submit"
              disabled={submitting}
            >
              {submitting ? 'Registering…' : 'Register Laundry →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PostLaundry;