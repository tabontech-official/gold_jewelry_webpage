import {Link} from 'react-router';

export default function FAQ() {
  return (
    <div className="section-inner home-section">
      <div className="page">
        <h1>FAQ</h1>
        <p>Here are answers to frequently asked questions.</p>

        <h2>Order status</h2>
        <p>Track your order using the order confirmation email or contact us.</p>

        <h2>Shipping</h2>
        <p>We ship within the US and internationally. See our Shipping Policy for details.</p>

        <h2>Returns</h2>
        <p>Returns are accepted within 14 days as per our Refund Policy.</p>

        <p className="back-link">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
