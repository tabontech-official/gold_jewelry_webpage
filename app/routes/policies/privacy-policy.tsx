import {Link} from 'react-router';

export default function PrivacyPolicy() {
  return (
    <div className="section-inner home-section">
      <div className="page">
        <h1>Privacy Policy</h1>

        <h2>What do we do with your information?</h2>
        <p>
          When you purchase something from our store, as part of the buying and
          selling process, we collect the personal information you give us,
          such as your name, address, and email address.
        </p>
        <p>
          When you browse our store, we also automatically receive your
          computer’s Internet Protocol (IP) address to provide us with
          information that helps us learn about your browser and operating
          system.
        </p>

        <h2>Consent</h2>
        <p>
          When you provide us with personal information to complete a
          transaction, verify your credit card, place an order, arrange for a
          delivery, or return a purchase, we imply that you consent to our
          collecting it and using it for that specific reason only.
        </p>

        <h2>Disclosure & Security</h2>
        <p>
          We may disclose your personal information if required by law or if
          you violate our Terms of Service. To protect your personal
          information, we take reasonable precautions and follow industry best
          practices. If you provide us with your credit card information, the
          information is encrypted using SSL and stored securely.
        </p>

        <h2>Third-party services</h2>
        <p>
          Third-party providers used by us will only collect, use, and disclose
          your information to the extent necessary to perform their services.
          Please review third-party privacy policies for further details.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We reserve the right to modify this privacy policy at any time. If we
          make material changes, we will post them here.
        </p>

        <p>
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
