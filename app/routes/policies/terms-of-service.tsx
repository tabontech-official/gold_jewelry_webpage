import {Link} from 'react-router';

export default function TermsOfService() {
  return (
    <div className="section-inner home-section">
      <div className="page">
        <h1>Terms of Service</h1>
        <p>
          We provide services to you subject to the notices, terms, and
          conditions set forth in this agreement. Before proceeding, please read
          this agreement because accessing, browsing, or otherwise using the
          Site indicates your agreement to all the terms and conditions in this
          agreement.
        </p>

        <h2>Prohibited content</h2>
        <p>
          You shall not upload, distribute, or otherwise publish through this
          Site any content that includes viruses, is libelous, threatening,
          defamatory, obscene, indecent, pornographic, discriminatory, or
          violates intellectual property rights.
        </p>

        <h2>Account security and age</h2>
        <p>
          You are responsible for maintaining the security of your account and
          for all activities that occur under your account. By accepting these
          terms, you certify that you are 18 years of age or older.
        </p>

        <h2>License</h2>
        <p>
          We grant you a limited, revocable, non-transferable, and
          non-exclusive license to access and use the Site for personal,
          non-commercial use.
        </p>

        <p>
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
