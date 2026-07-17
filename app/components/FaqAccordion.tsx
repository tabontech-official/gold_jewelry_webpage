import type {Faq} from '~/lib/faqs';

export function FaqAccordion({faqs}: {faqs: Faq[]}) {
  if (!faqs.length) return null;

  return (
    <section className="home-section homepage-faq-section" aria-labelledby="homepage-faq-title">
      <div className="section-inner">
        <div className="homepage-faq-heading">
          <span>Concierge care</span>
          <h2 id="homepage-faq-title">Frequently Asked Questions</h2>
          <p>Everything you need to know before choosing your next piece.</p>
        </div>
        <div className="homepage-faq-list">
          {faqs.map((faq) => (
            <details className="homepage-faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
