import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Contact form submitted:', formData);

    alert(
      'Thank you for contacting ComradeHub. Your message has been received.'
    );

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <span>GET IN TOUCH</span>
          <h1>We’re Here to Help.</h1>
          <p>
            Have a question, suggestion, complaint or partnership idea?
            Contact the ComradeHub team and we’ll be happy to hear from you.
          </p>
        </div>
      </section>

      <main className="contact-main">
        <div className="contact-container contact-layout">
          <section className="contact-information">
            <span className="contact-label">CONTACT COMRADEHUB</span>
            <h2>Let’s Talk</h2>
            <p>
              Whether you need help using the platform or want to work with
              ComradeHub, send us a message.
            </p>

            <div className="contact-info-card">
              <div className="contact-info-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>eltonkaiton@gmail.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+254 797133131</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>Kenya</p>
              </div>
            </div>

            <div className="contact-support-box">
              <strong>Need immediate assistance?</strong>
              <p>
                Visit our Help Centre for answers to frequently asked
                questions.
              </p>
              <Link to="/help">Visit Help Centre →</Link>
            </div>
          </section>

          <section className="contact-form-card">
            <h2>Send Us a Message</h2>
            <p>Fill in the form below and our team will get back to you.</p>

            <form onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="7"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message →
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Contact;