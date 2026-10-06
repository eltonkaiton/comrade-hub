import { Link } from 'react-router-dom';
import './Terms.css';

function Terms() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="legal-container">
          <span>COMRADEHUB</span>
          <h1>Terms & Conditions</h1>
          <p>
            Please read these terms carefully before using the ComradeHub
            platform.
          </p>
          <small>Last updated: September 4, 2026</small>
        </div>
      </section>

      <main className="legal-main">
        <div className="legal-container legal-content">
          <div className="legal-introduction">
            <h2>Welcome to ComradeHub</h2>
            <p>
              These Terms and Conditions govern your use of ComradeHub,
              including our website, applications, marketplace, listings,
              communication features and other services.
            </p>
            <p>
              By accessing or using ComradeHub, you agree to comply with these
              terms. If you do not agree with these terms, please do not use
              the platform.
            </p>
          </div>

          <section>
            <h2>1. Eligibility</h2>
            <p>
              You must provide accurate information when creating an account.
              You are responsible for maintaining the confidentiality of your
              account information and for activities carried out through your
              account.
            </p>
          </section>

          <section>
            <h2>2. Using ComradeHub</h2>
            <p>
              ComradeHub provides a platform where users can discover, list,
              advertise and communicate about products, accommodation,
              transportation and services.
            </p>
            <p>
              You agree not to misuse the platform, interfere with its
              operation, attempt unauthorized access or use the platform for
              unlawful activities.
            </p>
          </section>

          <section>
            <h2>3. Listings and Advertisements</h2>
            <p>
              Users are responsible for the accuracy of information contained
              in their listings and advertisements. You must not post
              misleading, fraudulent, illegal or prohibited content.
            </p>
          </section>

          <section>
            <h2>4. Transactions Between Users</h2>
            <p>
              ComradeHub may connect buyers with sellers, tenants with
              landlords and customers with service providers. Unless explicitly
              stated otherwise, ComradeHub is not a party to transactions
              between users.
            </p>
            <p>
              Users should verify products, services, property details,
              identities, prices and payment instructions before completing a
              transaction.
            </p>
          </section>

          <section>
            <h2>5. Prohibited Activities</h2>
            <ul>
              <li>Fraudulent or deceptive activity.</li>
              <li>Posting illegal products or services.</li>
              <li>Harassment, threats or abusive communication.</li>
              <li>Uploading malicious software or harmful content.</li>
              <li>Impersonating another person or organization.</li>
              <li>Attempting to access another user's account.</li>
              <li>Using the platform to violate applicable laws.</li>
            </ul>
          </section>

          <section>
            <h2>6. User Content</h2>
            <p>
              You remain responsible for content you upload, including
              photographs, descriptions, messages and advertisements. You
              should only upload content that you have the right to use.
            </p>
          </section>

          <section>
            <h2>7. Account Suspension</h2>
            <p>
              ComradeHub may restrict, suspend or terminate accounts that
              violate these terms, engage in fraudulent activity or otherwise
              create risks for the platform or its users.
            </p>
          </section>

          <section>
            <h2>8. Platform Availability</h2>
            <p>
              We aim to keep ComradeHub available and reliable, but we cannot
              guarantee uninterrupted access. Maintenance, technical problems
              or circumstances outside our control may temporarily affect the
              service.
            </p>
          </section>

          <section>
            <h2>9. Changes to These Terms</h2>
            <p>
              We may update these Terms and Conditions as ComradeHub develops.
              Updated terms will be made available through the platform.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              If you have questions about these terms, please{' '}
              <Link to="/contact">contact the ComradeHub team</Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Terms;