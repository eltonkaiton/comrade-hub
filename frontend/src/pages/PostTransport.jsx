import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './PostTransport.css';

const API_BASE_URL = 'https://comradehub-api.onrender.com';
const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function PostTransport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    type: '',
    location: '',
    serviceArea: '',
    phone: '',
    price: '',
    description: '',
    services: [],
    contactEmail: '',
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const serviceOptions = [
    'Campus Trips',
    'Town Trips',
    'Deliveries',
    'Errands',
    'Airport Transfers',
    'Car Hire',
    'Events',
    'Moving Services',
    'Long Distance Trips',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
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
    if (!form.type) next.type = 'Transport type is required';
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
      setServerError('You must be logged in to register a transport service.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('type', form.type);
      formData.append('location', form.location.trim());
      formData.append('serviceArea', form.serviceArea.trim());
      formData.append('phone', form.phone.trim());
      formData.append('price', String(Number(form.price) || 0));
      formData.append('description', form.description.trim());
      formData.append('services', JSON.stringify(form.services));
      formData.append('contactEmail', form.contactEmail.trim());

      images.forEach(({ file }) => formData.append('images', file));

      const response = await fetch(`${API_BASE_URL}/api/transport`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to register transport (${response.status})`
        );
      }

      const createdId = data?.transport?._id || data?.transport?.id;
      navigate(createdId ? `/transport/${createdId}` : '/transport');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-transport-page">
      <nav className="post-transport-nav">
        <Link to="/" className="post-transport-logo">
          🎓 Comrade<span>Hub</span>
        </Link>
        <Link to="/transport" className="transport-back-link">
          ← Back to Transport
        </Link>
      </nav>

      <main className="post-transport-container">
        <div className="transport-form-heading">
          <span>🚗</span>
          <div>
            <h1>Register Transport Service</h1>
            <p>Connect your transport service with thousands of comrades.</p>
          </div>
        </div>

        {serverError && (
          <div className="transport-form-alert error" role="alert">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="transport-form">
          <section className="transport-form-section">
            <h2>Service Information</h2>
            <div className="transport-form-grid">
              <div className="transport-form-group">
                <label>Business / Provider Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Brian Boda Services"
                />
                {errors.name && <span className="transport-error">{errors.name}</span>}
              </div>

              <div className="transport-form-group">
                <label>Transport Type *</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="">Select type</option>
                  <option>Boda Boda</option>
                  <option>Tuk Tuk</option>
                  <option>Taxi</option>
                  <option>Car Hire</option>
                  <option>Van / Moving</option>
                  <option>School / Campus Transport</option>
                  <option>Bus</option>
                </select>
                {errors.type && <span className="transport-error">{errors.type}</span>}
              </div>

              <div className="transport-form-group">
                <label>Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Kahawa, Nairobi"
                />
                {errors.location && (
                  <span className="transport-error">{errors.location}</span>
                )}
              </div>

              <div className="transport-form-group">
                <label>Starting Fare (KES)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                />
              </div>

              <div className="transport-form-group full">
                <label>Service Area *</label>
                <input
                  name="serviceArea"
                  value={form.serviceArea}
                  onChange={handleChange}
                  placeholder="e.g. Kahawa, Roysambu, Ruiru & Thika Road"
                />
                {errors.serviceArea && (
                  <span className="transport-error">{errors.serviceArea}</span>
                )}
              </div>
            </div>
          </section>

          <section className="transport-form-section">
            <h2>Services Offered</h2>
            <div className="transport-service-options">
              {serviceOptions.map((service) => (
                <button
                  type="button"
                  key={service}
                  className={
                    form.services.includes(service)
                      ? 'transport-option selected'
                      : 'transport-option'
                  }
                  onClick={() => toggleService(service)}
                >
                  {form.services.includes(service) ? '✓' : '+'}
                  {service}
                </button>
              ))}
            </div>
          </section>

          <section className="transport-form-section">
            <h2>About Your Service</h2>
            <div className="transport-form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="6"
                placeholder="Tell comrades about your transport service..."
              />
              {errors.description && (
                <span className="transport-error">{errors.description}</span>
              )}
            </div>
          </section>

          <section className="transport-form-section">
            <h2>Vehicle / Service Photos</h2>
            <label className="transport-photo-upload" htmlFor="transport-images">
              <input
                id="transport-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                hidden
              />
              <div>🚘</div>
              <h3>Upload Photos</h3>
              <p>
                Add clear photos. Up to {MAX_IMAGES} images, max 5MB each.
              </p>
            </label>

            {errors.images && (
              <span className="transport-error block">{errors.images}</span>
            )}

            {images.length > 0 && (
              <div className="transport-image-grid">
                {images.map((img, index) => (
                  <div className="transport-image-tile" key={img.preview}>
                    <img src={img.preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="transport-remove-image"
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

          <section className="transport-form-section">
            <h2>Contact Information</h2>
            <div className="transport-form-grid">
              <div className="transport-form-group">
                <label>Phone Number *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                />
                {errors.phone && (
                  <span className="transport-error">{errors.phone}</span>
                )}
              </div>

              <div className="transport-form-group">
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

          <div className="transport-form-actions">
            <button
              type="button"
              className="transport-cancel"
              onClick={() => navigate('/transport')}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="transport-submit"
              disabled={submitting}
            >
              {submitting ? 'Registering…' : 'Register Transport →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PostTransport;