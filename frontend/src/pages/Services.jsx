import { Link } from 'react-router-dom';
import './Services.css';

const services = [
  {
    icon: '🛒',
    title: 'Marketplace',
    description:
      'Buy and sell electronics, clothes, furniture, books, accessories and other items within the ComradeHub community.',
    link: '/marketplace',
    button: 'Explore Marketplace',
  },
  {
    icon: '🏠',
    title: 'Accommodation',
    description:
      'Find bedsitters, hostels, rooms and houses near your campus or preferred location.',
    link: '/houses',
    button: 'Find a House',
  },
  {
    icon: '🚗',
    title: 'Transport',
    description:
      'Connect with trusted motorists offering boda boda, tuk-tuk, car, van and moving services.',
    link: '/transport',
    button: 'Find Transport',
  },
  {
    icon: '💼',
    title: 'Local Services',
    description:
      'Discover businesses and professionals offering useful services to students and the surrounding community.',
    link: '/services',
    button: 'View Services',
  },
  {
    icon: '📢',
    title: 'Advertising',
    description:
      'Promote your products, business, accommodation or services to a targeted ComradeHub audience.',
    link: '/advertise',
    button: 'Advertise With Us',
  },
  {
    icon: '🔎',
    title: 'I Need...',
    description:
      'Post exactly what you are looking for and allow sellers, landlords and service providers to respond.',
    link: '/requests',
    button: 'Post a Request',
  },
];

const popularServices = [
  'Cyber & Printing',
  'Food & Restaurants',
  'Salon & Barber',
  'Electronics',
  'Clothing & Fashion',
  'Photography',
  'Tutoring',
  'Repair Services',
];

function Services() {
  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-container services-hero-content">
          <span className="services-badge">COMRADEHUB SERVICES</span>

          <h1>
            Everything You Need,
            <span> In One Place.</span>
          </h1>

          <p>
            Discover products, accommodation, transport and professional
            services designed to make campus life easier and more convenient.
          </p>

          <div className="services-hero-actions">
            <Link to="/marketplace" className="services-primary-btn">
              Explore Marketplace
            </Link>

            <Link to="/requests/create" className="services-secondary-btn">
              I Need Something
            </Link>
          </div>
        </div>
      </section>

      <main>
        <section className="services-section">
          <div className="services-container">
            <div className="services-section-heading">
              <span>WHAT WE OFFER</span>
              <h2>Services Built for Comrades</h2>
              <p>
                Whether you are buying, selling, looking for accommodation,
                finding transport or promoting your business, ComradeHub
                connects you with what you need.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <div className="service-icon">{service.icon}</div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <Link to={service.link} className="service-card-link">
                    {service.button}
                    <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="popular-services-section">
          <div className="services-container">
            <div className="popular-services-content">
              <div>
                <span className="small-heading">POPULAR CATEGORIES</span>
                <h2>Find Local Services</h2>
                <p>
                  Discover businesses and professionals around your campus and
                  community.
                </p>
              </div>

              <div className="popular-service-list">
                {popularServices.map((service) => (
                  <Link
                    to="/services"
                    className="popular-service-item"
                    key={service}
                  >
                    <span>✓</span>
                    {service}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="services-business-section">
          <div className="services-container">
            <div className="business-card">
              <div>
                <span className="small-heading">FOR BUSINESS OWNERS</span>
                <h2>Grow Your Business With ComradeHub</h2>
                <p>
                  Reach students and customers around you by listing your
                  business, products or services on ComradeHub.
                </p>
              </div>

              <Link to="/advertise" className="business-btn">
                Start Advertising →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Services;