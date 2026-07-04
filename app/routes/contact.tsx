import {Link} from 'react-router';

export default function Contact() {
  return (
    <div className="section-inner home-section">
      <div className="page">
        <h1>Contact Us</h1>
        <p>
          For questions about orders, appointments, or custom work, reach out
          to our customer care team.
        </p>

        <h2>Email</h2>
        <p>
          <a href="mailto:info@bayamjewelry.com">info@bayamjewelry.com</a>
        </p>

        <h2>Phone</h2>
        <p>
          <a href="tel:9299305655">929-930-5655</a>
        </p>

        <h2>Visit</h2>
        <p>10 W 46th St, Floor 17, New York, NY 10036 (By appointment)</p>

        <p className="back-link">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
