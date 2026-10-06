import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

const faqs = [
  {
    question: 'What is ComradeHub?',
    answer:
      'ComradeHub is a digital platform designed to connect students and the surrounding community with products, accommodation, transport, businesses and useful services in one place.',
  },
  {
    question: 'How do I create an account?',
    answer:
      'Click Register from the navigation menu, enter your details, choose the type of account you want to use and complete the registration process.',
  },
  {
    question: 'Can I sell products on ComradeHub?',
    answer:
      'Yes. Registered users can create listings for products they want to sell. You can add photos, price, description and other relevant information.',
  },
  {
    question: 'Can I advertise my business?',
    answer:
      'Yes. Businesses and service providers can use ComradeHub to promote their services and reach potential customers within the community.',
  },
  {
    question: 'How can I find accommodation?',
    answer:
      'Go to Houses from the main menu. You can browse available accommodation listings and view information such as rent, location, amenities and availability.',
  },
  {
    question: 'Can I post something I am looking for?',
    answer:
      'Yes. The I Need feature allows you to describe what you are looking for. Relevant sellers, landlords or service providers can then respond.',
  },
  {
    question: 'Is ComradeHub responsible for transactions?',
    answer:
      'ComradeHub provides a platform for connecting users. Users should independently verify listings, sellers, service providers and transaction details before making payments or commitments.',
  },
  {
    question: 'What should I do if I find suspicious content?',
    answer:
      'Report suspicious listings, users or messages to the ComradeHub team. Avoid sending money or personal information until you are confident that the other party is legitimate.',
  },
];

function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <div className="help-page">
      <section className="help-hero">
        <div className="help-container">
          <span>COMRADEHUB HELP CENTRE</span>
          <h1>How Can We Help?</h1>
          <p>
            Find answers to common questions about buying, selling,
            accommodation, transport, accounts and using ComradeHub.
          </p>

          <div className="help-search">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Search for help..."
              aria-label="Search for help"
            />
          </div>
        </div>
      </section>

      <main className="help-main">
        <div className="help-container">
          <section className="help-categories">
            <Link to="/marketplace">
              <span>🛒</span>
              <strong>Marketplace</strong>
              <small>Buying & selling</small>
            </Link>

            <Link to="/houses">
              <span>🏠</span>
              <strong>Accommodation</strong>
              <small>Find a place</small>
            </Link>

            <Link to="/transport">
              <span>🚗</span>
              <strong>Transport</strong>
              <small>Find transport</small>
            </Link>

            <Link to="/profile">
              <span>👤</span>
              <strong>Account</strong>
              <small>Manage your account</small>
            </Link>
          </section>

          <section className="faq-section">
            <div className="help-heading">
              <span>FREQUENTLY ASKED QUESTIONS</span>
              <h2>Popular Questions</h2>
              <p>
                Here are answers to some of the most common questions from
                ComradeHub users.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div
                  className={`faq-item ${
                    openFaq === index ? 'faq-open' : ''
                  }`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{faq.question}</span>
                    <span>{openFaq === index ? '−' : '+'}</span>
                  </button>

                  {openFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="help-contact-card">
            <div>
              <span>STILL NEED HELP?</span>
              <h2>Our Team Is Ready to Assist</h2>
              <p>
                If you cannot find the answer you need, contact the ComradeHub
                team directly.
              </p>
            </div>

            <Link to="/contact">Contact Support →</Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Help;