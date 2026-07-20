import {Link} from 'react-router';

export default function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <div className="section-inner">
          <p className="policy-kicker">Gold Custom · Legal</p>
          <h1>Privacy Policy</h1>
          <p>
            How we collect, use, and protect information when you shop with Gold
            Custom.
          </p>
        </div>
      </section>

      <div className="section-inner policy-layout">
        <aside className="policy-aside" aria-label="Privacy policy sections">
          <p>In this policy</p>
          <a href="#information">Your information</a>
          <a href="#consent">Consent</a>
          <a href="#security">Security</a>
          <a href="#third-parties">Third parties</a>
          <a href="#changes">Policy changes</a>
        </aside>

        <article className="policy-content">
          <section className="policy-section" id="information">
            <h2>What do we do with your information?</h2>
            <p>
              When you purchase something from our store, as part of the buying
              and selling process, we collect the personal information you give
              us, such as your name, address, and email address.
            </p>
            <p>
              When you browse our store, we also automatically receive your
              computer&apos;s Internet Protocol (IP) address to provide us with
              information that helps us learn about your browser and operating
              system.
            </p>
          </section>

          <section className="policy-section" id="consent">
            <h2>Consent</h2>
            <p>
              When you provide us with personal information to complete a
              transaction, verify your credit card, place an order, arrange for
              a delivery, or return a purchase, we imply that you consent to our
              collecting it and using it for that specific reason only.
            </p>
          </section>

          <section className="policy-section" id="security">
            <h2>Disclosure &amp; Security</h2>
            <p>
              We may disclose your personal information if required by law or if
              you violate our Terms of Service. To protect your personal
              information, we take reasonable precautions and follow industry
              best practices. If you provide us with your credit card
              information, the information is encrypted using SSL and stored
              securely.
            </p>
          </section>

          <section className="policy-section" id="third-parties">
            <h2>Third-party services</h2>
            <p>
              Third-party providers used by us will only collect, use, and
              disclose your information to the extent necessary to perform their
              services. Please review third-party privacy policies for further
              details.
            </p>
          </section>

          <section className="policy-section" id="changes">
            <h2>Changes to this policy</h2>
            <p>
              We reserve the right to modify this privacy policy at any time. If
              we make material changes, we will post them here.
            </p>
          </section>

          <Link className="policy-home-link" to="/">
            Back to home
          </Link>
        </article>
      </div>
    </main>
  );
}
