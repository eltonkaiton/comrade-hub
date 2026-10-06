import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateAdvertisement.css';

function CreateAdvertisement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    adType: '',
    description: '',
    businessName: '',
    location: '',
    phone: '',
    whatsapp: '',
    price: '',
    duration: '7',
    website: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Advertisement:', formData);

    alert(
      'Your advertisement has been submitted successfully! It will be reviewed before going live.'
    );

    navigate('/advertise');
  };

  return (
    <div className="create-ad-page">

      {/* NAVBAR */}
      <nav className="create-ad-navbar">
        <div className="create-ad-nav-container">

          <Link to="/" className="create-ad-logo">
            <span className="create-ad-logo-icon">C</span>
            <span>
              Comrade<span>Hub</span>
            </span>
          </Link>

          <div className="create-ad-nav-links">
            <Link to="/">Home</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/houses">Houses</Link>
            <Link to="/transport">Transport</Link>
            <Link to="/services">Services</Link>
            <Link to="/advertise" className="active">
              Advertise
            </Link>
          </div>

          <div className="create-ad-nav-actions" />

        </div>
      </nav>


      {/* PAGE HEADER */}
      <section className="create-ad-header">

        <div className="create-ad-header-inner">

          <Link to="/advertise" className="back-link">
            ← Back to Advertising
          </Link>

          <div className="header-content">

            <div>
              <span className="header-label">
                COMRADEHUB ADVERTISING
              </span>

              <h1>Create Your Advertisement</h1>

              <p>
                Promote your product, business, house, service or event
                to thousands of comrades.
              </p>
            </div>

            <div className="header-icon">
              📢
            </div>

          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}
      <main className="create-ad-content">

        <form onSubmit={handleSubmit}>

          <div className="create-ad-layout">

            {/* LEFT FORM */}
            <div className="create-ad-form-column">

              {/* BASIC INFORMATION */}
              <section className="ad-form-card">

                <div className="form-card-heading">
                  <div className="form-heading-icon">
                    📝
                  </div>

                  <div>
                    <h2>Advertisement Details</h2>
                    <p>
                      Tell us about what you want to advertise.
                    </p>
                  </div>
                </div>


                <div className="form-group">

                  <label htmlFor="adType">
                    Advertisement Type
                    <span>*</span>
                  </label>

                  <select
                    id="adType"
                    name="adType"
                    value={formData.adType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select advertisement type
                    </option>

                    <option value="product">
                      🛍️ Product Promotion
                    </option>

                    <option value="business">
                      🏢 Business Promotion
                    </option>

                    <option value="house">
                      🏠 House / Accommodation
                    </option>

                    <option value="service">
                      🛠️ Service Promotion
                    </option>

                    <option value="event">
                      🎉 Event Promotion
                    </option>
                  </select>

                </div>


                <div className="form-group">

                  <label htmlFor="title">
                    Advertisement Title
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Affordable Laptop Repair Services"
                    maxLength="100"
                    required
                  />

                  <small>
                    Use a clear and attractive title.
                  </small>

                </div>


                <div className="form-group">

                  <label htmlFor="description">
                    Description
                    <span>*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product, business, service or event..."
                    rows="6"
                    maxLength="1000"
                    required
                  />

                  <small>
                    {formData.description.length}/1000 characters
                  </small>

                </div>

              </section>


              {/* BUSINESS INFORMATION */}
              <section className="ad-form-card">

                <div className="form-card-heading">

                  <div className="form-heading-icon">
                    🏢
                  </div>

                  <div>
                    <h2>Contact & Business Information</h2>

                    <p>
                      Give interested comrades a way to reach you.
                    </p>
                  </div>

                </div>


                <div className="form-row">

                  <div className="form-group">

                    <label htmlFor="businessName">
                      Business / Seller Name
                    </label>

                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Comrade Tech Solutions"
                    />

                  </div>


                  <div className="form-group">

                    <label htmlFor="location">
                      Location
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Nairobi CBD"
                      required
                    />

                  </div>

                </div>


                <div className="form-row">

                  <div className="form-group">

                    <label htmlFor="phone">
                      Phone Number
                      <span>*</span>
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0712 345 678"
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label htmlFor="whatsapp">
                      WhatsApp Number
                    </label>

                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="e.g. 0712 345 678"
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label htmlFor="website">
                    Website / Social Media
                  </label>

                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. instagram.com/yourbusiness"
                  />

                </div>

              </section>


              {/* PRICE */}
              <section className="ad-form-card">

                <div className="form-card-heading">

                  <div className="form-heading-icon">
                    💰
                  </div>

                  <div>
                    <h2>Pricing Information</h2>

                    <p>
                      Optional information about your product or service.
                    </p>
                  </div>

                </div>


                <div className="form-group">

                  <label htmlFor="price">
                    Price / Starting From
                  </label>

                  <div className="price-input">

                    <span>KES</span>

                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                    />

                  </div>

                </div>

              </section>


              {/* IMAGE */}
              <section className="ad-form-card">

                <div className="form-card-heading">

                  <div className="form-heading-icon">
                    📸
                  </div>

                  <div>
                    <h2>Advertisement Image</h2>

                    <p>
                      Upload an attractive image for your advertisement.
                    </p>
                  </div>

                </div>


                {!preview ? (

                  <label className="image-upload">

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                    />

                    <div className="upload-icon">
                      📤
                    </div>

                    <strong>
                      Click to upload an image
                    </strong>

                    <span>
                      PNG, JPG or WEBP • Recommended: 1200 × 800px
                    </span>

                  </label>

                ) : (

                  <div className="image-preview-container">

                    <img
                      src={preview}
                      alt="Advertisement preview"
                      className="image-preview"
                    />

                    <button
                      type="button"
                      className="remove-image"
                      onClick={removeImage}
                    >
                      ✕ Remove Image
                    </button>

                  </div>

                )}

              </section>


              {/* DURATION */}
              <section className="ad-form-card">

                <div className="form-card-heading">

                  <div className="form-heading-icon">
                    📅
                  </div>

                  <div>
                    <h2>Advertisement Duration</h2>

                    <p>
                      Choose how long your advertisement should run.
                    </p>
                  </div>

                </div>


                <div className="duration-options">

                  <label
                    className={
                      formData.duration === '7'
                        ? 'duration-option selected'
                        : 'duration-option'
                    }
                  >

                    <input
                      type="radio"
                      name="duration"
                      value="7"
                      checked={formData.duration === '7'}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>7 Days</strong>
                      <span>Good for short promotions</span>
                    </div>

                  </label>


                  <label
                    className={
                      formData.duration === '14'
                        ? 'duration-option selected'
                        : 'duration-option'
                    }
                  >

                    <input
                      type="radio"
                      name="duration"
                      value="14"
                      checked={formData.duration === '14'}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>14 Days</strong>
                      <span>Reach more comrades</span>
                    </div>

                  </label>


                  <label
                    className={
                      formData.duration === '30'
                        ? 'duration-option selected'
                        : 'duration-option'
                    }
                  >

                    <input
                      type="radio"
                      name="duration"
                      value="30"
                      checked={formData.duration === '30'}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>30 Days</strong>
                      <span>Maximum exposure</span>
                    </div>

                  </label>

                </div>

              </section>


              {/* SUBMIT */}
              <div className="submit-section">

                <div className="submit-notice">
                  <span>🔒</span>

                  <p>
                    Your advertisement will be reviewed before
                    publication to keep ComradeHub safe for everyone.
                  </p>
                </div>


                <div className="submit-buttons">

                  <Link
                    to="/advertise"
                    className="cancel-btn"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="submit-ad-btn"
                  >
                    📢 Submit Advertisement
                  </button>

                </div>

              </div>

            </div>


            {/* RIGHT SIDEBAR */}
            <aside className="create-ad-sidebar">

              {/* PREVIEW */}
              <div className="preview-card">

                <div className="preview-header">

                  <div>
                    <span>PREVIEW</span>
                    <h3>Your Advertisement</h3>
                  </div>

                  <span className="preview-status">
                    DRAFT
                  </span>

                </div>


                <div className="ad-preview">

                  <div className="preview-image">

                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                      />
                    ) : (
                      <div>
                        📢
                        <span>Advertisement Image</span>
                      </div>
                    )}

                  </div>


                  <div className="preview-body">

                    {formData.adType && (
                      <span className="preview-category">
                        {formData.adType}
                      </span>
                    )}

                    <h4>
                      {formData.title ||
                        'Your Advertisement Title'}
                    </h4>

                    <p>
                      {formData.description ||
                        'Your advertisement description will appear here.'}
                    </p>


                    {formData.price && (
                      <strong className="preview-price">
                        KES {Number(formData.price).toLocaleString()}
                      </strong>
                    )}


                    <div className="preview-location">

                      <span>📍</span>

                      <span>
                        {formData.location ||
                          'Your location'}
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* TIPS */}
              <div className="tips-card">

                <h3>
                  💡 Advertising Tips
                </h3>

                <ul>

                  <li>
                    Use a clear and attractive title.
                  </li>

                  <li>
                    Upload a high-quality image.
                  </li>

                  <li>
                    Give enough information about your offer.
                  </li>

                  <li>
                    Include a working phone or WhatsApp number.
                  </li>

                  <li>
                    Keep your advertisement honest and accurate.
                  </li>

                </ul>

              </div>


              {/* SAFETY */}
              <div className="safety-card">

                <div className="safety-icon">
                  🛡️
                </div>

                <div>

                  <h3>
                    Community Safety
                  </h3>

                  <p>
                    ComradeHub reviews advertisements to help
                    maintain a trusted community.
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </form>

      </main>


      {/* FOOTER */}
      <footer className="create-ad-footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <Link to="/" className="create-ad-logo">

              <span className="create-ad-logo-icon">
                C
              </span>

              <span>
                Comrade<span>Hub</span>
              </span>

            </Link>

            <p>
              Everything Comrades Need, In One Place.
            </p>

          </div>


          <div className="footer-links">

            <Link to="/marketplace">
              Marketplace
            </Link>

            <Link to="/houses">
              Houses
            </Link>

            <Link to="/transport">
              Transport
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/help">
              Help
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>

        </div>

        <div className="footer-bottom">
          © 2026 ComradeHub. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default CreateAdvertisement;